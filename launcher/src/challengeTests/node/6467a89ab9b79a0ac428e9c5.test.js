const { runCode } = require('../index');
const { FILENAME } = process.env;

test('main(60) should equal 3600', async (id) => {
  const params = [60];
  const solution = 3600;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(1) should equal 60', async (id) => {
  const params = [1];
  const solution = 60;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(8) should equal 480', async (id) => {
  const params = [8];
  const solution = 480;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(0) should equal 0', async (id) => {
  const params = [0];
  const solution = 0;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});

test('main(3) should equal 180', async (id) => {
  const params = [3];
  const solution = 180;

  const results = await runCode(FILENAME, params);
  expect(id, results).toBe(solution);
});
