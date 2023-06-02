const { runCode } = require('../index');
const { FILENAME } = process.env;

test('main([1, 2, 3, 4, 5]) should equal  [1, 5]', async (id) => {
  const params = [[1, 2, 3, 4, 5]];
  const solution = [1, 5];

  const results = await runCode(FILENAME, params);
  expect(id, Array.isArray(results)).toBe(true);
  expect(id, results[0]).toBe(solution[0]);
  expect(id, results[1]).toBe(solution[1]);
});

test('main([1]) should equal  [1, 1]', async (id) => {
  const params = [[1]];
  const solution = [1, 1];

  const results = await runCode(FILENAME, params);
  expect(id, Array.isArray(results)).toBe(true);
  expect(id, results[0]).toBe(solution[0]);
  expect(id, results[1]).toBe(solution[1]);
});

test('main([2334454, 5]) should equal [5, 2334454]', async (id) => {
  const params = [[2334454, 5]];
  const solution = [5, 2334454];

  const results = await runCode(FILENAME, params);
  expect(id, Array.isArray(results)).toBe(true);
  expect(id, results[0]).toBe(solution[0]);
  expect(id, results[1]).toBe(solution[1]);
});
