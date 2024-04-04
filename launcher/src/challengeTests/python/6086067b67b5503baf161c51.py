import testingLib
import sys
sys.path.append("..")
from usercode import main as runUserCode

def test_1(id):
  params = [1]
  expectedValue = [1]

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = [10]
  expectedValue = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue)

def test_3(id):
  params = [8]
  expectedValue = [8,7,6,5,4,3,2,1]

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue)

testingLib.test("main(1) should equal [1]", test_1);
testingLib.test("main(10) should equal [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]", test_2);
testingLib.test("main(8) should equal [8, 7, 6, 5, 4, 3, 2, 1]", test_3);
