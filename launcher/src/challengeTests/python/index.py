# This should show error as this is the import used in the docker container
import testingLib

def test_1(id):
  params = 2
  expectedValue = 4
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = 3
  expectedValue = 9
  test = testingLib.expect(id, params)
  test.toBe(expectedValue)

testingLib.test("main(2) should equal 4", test_1);
testingLib.test("main(3) should equal 9", test_2);
