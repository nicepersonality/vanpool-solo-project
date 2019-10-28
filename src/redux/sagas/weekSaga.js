import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import moment from 'moment';

// worker Saga: will be fired on "FETCH_DAY" actions
function* fetchWeek(action) {
  const dayId = action.payload;
  // convert to the Monday of the current workweek
  const baseMonday = moment(dayId, 'YYYYMMDD').add(1, 'days').day('Monday').format('YYYYMMDD');
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const response = yield axios.get(`/api/week/${baseMonday}`, config);

    yield put({ type: 'SET_WEEK', payload: response });
  } catch (error) {
    console.log('Week get request failed', error);
  }
}

function* weekSaga() {
  yield takeLatest('FETCH_WEEK', fetchWeek);
}

export default weekSaga;
