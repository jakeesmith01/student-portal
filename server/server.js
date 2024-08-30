//TODO: Update all http to https address, local env was not set up correctly. 
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const serverConfig = require('./configs/server');
const knexConfig = require('./configs/db');
const knex = require('knex')(knexConfig);

const app = express();
const PORT = serverConfig.port || 3001;

app.set('knex', knex);

app.disable('etag');

app.use(express.json());

app.use(session({
  // We want a unique session secret for the application, 
  // ideally stored as an environment variable.
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  // resave forces the session to be written back to the 
  // session store when no changes have been made
  resave: false,
  // saveUninitialized allows new and unmodified sessions
  // to be saved to the session store.  Since we're using 
  // the username to determine login status, `true` is fine.
  saveUninitialized: true,
  // Cookie-specific settings
  cookie: { 
    // secure requires the client to be using https
    secure: false
  }
}));

// Middleware
const corsConfig = require('./middleware/corsConfig');
app.use(corsConfig);

// Routes
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dataRoutes = require('./routes/dataRoutes');
const authRoutes = require('./routes/auth'); // Renamed for clarity
const adminRoutes = require('./routes/adminRoutes');

// Use routes
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', applicationRoutes);
app.use('/api', dataRoutes);
app.use('/api', authRoutes);
app.use('/api', adminRoutes);

//const loginRequired = require('./middleware/login-required');
// Serve info about the logged-in user.  Since only 
// logged-in users should see this page, use the loginRequired
// middleware to return a permission denied error if the user
// is not authenticated.

//TODO: Understand and implement 
// app.get('/whoami', loginRequired, (req, res) => {
//   // Serve the logged-in user's information.  This 
//   // can be expanded to offer more information.
//   res.json({
//     username: req.session.username
//   });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});