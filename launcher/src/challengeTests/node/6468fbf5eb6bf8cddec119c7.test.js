const { runCode } = require('../index');
const { FILENAME } = process.env;

test('main(8) should equal 40320', async (id) => {
  const params = [8];
  const solution = 40320;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(10) should equal 3628800', async (id) => {
  const params = [10];
  const solution = 3628800;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(3) should equal 6', async (id) => {
  const params = [3];
  const solution = 6;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
