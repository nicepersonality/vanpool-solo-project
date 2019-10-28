const weekReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_WEEK':
      return action.payload;
    default:
      return state;
  }
};

// day will be on the redux state at:
// state.week
export default weekReducer;
