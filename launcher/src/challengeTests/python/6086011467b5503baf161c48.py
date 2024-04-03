import testingLib
import sys
sys.path.append("..")
from usercode import main as runUserCode


def test_1(id):
  params = [True]
  expectedValue = "Yes"

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = [False]
  expectedValue = "No"
  
  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue)

testingLib.test("main(True) should equal \"Yes\"", test_1);
testingLib.test("main(False) should equal \"No\"", test_2);