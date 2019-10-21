const dayReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_DAY':
      return action.payload;
    default:
      return state;
  }
};

// day will be on the redux state at:
// state.day
export default dayReducer;
