// This should show error as this is the import in the docker container
const { runCode } = require('../index');

const { FILENAME } = process.env;

test('main(2,3) should be 8', async (id) => {
  const params = [2, 3];
  const solution = 8;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(2,2) should equal 4', async (id) => {
  const params = [2, 2];
  const solution = 4;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
