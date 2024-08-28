const express = require('express');
const { route } = require('./applicationRoutes');
const router = express.Router();

router.get('/courses', async (req, res) => {  
    const knex = req.app.get('knex')
    const id = req.query.id; 
    if (!id) {
        console.log('No WID provided!');
        return res.status(400).send('WID is required');
    }
    try {
        
        let courses = await knex('report')
        .select("class_subject", "class_catalog", "class_descr", "grade", "class_status")
        .where('wid', id);
        
        // Set default status based on grade
        courses = courses.map(course => ({
            ...course,
            status: course.class_status || '',
            grade: course.grade || 'N/A',
        }));
    
        const response = { 
            courses,
        };
    
        console.log(response);
        res.json(response);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).send('Server error');
    }  
});

function getNthWeekdayFallSummer(year, month, weekday, n) {    
    let date = new Date(year, month - 1, 1); 
    let count = 0; 
    
    if (date.getDay() > weekday) {
      count++;
    }
    while (date.getDay() !== weekday) {
        date.setDate(date.getDate() + 1);
    }
    while (true) {
        count++;
        if (count === n) {
            return date.getDate();
        }
        date.setDate(date.getDate() + 7); 
    }
}

function getNthWeekday(year, month, weekday, n) {
    let count = 0;
    let date = new Date(year, month - 1, 1);
    while (true) {
        if (date.getDay() === weekday) {
            count++;
            if (count === n) {
                return date.getDate();
            }
        }
        date.setDate(date.getDate() + 1);
    }
}

function determineSemester(dateInput) {
    const date = new Date(dateInput + 'Z');
	console.log("Current Date1: " + date); 
    const year = date.getFullYear();
    const fallStart = new Date(year, 7, getNthWeekdayFallSummer(year, 8, 1, 4));  
    const springStart = new Date(year, 0, getNthWeekday(year, 1, 2, 3)); 
    const summerStart = new Date(year, 4, getNthWeekdayFallSummer(year, 5, 1, 4));  
    const nextSpringStart = new Date(year + 1, 1, getNthWeekday(year + 1, 1, 2, 3)); 

    if ((date >= fallStart || date < springStart) && date < nextSpringStart) { 
        return 'Fall ' + year;
    }
    if (date >= springStart && date < summerStart) { 
        return 'Spring ' + year;
    }
    if (date >= summerStart && date < fallStart) { 
        return 'Summer ' + year;
    }  
    return "Date does not fall within the academic calendar year."; // Default return for out of range dates. should not hit. 
}

router.post('/submitApplication', async (req, res) => {
    const knex = req.app.get('knex')
    const { studentData, additionalInfo, courses } = req.body;
    console.log('submitting application for wid: ' + studentData.wid);  
    const now = new Date();  
    const formattedDateForDB = now.toISOString().slice(0, 19).replace('T', ' ');
    let message = 'Ope, nothing happened...';
    const semester = determineSemester(now);
    try {
        const existingApplication = await knex('applications')
            .where({
                wid: studentData.wid
            })
            .first(); //first matching or null 

        if (!existingApplication) { 
            await knex('applications').insert({
                wid: studentData.wid, 
                semester: semester,
                status: "Pending",
                notes: additionalInfo,
                waiver: false,
                d_update: formattedDateForDB
            });
            message = `Application Submitted ${now.toDateString()} ${now.toTimeString()}`;
        } else { 
            console.log('An application for this wid:', studentData.wid, 'has already been submitted. Updating notes and courses isntead.'); 
            if (additionalInfo.trim()) { // Check if additionalInfo has content before updating
                const currentNotes = existingApplication.notes || '';
                const updatedNotes = `${formattedDateForDB}\n${additionalInfo.trim()}\n${currentNotes}`;
                await knex('applications')
                    .where({ wid: studentData.wid })
                    .update({ notes: updatedNotes, 
                              d_update: formattedDateForDB 
                            });
                message = `An application exists for wid: ${studentData.wid}. Updating courses and notes! ${now.toDateString()} ${now.toTimeString()}`
            } else {
                message = `An application exists for wid: ${studentData.wid}. No new notes to add, updating courses.`
            }
        }

        // Update courses in the report table
        await Promise.all(Object.entries(courses).map(([key, {status, grade}]) => {
            const [class_subject, class_catalog] = key.split('-');   
            return knex('report')
                .where({ wid: studentData.wid, class_subject, class_catalog })
                .update({ class_status: status, grade, update_time: formattedDateForDB });
        }));
 
        res.status(200).json({ message: message });
    } catch (err) {
        console.error('Error submitting application:', err);
        res.status(500).send('Server error');
    }
});
 
module.exports = router;
