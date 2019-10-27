import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('/api/user', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

// worker Saga: will be fired on "LIST_USERS" actions
function* listUsers() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    const response = yield axios.get('/api/user/all', config);
    yield put({ type: 'SET_USER_LIST', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

// worker Saga: will be fired on "UPDATE_USER" actions
function* updateUser(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    yield axios.put('/api/user', action.payload, config);
    yield fetchUser();
  } catch (error) {
    console.log('User update request failed', error);
  }
}

// worker Saga: will be fired on "CHANGE_USER_ACCESS" actions
function* changeUserAccess(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    yield axios.put('/api/user/access', action.payload, config);
    yield listUsers();
  } catch (error) {
    console.log('User update request failed', error);
  }
}

// worker Saga: will be fired on "DELETE_USER" actions
function* deleteUser(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    yield axios.delete(`/api/user/${action.payload.userId}`, config);
    yield listUsers();
  } catch (error) {
    console.log('User delete request failed', error);
  }
}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('LIST_USERS', listUsers);
  yield takeLatest('UPDATE_USER', updateUser);
  yield takeLatest('CHANGE_USER_ACCESS', changeUserAccess);
  yield takeLatest('DELETE_USER', deleteUser);
}

export default userSaga;
