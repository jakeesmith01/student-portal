const express = require('express');
const router = express.Router();

router.get('/GETEVERYTHING', async (req, res) => {
    const knex = req.app.get('knex')
    try {
        const data = await knex.select('*').from('dars_data');
        console.log(data);
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Server error');
    }
});
 
module.exports = router;
