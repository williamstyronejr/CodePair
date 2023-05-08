export const UPDATEUSER = "update_user_data";

/**
 * Redux action creator for updating user data.
 * @param {Object} data User data
 * @returns {Object} Returns a redux action object.
 */
export function updateUser(data: any) {
  return {
    type: UPDATEUSER,
    payload: data,
  };
}
