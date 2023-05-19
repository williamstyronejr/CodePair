const { runCode } = require('../index');
const { FILENAME } = process.env;

test('main(2,8) should equal 20', async (id) => {
  const params = [2, 8];
  const solution = 20;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(90, 20) should equal 220', async (id) => {
  const params = [90, 20];
  const solution = 220;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(25,25) should equal 100', async (id) => {
  const params = [25, 25];
  const solution = 100;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(1,8) should equal 18', async (id) => {
  const params = [1, 8];
  const solution = 18;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(8,1) should equal 18', async (id) => {
  const params = [8, 1];
  const solution = 18;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
