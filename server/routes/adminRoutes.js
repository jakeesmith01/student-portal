const express = require('express');
const router = express.Router();
//const isAdmin = require('../middleware/admin-required');
//router.use(isAdmin);



router.post('/disableApplications', async (req, res) => {
    const knex = req.app.get('knex')
    const { ids } = req.body; // Expect an array of IDs

    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'No application IDs provided' });
    }

    try {
        const updateResponse = await knex('applications')
            .whereIn('wid', ids)  
            .update({ status: 'denied' });

        if (updateResponse) {
            res.json({ message: 'Applications disabled successfully', disabledIds: ids }); //status update, need to update last change/update time
        } else {
            res.status(400).json({ message: 'No applications were disabled' });
        }
    } catch (err) {
        console.error('Error disabling applications:', err);
        res.status(500).send('Server error');
    }
});

router.post('/sendEmail', async (req, res) => {
    const knex = req.app.get('knex')
    const { ids } = req.body; // Expect an array of IDs
    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'No application IDs provided' });
    }

    try {
        const users = await knex('users')
            .join('applications', 'users.wid', '=', 'applications.wid')
            .whereIn('applications.wid', ids)
            .select('users.email'); 

        const emails = users.map(u => u.email);
 
        // Placeholder for email sending logic
        emails.forEach(email => {
            // sendEmailFunction(subject, email, body);
            console.log("Email: " + email);
        });

        res.json({ message: 'Emails sent successfully' });
    } catch (err) {
        console.error('Error sending emails:', err);
        res.status(500).send('Server error');
    }
});

const updateApplicationNotes = async (appId, notes) => {
    const knex = req.app.get('knex')
    const now = new Date();
    const formattedDateForDB = now.toISOString().slice(0, 19).replace('T', ' ');

    const updatedNotes = `${formattedDateForDB}\n${notes}`;

    await knex('applications')
        .where('wid', appId) // Use `where`, not `whereIn` for a single ID
        .update({ notes: updatedNotes, d_update: formattedDateForDB });
};

router.post('/saveNotes', async (req, res) => {
    const knex = req.app.get('knex')
    const appId = req.query.appId; // Correctly access the appId from the query parameters
    const { notes } = req.body; 

    try { 
        await updateApplicationNotes(appId, notes);
        console.log("notes saved!");
        res.status(200).json({ message: `Notes updated successfully for wid: ${appId}.` });
    } catch (err) {
        console.error('Error updating notes:', err);
        res.status(500).json({ message: `Failed to update notes for wid: ${appId}.` });
    }
});

router.post('/updateApplication', async (req, res) => {
    const knex = req.app.get('knex')
    const appId = req.query.appId; 
    const { notes, status, dars_updated_by } = req.body; 

    try {
        if (notes) {
            await updateApplicationNotes(appId, notes);
        }
        
        await knex('applications')
            .where('wid', appId)
            .update({ 
                status: status,
                dars_updated_by: dars_updated_by
            });

        res.status(200).json({ message: `Application updated successfully for wid: ${appId}.` });
    } catch (err) {
        console.error('Error updating application:', err);
        res.status(500).json({ message: `Failed to update application for wid: ${appId}.` });
    }
});

module.exports = router;
