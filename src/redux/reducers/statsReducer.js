const statsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_DAY_STATS':
      return {...state, ...action.payload};
    case 'CLEAR_DAY_STATS':
      // keep the stats store from growing indefinitely by flushing it
      return {};
    default:
      return state;
  }
};

// day will be on the redux state at:
// state.stats
export default statsReducer;
