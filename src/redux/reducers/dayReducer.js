const dayReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_DAY':
        return {...state, ...action.payload};
    case 'CLEAR_DAY_STORE':
      // keep the store from growing indefinitely by flushing days not in current view
      return {};
    default:
      return state;
  }
};

// day will be on the redux state at:
// state.day
export default dayReducer;
