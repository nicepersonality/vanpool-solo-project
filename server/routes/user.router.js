const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

router.get('/all', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  const queryText = `
    SELECT * FROM "user"
    WHERE "access_level" < 99
    ORDER BY "access_level" DESC, "full_name"
  `;
  pool.query(queryText)
    .then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log('Error fetching user list', error);
      res.sendStatus(500);
    });
});

router.put('/', rejectUnauthenticated, (req, res) => {
  const userUpdate = req.body;
  queryText = `
    UPDATE "user"
    SET "full_name" = $1, "display_name" = $2, "cell" = $3
    WHERE "id" = $4;
  `;
  queryValues = [
    userUpdate.full_name,
    userUpdate.display_name,
    userUpdate.cell,
    userUpdate.id
  ];
  pool.query(queryText, queryValues)
    .then(() => { res.sendStatus(200); })
    .catch((error) => {
      console.log('Error completing PUT user query', error);
      res.sendStatus(500);
    });
});

router.put('/access', rejectUnauthenticated, (req, res) => {
  const userUpdate = req.body;
  console.log('req.body:', req.body);
  queryText = `
    UPDATE "user"
    SET "access_level" = $1
    WHERE "id" = $2;
  `;
  queryValues = [
    parseInt(userUpdate.access_level),
    userUpdate.userId
  ];
  pool.query(queryText, queryValues)
    .then(() => { res.sendStatus(200); })
    .catch((error) => {
      console.log('Error completing PUT user query', error);
      res.sendStatus(500);
    });
});

router.put('/access', rejectUnauthenticated, (req, res) => {
  const userUpdate = req.body;
  console.log('req.body:', req.body);
  queryText = `
    UPDATE "user"
    SET "access_level" = $1
    WHERE "id" = $2;
  `;
  queryValues = [
    parseInt(userUpdate.access_level),
    userUpdate.userId
  ];
  pool.query(queryText, queryValues)
    .then(() => { res.sendStatus(200); })
    .catch((error) => {
      console.log('Error completing PUT user query', error);
      res.sendStatus(500);
    });
});

router.delete('/:id', rejectUnauthenticated, (req, res) => {
  let user = req.params.id;
  let queryText = `DELETE FROM "user" WHERE id=$1;`;
  pool.query(queryText, [user])
    .then(() => { res.sendStatus(200); })
    .catch((error) => {
      console.log('Error deleting user', error);
      res.sendStatus(500);
    });
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const full_name = req.body.full_name;
  const display_name = req.body.display_name;
  const cell = req.body.cell;


  const queryText = 'INSERT INTO "user" (username, password, full_name, display_name, cell) VALUES ($1, $2, $3, $4, $5) RETURNING id';
  pool.query(queryText, [username, password, full_name, display_name, cell])
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500));
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
