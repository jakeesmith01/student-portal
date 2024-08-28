const express = require('express');
const router = express.Router();

//TODO: The end point should be changed to something like 'login' then use userContext to populate profile and application page
router.get('/getUserDetail', async (req, res) => {
    const knex = req.app.get('knex')
    console.log('Getting User Details for EID: ' + req.query.id);
    const eid = req.query.id; 
    if (!eid) {
        console.log('No EID provided!');
        return res.status(400).send('EID is required');
    }
    try {
        const data = await knex('users')
                            .select('wid', 'first_name', 'last_name', 'email', 'advisor', 'admin', 'eid')
                            .whereRaw('lower(eid) = ?', [eid.toLowerCase()]);
        const query = knex('users')
                            .select('wid', 'first_name', 'last_name', 'email', 'advisor', 'admin', 'eid')
                            .whereRaw('lower(eid) = ?', [eid.toLowerCase()])
                            .toString();
        console.log(query);  
        console.log(data);
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Server error');
    }
});

router.put('/updateUserName', async (req, res) => {
    const knex = req.app.get('knex')
    console.log('Updating User Name for EID: ' + req.query.eid);
    const eid = req.query.eid;
    const { firstName, lastName } = req.body; // Extract the new first and last names from the request body
    console.log("First name: " + firstName);
    console.log("Last name: " + lastName);
    if (!eid) {
        console.log('No EID provided!');
        return res.status(400).send('EID is required');
    }

    if (!firstName || !lastName) {
        console.log('First name and last name are required');
        return res.status(400).send('First name and last name are required');
    }

    try { 
        const update = await knex('users')
                              .whereRaw('lower(eid) = ?', [eid.toLowerCase()])
                              .update({
                                  first_name: firstName,
                                  last_name: lastName
                              });

        if (update) {
            console.log(`User with EID: ${eid} updated successfully to ${firstName} ${lastName}.`);
            res.send(`User with EID: ${eid} updated successfully to ${firstName} ${lastName}.`);
        } else {
            console.log(`User with EID: ${eid} not found.`);
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Server error');
    }
}); 

router.post('/updateAdvisor', async (req, res) => {
    const knex = req.app.get('knex')
    const eid = req.query.eid;
    const { newAdvisor } = req.body;
    try { 
        const update = await knex('users')
                              .whereRaw('lower(eid) = ?', [eid.toLowerCase()])
                              .update({
                                  advisor: newAdvisor 
                              });  
        if (update) {
            console.log(`User with EID: ${eid} advisor updated successfully to ${newAdvisor}.`);
            res.json({ message: `User with EID: ${eid} advisor updated successfully to ${newAdvisor}.` });
        } else {
            console.log(`User with EID: ${eid} not found.`);
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
