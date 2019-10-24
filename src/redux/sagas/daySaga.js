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
    console.log('Day get request failed', error);
  }
}

// worker Saga: will be fired on "FETCH_DAY_STATS" actions
function* fetchDayStats(action) {
  const dayId = action.payload.date;
  const userId = action.payload.userId
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const ridersResponse = yield axios.get(`/api/day/riders/${dayId}`, config);
    const driverResponse = yield axios.get(`/api/day/driver/${dayId}`, config);

    const riderCount = ridersResponse.data.length;
    const userIsRiding = ridersResponse.data.find( rider => rider.id === userId ) ? true : false;
    const hasDriver = (driverResponse.data.length > 0);

    const dayStats = {
      [dayId]: {
        riderCount: riderCount,
        userIsRiding: userIsRiding,
        hasDriver: hasDriver
      }
    }
    yield put({ type: 'ADD_DAY_STATS', payload: dayStats });
  } catch (error) {
    console.log('Day stats get request failed', error);
  }
}

// worker Saga: will be fired on "CHANGE_RIDE_STATUS" actions
function* changeRideStatus(action) {
  const dayId = action.payload.dayId;
  const userId = action.payload.userId;
  const newRideStatus = !action.payload.rideStatus;
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    const junctionResponse = yield axios.get(`/api/day/user/${dayId}/${userId}`, config);
    const rowExists = junctionResponse.data.junction;
    if (rowExists) {
      // if the row already exists, we need to PUT an update to it
      yield axios.put(`/api/day/ride/${dayId}/${userId}`, {newRideStatus:newRideStatus});
    } else {
      // otherwise, we need to POST a new row in the table to create it
      yield axios.post(`/api/day/ride/${dayId}/${userId}`, {newRideStatus:newRideStatus});
    }
    yield fetchDay({payload:dayId});
  } catch (error) {
    console.log('Change ride request failed', error);
  }
}

// worker Saga: will be fired on "CHANGE_DRIVE_STATUS" actions
function* changeDriveStatus(action) {
  const dayId = action.payload.dayId;
  const userId = action.payload.userId;
  const newDriveStatus = !action.payload.driveStatus;
  try {
    // if changing to true, set driver to user; if changing to false, clear the driver 
    const newDriver = newDriveStatus ? userId : null;
    yield axios.put(`/api/day/drive/${dayId}`, {driver:newDriver});
    yield fetchDay({payload:dayId});
  } catch (error) {
    console.log('Change drive request failed', error);
  }
}

function* daySaga() {
  yield takeLatest('FETCH_DAY', fetchDay);
  yield takeLatest('FETCH_DAY_STATS', fetchDayStats);
  yield takeLatest('CHANGE_RIDE_STATUS', changeRideStatus);
  yield takeLatest('CHANGE_DRIVE_STATUS', changeDriveStatus);
}

export default daySaga;
