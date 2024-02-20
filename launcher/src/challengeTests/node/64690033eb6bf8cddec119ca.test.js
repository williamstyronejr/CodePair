const { runCode } = require('../index');
const { FILENAME } = process.env;

test('main("String") should equal "SSttrriinngg"', async (id) => {
  const params = ['String'];
  const solution = 'SSttrriinngg';

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main("String") should equal "SSttrriinngg"', async (id) => {
  const params = ['String'];
  const solution = 'SSttrriinngg';

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main("Hello World!") should equal "HHeelllloo  WWoorrlldd!!"', async (id) => {
  const params = ['Hello World!'];
  const solution = 'HHeelllloo  WWoorrlldd!!';

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main("1234!_ ") should equal "11223344!!__  "', async (id) => {
  const params = ['1234!_ '];
  const solution = '11223344!!__  ';

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
