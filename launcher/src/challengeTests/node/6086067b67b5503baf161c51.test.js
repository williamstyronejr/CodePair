const { runCode } = require('../index');

const { FILENAME } = process.env;

test('main(1) should equal [1]', async (id) => {
  const params = [1];
  const solution = [1];

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(10) should equal [10, 9, 8,7,6,5,4,3,2,1]', async (id) => {
  const params = [10];
  const solution = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(8) should equal [8,7,6,5,4,3,2,1]', async (id) => {
  const params = [8];
  const solution = [8, 7, 6, 5, 4, 3, 2, 1];

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
