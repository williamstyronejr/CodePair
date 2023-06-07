import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ajaxRequest } from '../utils/utils';

const initState = {
  profileImage: '',
  id: '',
  username: '',
  email: '',
  authenticated: false,
  authenticating: false,
  authError: '',
  oauthUser: false,
};

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async () => {
    const res = await ajaxRequest('/api/user/data');
    return res.data;
  }
);

export const signoutUser = createAsyncThunk('user/signoutUser', async () => {
  await ajaxRequest('/api/signout', 'POST');
  return true;
});

const userSlice = createSlice({
  name: 'user',
  initialState: initState,
  reducers: {
    unauthUser(state) {
      state.authenticated = false;
    },
    authUser(state) {
      state.authenticated = true;
      state.authError = '';
      state.authenticating = false;
    },
    authError(state, action: PayloadAction<string>) {
      state = {
        ...state,
        authenticated: false,
        authenticating: false,
        authError: action.payload,
      };
    },
    updateUser(
      state,
      action: PayloadAction<{
        id?: string;
        username?: string;
        email?: string;
        profileImage?: string;
        oauthUser?: boolean;
      }>
    ) {
      state = {
        ...state,
        ...action.payload,
      };
    },
    setUserData(
      state,
      action: PayloadAction<{
        id: string;
        username: string;
        profileImage: string;
        email: string;
        oauthUser: boolean;
      }>
    ) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.profileImage = action.payload.profileImage;
      state.email = action.payload.email;
      state.oauthUser = action.payload.oauthUser;
      state.authenticating = false;
      state.authenticated = true;
      state.authError = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.authenticating = true;
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.authenticated = false;
        state.authenticating = false;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.profileImage = action.payload.profileImage;
        state.email = action.payload.email;
        state.oauthUser = action.payload.oauthUser;
        state.authenticating = false;
        state.authenticated = true;
        state.authError = '';
      })
      .addCase(signoutUser.fulfilled, (state) => {
        state.id = '';
        state = initState;
      });
  },
});

export const { setUserData, updateUser, authError, authUser, unauthUser } =
  userSlice.actions;

export default userSlice.reducer;
