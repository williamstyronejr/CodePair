const { runCode } = require('../index');
const { FILENAME } = process.env;

test('main(8, 10) should equal 17', async (id) => {
  const params = [8, 10];
  const solution = 17;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(9,2) should equal 10', async (id) => {
  const params = [9, 2];
  const solution = 10;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(5,7) should equal 11', async (id) => {
  const params = [5, 7];
  const solution = 11;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
