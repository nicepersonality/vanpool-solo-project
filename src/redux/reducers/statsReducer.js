const statsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_DAY_STATS':
      return {...state, ...action.payload};
    default:
      return state;
  }
};

// day will be on the redux state at:
// state.stats
export default statsReducer;
