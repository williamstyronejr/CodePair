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

def test_2(id):
  params = ["qwertyuio"]
  expectedValue = False

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

def test_3(id):
  params = ["1231"]
  expectedValue = True

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

testingLib.test("main(\"test\") should equal True", test_1);
testingLib.test("main(\"qwertyuio\") should equal False", test_2);
testingLib.test("main(\"1231\") should equal True", test_3);

