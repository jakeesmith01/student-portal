// Nabbed from https://github.com/zombiepaladin/react-cas-example
const process = require('process');
const express = require('express');
const axios = require('axios'); 
const {XMLParser} = require('fast-xml-parser');
const router = express.Router();

// The serviceHost (our server) and casHost (the CAS server)
// hostnames, we nee to build urls.  Since we pass our serviceHost
// as a url component in the search string, we need to url-encode it. 
var serviceHost = encodeURIComponent(process.env.API_URL + '/api/');
var casHost = process.env.CAS_HOST; //'//'https://signin.k-state.edu/WebISO/';
 
// Retrieves the currently-signed in user
router.get('/whoami', async (req, res) => {
  const knex = req.app.get('knex')
  console.log('whoami', req.session.user)

  // If we don't have a session, we're definitely not logged in
  if(!(req.session && req.session.user)) return res.status(401).json('No user logged in')

  try {
      const user = await knex('users')
          .first('id', 'eid', 'email', 'first_name', 'last_name', 'admin')
          .where({id: req.session.user.id})
console.log({user});
      if(!user) res.status(401).json('No user logged in')
      else res.json(user);
  } catch (err) {
      console.error(err)
      res.status(500, 'Server error')
  }
})

// Process incoming login request by sending the user to the CAS server
router.get('/login', (req, res) => {
  const returnUrl = req.query.returnUrl || '/';
  console.log("User is logging in!");
  req.session.returnUrl = returnUrl;
  console.log("SessionID: " + req.sessionID);
  res.redirect(`${casHost}login?service=${serviceHost}ticket`)
});

// Process incoming logout request 
router.get('/logout', (req, res) => {
  // Destroy the session with this app
  req.session.destroy();
  // Also redirect to CAS server logout to end its session
  res.redirect(`${casHost}logout`);
})

// Validate redirected login requests coming from the CAS server
router.get('/ticket', async (req, res) => {
  const knex = req.app.get('knex')
  // get the ticket from the querystring
  const ticket = req.query.ticket;
  // We need to verify this ticket with the CAS server,
  // by making a request against its serviceValidate url
  var url = `${casHost}serviceValidate?ticket=${ticket}&service=${serviceHost}ticket`;
  // We'll use the fetch api to talk to the CAS server.  This can throw errors, so
  // we'll wrap it in a try-catch
  try {
    // We'll make an asynchronous request, so we await the response
    const response = await axios.get(url);
    
    // The response is in XML, so we'll parse it for easier access
    const parser = new XMLParser();
    const json = parser.parse(response.data);

    // If the response contains a cas:authenticationSuccess node, 
    // we know login was successful
    if(json['cas:serviceResponse']['cas:authenticationSuccess']) {
    
      // We'll extract the eid and wid from the response, and generate the email
      const eid = json['cas:serviceResponse']['cas:authenticationSuccess']['cas:user'];
      const wid = json['cas:serviceResponse']['cas:authenticationSuccess']['cas:ksuPersonWildcatID'];
      const email = `${eid}@ksu.edu`;

      // We need to retrieve the user record, or insert it if it does not exist yet
      
      // Try inserting the user, in case they don't exist in the db yet
      // we use onConflict to merge updated information instead.
      await knex('users')
        .insert({eid, wid, email})
        .onConflict('eid', 'wid', 'email')
        .merge()
      const user = await knex('users')
        .first()
        .where({wid})
        //.whereRaw('lower(eid) = ?', [req.session.username.toLowerCase()])
        
      if (user) {
        req.session.user = {
            id: user.id,
            eid: user.eid, 
            wid: user.wid,           
            role: user.admin ? 'admin' : 'user'  // Set role based on the admin column
        };
        // Redirect back to the requested page
        res.redirect(req.session.returnUrl || '/');
      } else {
        // Handle error if user is not found
        res.status(404).send("User not found");
      } 
    } else {
      res.status(403).send("Authentication failed");
    }

  } catch (err) {
    // If we caught an error, log it to the console
    console.error(err);
    // and send a 500 status code 
    res.status(500).send('Sorry. Something went wrong.')
  }
});

module.exports = router;