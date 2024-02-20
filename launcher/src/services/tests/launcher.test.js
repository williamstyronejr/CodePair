const { launchContainer } = require('../launcher');

describe('Running node code through launcher', () => {
  const testCode = `
    function main(num, pow) {
      return Math.pow(num, pow)
    }
  `;

  test('Invalid or unsupported language throws 422 error with message', async () => {
    const type = 'non';
    const challengeId = '1234dksal';

    try {
      await launchContainer(testCode, type, challengeId);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.status).toBe(422);
      expect(err.msg).toBeDefined();
    }
  });

  test('Invalid challenge id should throw error', async () => {
    const langauge = 'node';
    const challengeId = 'fdkslafm';

    try {
      await launchContainer(testCode, langauge, challengeId);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  test('Valid parameters should response with object containing results', async () => {
    const langauge = 'node';
    const challengeId = 'index'; // Should be a test file in challengeTests folder

    const results = await launchContainer(testCode, langauge, challengeId);

    expect(results).toBeDefined();
    expect(typeof results).toBe('object');
    expect(results.testResults).toBeDefined();
    expect(Array.isArray(results.testResults));
    expect(results.passedTests).toBe(results.numOfTests);
  }, 10000);
});

describe('Running python code through launcher', () => {
  const testCode = `def main(x):\n  return x * x`;

  test('Valid parameters should response with object containing results', async () => {
    const language = 'python';
    const challengeId = 'index';

    const results = await launchContainer(testCode, language, challengeId);

    expect(results).toBeDefined();
    expect(typeof results).toBe('object');
    expect(results.testResults).toBeDefined();
    expect(Array.isArray(results.testResults));
    expect(results.passedTests).toBe(results.numOfTests);
  }, 20000);
});
