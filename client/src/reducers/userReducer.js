import { UPDATEUSER } from '../actions/user';
import {
  AUTHUSER,
  UNAUTHUSER,
  AUTHERROR,
  SETUSERDATA,
  GETUSERDATA,
} from '../actions/authentication';

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

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case GETUSERDATA:
      return {
        ...state,
        authenticating: true,
      };

    case AUTHUSER:
      return {
        ...state,
        authenticated: true,
        authError: '',
      };

    case UNAUTHUSER:
      return {
        ...initState,
      };

    case AUTHERROR:
      return {
        ...state,
        authenticated: false,
        authenticating: false,
        authError: action.payload,
      };

    case SETUSERDATA:
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username,
        profileImage: action.payload.profileImage,
        email: action.payload.email,
        oauthUser: action.payload.oauthUser,
        authenticating: false,
        authenticated: true,
        authError: null,
      };

    case UPDATEUSER:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
