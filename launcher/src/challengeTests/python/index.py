# This should show error as this is the import used in the docker container
import testingLib
import sys
sys.path.append("..")
from usercode import main as runUserCode


def test_1(id):
  params = [2, 3]
  expectedValue = 8

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = [2,2]
  expectedValue = 4
  
  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue)

testingLib.test("main(2,3) should equal 8", test_1);
testingLib.test("main(2,2) should equal 4", test_2);
