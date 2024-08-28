const express = require('express');
const router = express.Router();

router.get('/applications', async (req, res) => {
  const knex = req.app.get('knex')
  try {
    const applications = await knex('applications')
      .join('users', 'applications.wid', '=', 'users.wid')
      .select(
        'applications.record_id',
        'applications.wid',
        'users.advisor',
        'applications.semester',
        'applications.status',
        'applications.notes',
        'applications.waiver',
        'applications.d_update',
        'applications.dars_updated_by',
        'users.first_name',
        'users.last_name',
        'users.email',
        'users.eid', 
      );
    console.log(applications);
    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
