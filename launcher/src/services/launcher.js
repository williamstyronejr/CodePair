const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const Stream = require('stream');
const Docker = require('dockerode');

const { IMAGE_NODE } = process.env;

const CODE_PATH = path.join(__dirname, '../', 'temp', 'code');
const docker = new Docker({
  socketPath: '/var/run/docker.sock',
  timeout: 15000,
});

/**
 * Creates a pesudo-random string using crypto.
 * @returns {String} Returns a random string.
 */
function createRandomString() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Creates a file to store the users code in.
 * @param {String} fileName Name of file (should have extension)
 * @param {String} code Code to write to file
 * @return {Promise<Any>} A promise to resolve when a file is successfully made.
 */
function createCodeFile(fileName, code) {
  return fs.promises.writeFile(path.join(CODE_PATH, fileName), code, {
    flag: 'w',
  });
}

/**
 * Deletes a user code file.
 * @param {String} fileName Name of code file to delete.
 * @return {Promise<Any>} Returns a promise to resolve when the file is deleted
 */
function deleteCodeFile(fileName) {
  return fs.promises.unlink(path.join(CODE_PATH, fileName));
}

/**
 * Parse test output based on test runner and langauge and returns an uniformly
 *  formatted object.
 * @param {String} output Output of a test runner based on langauge code
 *  was written.
 * @param {String} errOutput Error output of a test runner based on coding
 *  language. (May not be valid)
 * @param {String} lang Langauge test results are coming from
 * @return {Object} Returns a object containing information about the test
 *  cases including: name, status, and message.
 */
function parseOutput(output, errOutput, lang) {
  let formattedOutput = {};

  switch (lang) {
    case 'node': {
      if (output === '' && errOutput === '') {
        const err = new Error('No output from container');
        err.msg =
          'Unknown error occurred during code runner, please try again.';
        err.status = 500;
        throw err;
      }

      try {
        formattedOutput = JSON.parse(errOutput === '' ? output : errOutput);
      } catch (err) {
        const e = new Error();
        e.msg = 'Unknown error occurred during code runner, please try again.';
        throw e;
      }
      break;
    }

    default: {
      const err = new Error('Invalid or unsupported langauge.');
      err.status = 422;
      err.msg = 'Invalid or unsupported langauge requested.';
      throw err;
    }
  }

  return formattedOutput;
}

/**
 * Creates and start container to run tests against code depending on language.
 *  Containers will be timed out after time specific to coding language.
 * @param {String} code Code to run in container
 * @param {String} language The langauge/platform to run the code in
 * @param {String} challengeId Challenge id used to select test cases to run
 * @return {Promise<Object>} A promise to resolve with the results from running
 *  the tests.
 */
async function launchContainer(code, language, challengeId) {
  let fileName; // Name of file with code (includes extension)
  let commands; // List of commands to run (changes based on language)
  let options; // List of options for running container
  let imageName; // Name of docker image to use
  let timeout; // Amount of time in milliseconds to use as a timeout for code

  // Determine container options based on language
  switch (language.toLowerCase()) {
    case 'node':
      imageName = IMAGE_NODE;
      fileName = `${createRandomString()}.js`;
      timeout = 8000;
      commands = ['node', './src/testingLibrary.js'];

      options = {
        AutoRemove: true,
        Tty: false,
        Binds: [
          `${path.join(__dirname, '../', 'challengeTests')}:/app/src/tests`,
          `${path.join(
            __dirname,
            'testingLibrary.js'
          )}:/app/src/testingLibrary.js`,
          `${path.join(
            __dirname,
            '../',
            'temp',
            'code',
            fileName
          )}:/app/src/${fileName}`,
        ],
        Env: [`FILENAME=${fileName}`, `CHALLENGEID=${challengeId}`],
      };
      break;

    default: {
      const err = new Error('Invalid or unsupported language.');
      err.msg = `Invalid/unsupported langauge: ${language}`;
      err.status = 422;
      err.errors = { lang: 'Invalid or unsupported langauge selected.' };
      throw err;
    }
  }

  await createCodeFile(fileName, code);

  return new Promise((res, rej) => {
    let launcherTimeout;

    try {
      let dockerOutput = '';
      let errOutput = '';
      const chunks = [];
      const errChunks = [];
      const outStream = new Stream.Writable();
      const streamErr = new Stream.Writable();

      streamErr._write = (chunk, encoding, cb) => {
        errChunks.push(chunk);
        cb();
      };

      outStream._write = (chunk, encoding, cb) => {
        chunks.push(chunk);
        cb();
      };

      streamErr.on('finish', () => {
        if (launcherTimeout) clearTimeout(launcherTimeout);
      });

      outStream.on('finish', () => {
        if (launcherTimeout) clearTimeout(launcherTimeout);
        dockerOutput = Buffer.concat(chunks).toString('utf8');
        errOutput = Buffer.concat(errChunks).toString('utf8');

        try {
          deleteCodeFile(fileName);
          return res(parseOutput(dockerOutput, errOutput, language));
        } catch (err) {
          return rej(err);
        }
      });

      docker
        .run(imageName, commands, [outStream, streamErr], options, () => {})
        .on('container', (container) => {
          // Set container timer out to prevent hangup
          launcherTimeout = setTimeout(() => {
            try {
              container.stop();
            } catch (err) {
              //
            }

            const err = new Error('Container forced to timeout.');
            err.msg = `Code timeout at ${timeout / 1000} seconds.`;
            rej(err);
          }, timeout);
        });
    } catch (err) {
      rej(err);
    }
  });
}

module.exports.launchContainer = launchContainer;
