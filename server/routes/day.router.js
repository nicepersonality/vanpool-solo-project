const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

// Handles POST request with new date data
router.post('/add', (req, res, next) => {  
  // let thisDay = {
  //   id: moment(day).format('YYYYMMDD'), // unique integer
  //   date: moment(day).format('YYYY-MM-DD'), // postgres formate
  //   year: moment(day).format('YYYY'),
  //   week: moment(day).week(),
  //   month: moment(day).format('MMM'),
  //   weekday: moment(day).format('ddd'),
  //   day: moment(day).format('D')
  // };
  const id = req.body.id;
  const date = req.body.date;
  const year = req.body.year;
  const week = req.body.week;
  const month = req.body.month;
  const weekday = req.body.weekday;
  const day = req.body.day;


  const queryText = 'INSERT INTO "days" (id, date, year, week, month, weekday, day) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  const queryValues = [id, date, year, week, month, weekday, day];
  console.log(queryValues);
  // pool.query(queryText, [username, password, full_name, display_name, cell])
  //   .then(() => res.sendStatus(201))
  //   .catch(() => res.sendStatus(500));
});

module.exports = router;
