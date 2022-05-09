import * as types from "../types";

const initialState = {
  isLoading: false,
  errorMessage: null,
  userData: null,
  isError: false,
  gameData: {
    players: [],
    noOfPlayers: 0,
  },
  triviaData: {},
  teleData: null,
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.START_LOADING:
      return {
        ...state,
        isLoading: true,
        progress: action.payload,
      };

    case types.SET_USER_DATA_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case types.SET_USER_DATA_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case types.GET_GAME_DATA_SUCCESS:
    case types.GET_GAME_DATA_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case types.GET_QUESTION_DATA_SUCCESS:
    case types.GET_QUESTION_DATA_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case types.SUBMIT_TRIVIA_ANSWER_SUCCESS:
    case types.SUBMIT_TRIVIA_ANSWER_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case types.SUBMIT_TRIVIA_VOTE_SUCCESS:
    case types.SUBMIT_TRIVIA_VOTE_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case types.GET_TRIVIA_DATA_SUCCESS:
    case types.GET_TRIVIA_DATA_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case types.GET_DATA_BY_RELOAD:
      return {
        ...state,
        ...action.payload,
      };
    case types.READY_FOR_NEXT_SUCCESS:
    case types.READY_FOR_NEXT_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    //Teletrations Game

    case types.SUBMIT_PROMPT_SUCCESS:
    case types.SUBMIT_PROMPT_ERROR:
      return {
        ...state,
        ...action.payload,
      };

    case types.SUBMIT_DRAWING_SUCCESS:
    case types.SUBMIT_DRAWING_ERROR:
      return {
        ...state,
        ...action.payload,
      };

    case types.SUBMIT_CAPTION_SUCCESS:
    case types.SUBMIT_CAPTION_ERROR:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default gameReducer;
