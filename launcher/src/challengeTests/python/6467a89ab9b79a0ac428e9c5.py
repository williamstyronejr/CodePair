import testingLib
import sys
sys.path.append("..")
from usercode import main as runUserCode

def test_1(id):
  params = [60]
  expectedValue = 3600

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = [1]
  expectedValue = 60

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

def test_3(id):
  params = [8]
  expectedValue = 480

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

def test_4(id):
  params = [8]
  expectedValue = 480

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

def test_5(id):
  params = [3]
  expectedValue = 180

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

testingLib.test("main(60) should equal 3600", test_1)
testingLib.test("main(1) should equal 60", test_2)
testingLib.test("main(8) should equal 480", test_3)
testingLib.test("main(0) should equal 0", test_4)
testingLib.test("main(3) should equal 180", test_5)