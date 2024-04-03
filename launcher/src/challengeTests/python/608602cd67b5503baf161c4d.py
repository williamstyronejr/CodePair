import testingLib
import sys
sys.path.append("..")
from usercode import main as runUserCode

def test_1(id):
  params = [[]]
  expectedValue = []

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = [[3,2,1]]
  expectedValue = [1,2,3]

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue)


testingLib.test("main([]) should equal []", test_1);
testingLib.test("main([3, 2, 1]) should equal [1, 2, 3]", test_2);
