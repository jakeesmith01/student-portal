const knexConfig = require('./configs/db');
const knex = require('knex')(knexConfig);
const fs = require('fs').promises
const {parse} = require('csv-parse/sync')


async function run() {

  await knex('programs')
    .insert({
      name: "Bachelor of Computer Science - Computer Science",
      plan: "BCS",
      subplan: "BCSCS"
    }, ['id'])
    .onConflict(['name']).merge()
  const bcscs = await knex('programs')
    .limit(1)
    .where({name: 'Bachelor of Computer Science - Computer Science'})
    .pluck('id')
    
  await knex('programs')
     .insert({
      name: "Bachelor of Computer Science - Software Engineering",
      plan: "BCS",
      subplan: "BCSSE"
    },['id'])
    .onConflict(['name']).merge()
  const bcsse = await knex('programs')
    .limit(1)
    .where({name: 'Bachelor of Computer Science - Software Engineering'})
    .pluck('id')

  await knex('programs')
    .insert({
      name: "???",
      plan: "NCS"
    },['id'])
    .onConflict(['name']).merge()
  const ncs = await knex('programs')
    .limit(1)
    .where({name: '???'})
    .pluck('id')

  await knex('programs')
    .insert({
      name: "Pre-Professional CS",
      plan: "UCS"
    },['id'])
    .onConflict(['name']).merge()
  const ucs = await knex('programs')
    .limit(1)
    .where({name: 'Pre-Professional CS'})
    .pluck('id')

  await knex('programs')
    .insert({
      name: "Bachelor of Computer Science",
      plan: "BCS"
    },['id'])
    .onConflict(['name']).merge()
  const bcs = await knex('programs')
    .limit(1)
    .where({name: 'Bachelor of Computer Science'})
    .pluck('id')


  const studentfile = await fs.readFile('./data/students.csv')
  const studentdata = parse(studentfile, {
    fromLine: 3
  });

  const users = studentdata.map(row => ({wid: row[3]}));

  for(const user of users) {
    await knex('users').insert(user).onConflict('wid').ignore();
  }

  const coursefile = await fs.readFile('./data/courses.csv')
  const coursedata = parse(coursefile, {
    fromLine: 3
  });

  const courses = coursedata.map(row => ({
    wid: row[3],
    term: row[1],
    classNumber: row[7],
    subject: row[8],
    catalog: row[9],
    name: row[10],
    component: row[11],
    grade: row[12]
  }));

  for(const course of courses) {
    // There is a chance we might encounter a student we have not saved 
    // previously, so we use an upsert to create/retrieve the user id
    let ids = await knex('users').insert({wid: course.wid}).onConflict('wid').merge().returning("id");
    let userId = ids[0].id;

    console.log(`saving course ${course.classNumber} for student ${userId}` );
    
    // A previous entry might have been updated with a new grade, so we 
    // also need to upsert into the user_courses table.  The user_id with
    // the course_number should be a unique combo.
    await knex('user_courses').insert({
      user_id: userId,
      class_number: course.classNumber,
      term: course.term,
      subject: course.subject,
      catalog: course.catalog,
      name: course.name,
      component: course.component,
      grade: course.grade
    }).onConflict(['user_id', 'class_number']).merge()
  }
  
}

//run()

// Example query: Select all rows from a table
knex.select('*').from('users')
  .then(data => {
    console.log('Query result:', data);
  })
  .catch(err => {
    console.error('Error executing query:', err);
  })
  .finally(() => {
    knex.destroy(); // Close the database connection
  });

knex.select('*').from('user_courses')
  .then(data => {
    console.log('Query result:', data);
  })
  .catch(err => {
    console.error('Error executing query:', err);
  })
  .finally(() => {
    knex.destroy(); // Close the database connection
  });

  knex.select('*').from('users')
  .then(data => {
    console.log('Query result:', data);
  })
  .catch(err => {
    console.error('Error executing query:', err);
  })
  .finally(() => {
    knex.destroy(); // Close the database connection
  });
