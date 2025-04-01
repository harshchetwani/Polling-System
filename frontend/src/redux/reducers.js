const initialState = { polls: [], results: [] };

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_POLL':
      return { ...state, polls: [...state.polls, action.payload] };
    case 'UPDATE_RESULTS':
      return { ...state, results: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
