import axios from 'axios';

/**
 * Sends an Ajax request using axios and returns a promise to resolve or reject
 *  with the server's response.
 * @param {String} url Url to send request to
 * @param {String} method Method to use for request
 * @param {Object} data Data to send with request
 * @param {Object} option Additional options
 * @return {Promise<Object>} Returns a promise to resolve or reject with
 *  the server's response.
 */
export function ajaxRequest(
  url: string,
  method = 'GET',
  data = {},
  options = {}
) {
  return axios({
    url,
    method,
    data,
    ...options,
  });
}

/**
 * Validation check for a potential username. Username must exists (no empty
 *  string) with a length of 4 to 16 characters and contain only letters,
 *  numbers, and underscore (_).
 * @param {String} username Potential username to be validated
 * @return {String|Null} Returns a string if username is invalid, otherwise
 *   returns null.
 */
export function validateUsername(username: string) {
  if (username === '') return 'Must provide username';
  if (username.length < 4 || username.length > 16)
    return 'Username must be between 4 and 16 characters';
  if (/^[A-Za-z0-9_]$/.test(username))
    return 'Username must only contain letters, numbers, and _';
  return null;
}

/**
 * Creates a string format for provided date.
 * @param {String} date Date string
 * @returns {String} Returns a formatted string of the format of M-D-Y
 */
export function dateToText(date: string) {
  const createdDate = new Date(date);

  // eslint-disable-next-line no-restricted-globals
  return !isNaN(createdDate as any)
    ? `${createdDate.toLocaleDateString('default', {
        month: 'short',
      })} ${createdDate.getDate()}, ${createdDate.getFullYear()}`
    : '';
}
