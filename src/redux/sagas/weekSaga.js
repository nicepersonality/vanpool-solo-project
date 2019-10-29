import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import moment from 'moment';

// worker Saga: will be fired on "FETCH_DAY" actions
function* fetchWeek(action) {
  const dayId = action.payload.dayId;
  const userId = action.payload.userId;
  // convert to the Monday of the current workweek
  const monday = moment(dayId, 'YYYYMMDD').add(1, 'days').day('Monday').format('YYYYMMDD');
  const friday = moment(dayId, 'YYYYMMDD').add(1, 'days').day('Friday').format('YYYYMMDD');
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const response = yield axios.get(`/api/week/${monday}/${friday}`, config);
    let week = [];
    for (let day of response.data) {
      try {
        const ridersResponse = yield axios.get(`/api/day/riders/${day.id}`, config);
        const driverResponse = yield axios.get(`/api/day/driver/${day.id}`, config);

        const riderCount = ridersResponse.data.length;
        const userIsRiding = ridersResponse.data.find(rider => rider.id === userId) ? true : false;
        const hasDriver = (driverResponse.data.length > 0);

        const dayStats = {
          [dayId]: {
            riderCount: riderCount,
            userIsRiding: userIsRiding,
            hasDriver: hasDriver
          }
        }
        yield week.push(dayStats);
      } catch (error) {
        console.log('Week get day details request failed', error);
      }
      yield put({ type: 'SET_WEEK', payload: week });
    }
  } catch (error) {
    console.log('Week get request failed', error);
  }
}

function* weekSaga() {
  yield takeLatest('FETCH_WEEK', fetchWeek);
}

export default weekSaga;
