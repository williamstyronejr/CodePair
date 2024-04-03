import testingLib
import sys
sys.path.append("..")
from usercode import main as runUserCode

def test_1(id):
  params = [8,10]
  expectedValue = 17

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)


def test_2(id):
  params = [9, 2]
  expectedValue = 10

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)


def test_3(id):
  params = [5, 7]
  expectedValue = 11

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)


testingLib.test("main(8, 10) should equal 17", test_1);
testingLib.test("main(9, 2)  should equal 10", test_2);
testingLib.test("main(5, 7)  should equal 11", test_3);