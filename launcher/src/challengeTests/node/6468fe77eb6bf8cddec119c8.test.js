const { runCode } = require('../index');
const { FILENAME } = process.env;

test('main(4) should equal 10', async (id) => {
  const params = [4];
  const solution = 10;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(13) should equal 91', async (id) => {
  const params = [13];
  const solution = 91;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(600) should equal 180300', async (id) => {
  const params = [600];
  const solution = 180300;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
