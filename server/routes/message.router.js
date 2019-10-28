const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/:id', rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT "messages".days_id, "messages".content, "messages".time, "user".display_name FROM "messages"
    JOIN "user" ON "user".id = "messages".user_id
    WHERE "days_id" = $1
    ORDER BY "messages".time;
  `;
  const queryValue = [req.params.id];
  pool.query(queryText, queryValue)
    .then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log('Error fetching messages', error);
      res.sendStatus(500);
    });
});

router.post('/', rejectUnauthenticated, (req, res) => {
  const queryText = `
    INSERT INTO "messages"
    SET "content" = $1, "user_id" = $2, "days_id" = $3;
    `;
  const queryValues = [req.body.content, req.body.user_id, req.body.days_id];
  pool.query(queryText, queryValues)
    .then(() => res.sendStatus(201))
    .catch((error) => {
      console.log('Error adding message', error);
      res.sendStatus(500);
    });
})


module.exports = router;