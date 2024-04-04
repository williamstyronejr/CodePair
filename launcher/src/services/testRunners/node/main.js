const fs = require('fs');
const path = require('path');
const ivm = require('isolated-vm');

/**
 * Creates a VM to run user supplied code in a sandbox environment,
 *  and log the results to a file for launcher to read from.
 * @param {String} fileName Name of file containing code to run
 * @param {Array<any>} params Array containing params to pass to user code
 * @return {String} Returns the output of running the code by call main function.
 */
async function runCode(fileName, params) {
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContext();
  const jail = context.global;

  // Possible error if user creates a global value with same name
  jail.setSync('global', jail.derefInto());
  jail.setSync('challengeInputParamsGlobal', () => params);

  let code = await fs.promises.readFile(path.join(__dirname, fileName), 'utf8');

  // Add line to call user's function with given test parameters
  code = code.concat('\nmain(...challengeInputParamsGlobal())');

  const results = await context.eval(code);

  return results;
}

exports.runCode = runCode;
