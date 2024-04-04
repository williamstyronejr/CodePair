const { runCode } = require('../index');

const { FILENAME } = process.env;

test('main("test") should equal true', async (id) => {
  const params = 'test';
  const solution = true;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
