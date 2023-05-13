import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ajaxRequest } from '../utils/utils';

const initialState = {
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

export const getChallenge = createAsyncThunk(
  'challenge/getChallenge',
  async ({ cId, rId }: { cId: string; rId: string }) => {
    const res = await ajaxRequest(`/api/challenge/${cId}/room/${rId}`);
    return res.data;
  }
);

export const testCode = createAsyncThunk(
  'challenge/testCode',
  async ({
    cId,
    rId,
    code,
    language,
  }: {
    cId: string;
    rId: string;
    code: string;
    language: string;
  }) => {
    await ajaxRequest(`/api/challenge/${cId}/room/${rId}/test`, 'POST', {
      code,
      language,
    });
    return null;
  }
);

export const convertRoomToPublic = createAsyncThunk(
  'challenge/convertRoomToPublic',
  async (roomId: string) => {
    const res = await ajaxRequest(`/api/room/${roomId}/public`, 'POST');
    return res.data.invite;
  }
);

const ChallengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    saveCode(state, action: PayloadAction<{ rId: string; code: string }>) {
      state.savingCode = true;
    },
    savedCode(state) {
      state.savingCode = false;
    },
    testingCode(state) {
      state.testing = true;
    },
    setCode(state, action: PayloadAction<{ room: string; code: string }>) {
      state.code = action.payload.code;
    },
    updateCode(state, action: PayloadAction<string>) {
      state.code = action.payload;
    },
    testFinish(
      state,
      action: PayloadAction<{ success: boolean; results: any; errors: any }>
    ) {
      state.testPassed = action.payload.success;
      state.testResults = action.payload.results;
      state.testErrors = action.payload.errors;
      state.testing = false;
    },
    setChallengeError(state, action: PayloadAction<any>) {
      state.challengeError = action.payload;
    },
    clearChallengeData(state) {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChallenge.fulfilled, (state, action: PayloadAction<any>) => {
        state.id = action.payload.challenge._id;
        state.title = action.payload.challenge.title;
        state.prompt = action.payload.challenge.prompt;
        state.private = action.payload.room.private;
        state.language = action.payload.room.language;
        state.code =
          action.payload.room.code || action.payload.room.code !== ''
            ? action.payload.room.code
            : action.payload.challenge.initialCode.find(
                (val: any) => val.language === action.payload.room.language
              ).code;
        state.inviteLink = action.payload.room.inviteKey
          ? `localhost:3000/invite/${action.payload.room.inviteKey}`
          : '';
      })
      .addCase(getChallenge.rejected, (state, action: PayloadAction<any>) => {
        state.challengeError = 'Server error occurred, please try again.';
      })
      .addCase(testCode.fulfilled, (state) => {
        state.testing = true;
      })
      .addCase(testCode.rejected, (state) => {
        state.testing = false;
        state.testResults = [];
        state.testPassed = false;
        state.testErrors = [];
        state.challengeError = 'Error testing code, please try again.';
      })
      .addCase(
        convertRoomToPublic.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.private = false;
          state.inviteLink = action.payload;
        }
      )
      .addCase(
        convertRoomToPublic.rejected,
        (state, action: PayloadAction<any>) => {
          state.challengeError = 'Server error occured, please try again.';
        }
      );
  },
});

export const {
  clearChallengeData,
  setChallengeError,
  testFinish,
  setCode,
  saveCode,
  savedCode,
  testingCode,
  updateCode,
} = ChallengeSlice.actions;

export default ChallengeSlice.reducer;
