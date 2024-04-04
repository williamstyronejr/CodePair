const { runCode } = require('../index');

const { FILENAME } = process.env;

test('main([]) should equal 0', async (id) => {
  const params = [[]];
  const solution = 0;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main([1,2,3,4,5]) should equal 3', async (id) => {
  const params = [[1, 2, 3, 4, 5]];
  const solution = 3;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main([24,56,44,77,54,80,77,23,45,90]) should equal 57', async (id) => {
  const params = [[24, 56, 44, 77, 54, 80, 77, 23, 45, 90]];
  const solution = 57;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main([100,0]) should equal 50', async (id) => {
  const params = [[100, 0]];
  const solution = 50;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main([100]) should equal 100', async (id) => {
  const params = [[100]];
  const solution = 100;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
