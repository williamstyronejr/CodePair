const { runCode } = require('../index');

const { FILENAME } = process.env;

test('main([]) should equal []', async (id) => {
  const params = [[]];
  const solution = [];

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main([3,2,1]) should equal [1,2,3]', async (id) => {
  const params = [[3, 2, 1]];
  const solution = [1, 2, 3];

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
