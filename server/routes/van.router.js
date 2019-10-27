const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
  const queryText = `SELECT * FROM "routes" WHERE "id" = 1;`;
  pool.query(queryText)
    .then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log('Error fetching route info', error);
      res.sendStatus(500);
    });
});

// Modify the route metadata
router.put('/', rejectUnauthenticated, (req, res) => {
  const queryText = `
    UPDATE "routes"
    SET "name" = $1, "description" = $2, "max_seats" = $3
    WHERE "id" = 1;
    `;
  const queryValues = [req.body.name, req.body.description, req.body.max_seats];
  pool.query(queryText, queryValues)
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log('Error modifying route', error);
      res.sendStatus(500);
    });
})

module.exports = router;