const fs = require('fs');

const { CHALLENGEID: TESTNAME, DEBUG } = process.env;

const { log } = console;
const logError = console.error;

const tests = [];
let passedTests = 0;
let failedTests = 0;
let totalTests = 0;
let error = null;
const expectations = {};

/**
 * Adds a test to the tests list to be run.
 * @param {String} name Name of test
 * @param {Function} fn Function to test
 * @param {Number} timeout Time, in milliseconds, to run code before crashing
 *  with error.
 */
function test(name, fn, timeout = 5000) {
  tests.push({ name, fn, timeout });
}

/**
 * Creates and returns modifiers for comparing values in test. The results are
 *  stored in the expectations list using the id as a key.
 * @param {String} id Id of test the expect call is in (normally name of test)
 * @param {Any} val Value to used to compare to
 * @return {Object} Returns an object containing the different types of expects
 *  functions.
 */
function expect(id, val) {
  return {
    toBe: (expected) => {
      // Receiving function should mark as failed
      if (typeof val === 'function') {
        expectations[id] = {
          name: id,
          expects: [
            {
              status: false,
              name: `Expected: ${expected} Received: function`,
            },
          ],
        };
        failedTests += 1;
        return;
      }

      // Array comparison
      if (Array.isArray(expected)) {
        if (
          !Array.isArray(val) ||
          val.length !== expected.length ||
          !expected.every((v, i) => v === val[i])
        ) {
          expectations[id] = {
            name: id,
            expects: [
              {
                status: false,
                name: `Expected: ${JSON.stringify(expected)} Received: ${
                  Array.isArray(val) ? JSON.stringify(val) : val
                }`,
              },
            ],
          };
          failedTests += 1;
          return;
        }

        expectations[id] = {
          name: id,
          expects: [
            {
              status: true,
              name: `Expected: ${JSON.stringify(
                expected
              )} Received: ${JSON.stringify(val)}`,
            },
          ],
        };
        passedTests += 1;
        return;
      }

      // Object comparison (Currently not support)
      if (typeof val === 'object') {
        if (typeof expected !== 'object') {
          expectations[id] = {
            name: id,
            expects: [
              {
                status: false,
                name: `Expected: ${expected} Received: ${JSON.stringify(val)}`,
              },
            ],
          };
          failedTests += 1;
          return;
        }
      }

      if (val === expected) {
        expectations[id] = {
          name: id,
          expects: [
            {
              status: true,
              name: `Expected: ${
                typeof expected === 'string' ? `"${expected}"` : expected
              } Received: ${typeof val === 'string' ? `"${val}"` : val}`,
            },
          ],
        };
        passedTests += 1;
      } else {
        expectations[id] = {
          name: id,
          expects: [
            {
              status: false,
              name: `Expected: ${
                typeof expected === 'string' ? `"${expected}"` : expected
              } Received: ${typeof val === 'string' ? `"${val}"` : val}`,
            },
          ],
        };
        failedTests += 1;
      }
    },
  };
}

/**
 * Excutes running all test cases and deals with storing any errors that
 *  occurred during the tests.
 * @returns {Promise<Array>} Returns a promise to resolve when all test have
 *  finished or a test has thrown an error (not the same as a test failing).
 */
async function runTests() {
  const proms = [];

  tests.forEach((singleTest) => {
    totalTests += 1;

    proms.push(
      new Promise((res, rej) => {
        expectations[singleTest.name] = { status: true, expects: [] };
        singleTest.fn
          .apply(this, [singleTest.name, res]) // Apply function with a "done" call back
          .then(() => {
            const passed = expectations[singleTest.name].expects.every(
              (expectation) => expectation.status
            );
            expectations[singleTest.name].status = passed;
            res();
          })
          .catch((err) => {
            error = err.stack;
            failedTests += 1;
            res();
          });
      })
    );
  });

  return Promise.all(proms);
}

/**
 * Logs the results of the test depending on presnation options.
 */
function showResults() {
  // If any error occurred during testing, log it to error stream
  if (error)
    return logError(JSON.stringify({ failedTests, passedTests, error }));

  const outputJson = {
    numOfTests: totalTests,
    passedTests,
    failedTests,
    time: 0,
    testResults: Object.values(expectations),
  };

  log(JSON.stringify(outputJson));
}

global.test = test;
global.expect = expect;

/**
 * Checks if the test folder exists at /app/src/tests.
 * @return {Boolean} Returns a boolean indicating if a test folder was found.
 */
function searchTestFolder() {
  if (!fs.existsSync('/app/src/tests/')) return false;
  return true;
}

/**
 * Imports a test file by TESTNAME and stores all test calls, then
 *  runs all tests.
 * @returns {Promise<Array>} Returns a promise to resolve when all test have
 *  been ran and results are stored.
 */
async function runTestFile() {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    require(fs.realpathSync(`src/tests/${TESTNAME}.test.js`));
  } catch (err) {
    if (err.code && err.code === 'ENOENT')
      throw new Error('This challenge does not exists.');

    throw new Error(err.message);
  }

  // Run all tests
  return runTests();
}

/**
 * Main function that finds all tests, runs test cases, and then reports as JSON
 * @return {Promise<Void>} Returns a promise to resolve when all test cases are
 *  ran.
 */
async function run() {
  try {
    if (searchTestFolder()) {
      if (DEBUG) log('Running Test');
      await runTestFile();
      showResults();

      if (DEBUG) log('Finished running tests');
    } else if (DEBUG) {
      log('No test folder found');
    }
  } catch (err) {
    logError(
      JSON.stringify({
        testResults: [],
        time: 0,
        numOfTests: 1,
        failedTests: 1,
        passedTests: 0,
        error: err.message,
      })
    );
  }
}

run();
