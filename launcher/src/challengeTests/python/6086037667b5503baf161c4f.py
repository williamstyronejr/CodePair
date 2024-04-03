import testingLib
import sys
sys.path.append("..")
from usercode import main as runUserCode

def test_1(id):
  params = ["test"]
  expectedValue = True

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)


testingLib.test("main(\"test\") should equal True", test_1);