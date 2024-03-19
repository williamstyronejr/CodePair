import testingLib

def test_1(id):
  params = [True]
  expectedValue = "Yes"
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = [False]
  expectedValue = "No"
  test = testingLib.expect(id, params)
  test.toBe(expectedValue)

testingLib.test("main(True) should equal \"Yes\"", test_1);
testingLib.test("main(False) should equal \"No\"", test_2);