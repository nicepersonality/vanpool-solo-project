const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

// Gets information about the specified date and the four following weekdays
router.get('/:startId/:endId', (req, res) => {
  const queryText = `
    SELECT "days".id FROM "days"
    WHERE "days".id >= $1 and "days".id <= $2;
    `;
  const queryValues = [req.params.startId, req.params.endId];
  pool.query(queryText, queryValues)
    .then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log('Error fetching dates', error);
      res.sendStatus(500);
    });
})

module.exports = router;
