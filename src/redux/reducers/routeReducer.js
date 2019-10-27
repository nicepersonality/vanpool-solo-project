const routeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ROUTE':
      return action.payload;
    default:
      return state;
  }
};

export default routeReducer;
