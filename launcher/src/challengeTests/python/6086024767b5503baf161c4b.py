import testingLib
import sys
sys.path.append("..")
from usercode import main as runUserCode

def test_1(id):
  params = []
  expectedValue = 0

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = [1,2,3,4,5]
  expectedValue = 3

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue)


def test_3(id):
  params = [24,56,44,77,54,80,77,23,45,90]
  expectedValue = 57

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue)

def test_4(id):
  params = [100, 0]
  expectedValue = 50

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue)

def test_5(id):
  params = [100]
  expectedValue = 100

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue)

testingLib.test("main([]) should equal 0", test_1);
testingLib.test("main([1, 2, 3, 4, 5]) should equal 3", test_2);
testingLib.test("main([24, 56, 44, 77, 54, 80, 77, 23, 45, 90]) should equal 57", test_3);
testingLib.test("main([100, 0]) should equal 50", test_4);
testingLib.test("main([100]) should equal 100", test_5);