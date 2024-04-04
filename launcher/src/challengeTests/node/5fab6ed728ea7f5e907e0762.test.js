const { runCode } = require('../index');

const { FILENAME } = process.env;

test('main(2,2) should equal 4', async (id) => {
  const params = [2, 2];
  const solution = 4;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(3,2) should equal 9', async (id) => {
  const params = [3, 2];
  const solution = 9;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
