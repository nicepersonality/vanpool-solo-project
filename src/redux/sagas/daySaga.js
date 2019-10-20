import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "FETCH_DAY" actions
function* fetchDay(action) {
  const dayId = action.payload;
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const dayResponse = yield axios.get(`/api/day/${dayId}`, config);
    const ridersResponse = yield axios.get(`/api/day/riders/${dayId}`, config);
    const driverResponse = yield axios.get(`/api/day/driver/${dayId}`, config);

    const dayDetails = {
      ...dayResponse.data[0],
      riders: ridersResponse.data,
      driver: driverResponse.data[0]
    }
    yield put({ type: 'SET_DAY', payload: dayDetails });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* daySaga() {
  yield takeLatest('FETCH_DAY', fetchDay);
}

export default daySaga;
