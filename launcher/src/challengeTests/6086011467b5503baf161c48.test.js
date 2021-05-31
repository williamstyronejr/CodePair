const { runCode } = require('../index');

const { FILENAME } = process.env;

test("main(true) should equal 'Yes'", async (id) => {
  const params = [true];
  const solution = 'Yes';

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test("main(false) should equal 'No'", async (id) => {
  const params = [false];
  const solution = 'No';

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
