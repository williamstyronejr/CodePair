# This should show error as this is the import used in the docker container
import testingLib

def test_1(id):
  params = [2, 3]
  expectedValue = 8
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = [2,2]
  expectedValue = 4
  test = testingLib.expect(id, params)
  test.toBe(expectedValue)

testingLib.test("main(2,3) should equal 8", test_1);
testingLib.test("main(2,2) should equal 4", test_2);
