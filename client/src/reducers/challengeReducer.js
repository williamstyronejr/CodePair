import {
  SET_CHALLENGE_DATA,
  SET_CHALLENGE_ERROR,
  CLEAR_CHALLENGE_DATA,
  SET_CODE,
  ADD_INVITE_LINK,
  TEST_CODE,
  TEST_FINISH,
  SAVE_CODE,
  CODE_SAVED,
  UPDATE_CODE,
} from '../actions/challenge';

const initState = {
  id: null,
  title: '',
  prompt: '',
  code: '',
  language: '',

  challengeError: null,
  private: true, // Flag for indicating if a room is private or public
  inviteLink: null,

  savingCode: false, // Flag to indicate when code is being saved to server
  testing: false, // Flag for testing
  testPassed: false, // Flag for all test passing
  testErrors: null, // Contains any errors (server side errors)
  testResults: [], // Array to contains data on each test ran
};

const ChallengeReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_CHALLENGE_DATA:
      return {
        ...state,
        id: action.payload.challenge._id,
        title: action.payload.challenge.title,
        prompt: action.payload.challenge.prompt,
        private: action.payload.room.private,
        language: action.payload.room.language,
        code:
          action.payload.room.code || action.payload.room.code !== ''
            ? action.payload.room.code
            : action.payload.challenge.initialCode.find(
                (val) => val.language === action.payload.room.language
              ).code,
        inviteLink: action.payload.room.inviteKey
          ? `localhost:3000/invite/${action.payload.room.inviteKey}`
          : null,
      };

    case SET_CHALLENGE_ERROR:
      return {
        ...state,
        challengeError: action.payload,
      };

    case CLEAR_CHALLENGE_DATA:
      return initState;

    case SET_CODE:
      return {
        ...state,
        code: action.payload.code,
      };

    case SAVE_CODE:
      return {
        ...state,
        savingCode: true,
      };

    case CODE_SAVED:
      return {
        ...state,
        savingCode: false,
      };

    case UPDATE_CODE:
      return {
        ...state,
        code: action.payload,
      };
    case ADD_INVITE_LINK:
      return {
        ...state,
        private: false,
        inviteLink: `localhost:3000/invite/${action.payload}`,
      };

    case TEST_CODE:
      return {
        ...state,
        testing: true,
        testResults: [],
        testPassed: false,
        testErrors: null,
      };

    case TEST_FINISH:
      return {
        ...state,
        testPassed: action.payload.success,
        testResults: action.payload.results,
        testErrors: action.payload.errors,
        testing: false,
      };

    default:
      return state;
  }
};

export default ChallengeReducer;
