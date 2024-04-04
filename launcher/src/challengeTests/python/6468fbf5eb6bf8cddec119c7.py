import testingLib
import sys
sys.path.append("..")
from usercode import main as runUserCode

def test_1(id):
  params = [8]
  expectedValue = 40320

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)


def test_2(id):
  params = [10]
  expectedValue = 3628800

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)


def test_3(id):
  params = [3]
  expectedValue = 6

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)


testingLib.test("main(8) should equal 40320", test_1);
testingLib.test("main(10) should equal 3628800", test_2);
testingLib.test("main(3) should equal 6", test_3);