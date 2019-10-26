import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "FETCH_ROUTE" actions
function* fetchRoute() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const response = yield axios.get('/api/route', config);

    yield put({ type: 'SET_ROUTE', payload: response.data });
  } catch (error) {
    console.log('Route get request failed', error);
  }
}

// worker Saga: will be fired on "UPDATE_USER" actions
function* updateRoute(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    yield axios.put('/api/route', action.payload, config);
    yield fetchRoute();
  } catch (error) {
    console.log('Route update request failed', error);
  }
}

function* routeSaga() {
  yield takeLatest('FETCH_ROUTE', fetchRoute);
  yield takeLatest('UPDATE_ROUTE', updateRoute);
}

export default routeSaga;
