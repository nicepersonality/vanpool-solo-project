const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

const router = express.Router();

// Gets day information about the specified date
router.get('/:id', rejectUnauthenticated, (req, res) => {
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
router.get('/riders/:id', rejectUnauthenticated, (req, res) => {
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
router.get('/driver/:id', rejectUnauthenticated, (req, res) => {
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

// Returns whether or not a specified day+user junction row exists
router.get('/user/:dateId/:userId', rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT COUNT(*) FROM "user_days"
    WHERE "days_id" = $1 AND "user_id" = $2;
    `;
  const queryValues = [req.params.dateId, req.params.userId];
  pool.query(queryText, queryValues)
    .then((result) => {
      const response = {
        junction: (result.rows[0].count > 0)
      }
      res.send(response);
    }).catch((error) => {
      console.log('Error fetching riders', error);
      res.sendStatus(500);
    });
})

// Create a row in the junction table with the riding status
router.post('/ride/:dateId/:userId', rejectUnauthenticated, (req, res) => {
  const queryText = `
    INSERT INTO "user_days" (user_id, days_id, riding)
    VALUES ($1, $2, $3);
    `;
  const queryValues = [req.params.userId, req.params.dateId, req.body.newRideStatus];
  pool.query(queryText, queryValues)
    .then(() => res.sendStatus(201))
    .catch((error) => {
      console.log('Error adding status', error);
      res.sendStatus(500);
    });
})

// Modify a row in the junction table with the riding status
router.put('/ride/:dateId/:userId', rejectUnauthenticated, (req, res) => {
  const queryText = `
    UPDATE "user_days"
    SET "riding" = $1
    WHERE "days_id" = $2 AND "user_id" = $3;
    `;
  const queryValues = [req.body.newRideStatus, req.params.dateId, req.params.userId];
  pool.query(queryText, queryValues)
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log('Error modifying status', error);
      res.sendStatus(500);
    });
})

// Modify a row in the days table with a new driver (or null)
router.put('/drive/:dateId', rejectUnauthenticated, (req, res) => {
  const queryText = `
    UPDATE "days"
    SET "driver_id" = $1
    WHERE "id" = $2;
    `;
  const queryValues = [req.body.driver, req.params.dateId];
  pool.query(queryText, queryValues)
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log('Error modifying status', error);
      res.sendStatus(500);
    });
})

module.exports = router;
