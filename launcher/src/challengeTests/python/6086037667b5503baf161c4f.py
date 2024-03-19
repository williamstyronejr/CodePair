import testingLib

def test_1(id):
  params = ["test"]
  expectedValue = True
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)


testingLib.test("main(\"test\") should equal True", test_1);