const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

// Gets day information about the specified date
router.get('/:id', (req, res) => {
  const queryText = `
    SELECT * FROM "days"
    WHERE "id" = $1;
    `;
  const queryValue = req.params.id;
  pool.query(queryText, [queryValue])
    .then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log('Error fetching date', error);
      res.sendStatus(500);
    });
})

// Returns users riding on specified date
router.get('/riders/:id', (req, res) => {
  const queryText = `
    SELECT "user".id, "user".username, "user".display_name, "user".cell FROM "days"
    JOIN "user_days" ON "days".id = "user_days".days_id
    JOIN "user" ON "user".id = "user_days".user_id
    WHERE "days".id = $1 AND "user_days".riding = true;
    `;
  const queryValue = req.params.id;
  pool.query(queryText, [queryValue])
    .then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log('Error fetching riders', error);
      res.sendStatus(500);
    });
})

// Returns users riding on specified date
router.get('/driver/:id', (req, res) => {
  const queryText = `
    SELECT "user".id, "user".username, "user".display_name, "user".cell FROM "days"
    JOIN "user" ON "user".id = "days".driver_id
    WHERE "days".id = $1;
    `;
  const queryValue = req.params.id;
  pool.query(queryText, [queryValue])
    .then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log('Error fetching riders', error);
      res.sendStatus(500);
    });
})

// Handles POST request with new date data
router.post('/add', (req, res, next) => {
  const id = req.body.id;
  const date = req.body.date;
  const year = req.body.year;
  const week = req.body.week;
  const month = req.body.month;
  const weekday = req.body.weekday;
  const day = req.body.day;
  const queryText = 'INSERT INTO "days" (id, date, year, week, month, weekday, day) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  const queryValues = [id, date, year, week, month, weekday, day];
  pool.query(queryText, queryValues)
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500));
});

module.exports = router;
