import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "FETCH_MESSAGES" actions
function* fetchMessages(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const response = yield axios.get(`/api/messages/${action.payload.date}`, config);

    yield put({ type: 'SET_MESSAGES', payload: response.data });
  } catch (error) {
    console.log('Message get request failed', error);
  }
}

// worker Saga: will be fired on "ADD_MESSAGE" actions
function* addMessage(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    console.log('addMessage: action.payload:', action.payload);
    yield axios.post('/api/messages', action.payload, config);
    const currentDay = action.payload.days_id;
    yield fetchMessages({payload: {date: currentDay}});
  } catch (error) {
    console.log('Route update request failed', error);
  }
}

function* messageSaga() {
  yield takeLatest('FETCH_MESSAGES', fetchMessages);
  yield takeLatest('ADD_MESSAGE', addMessage);
}

export default messageSaga;
