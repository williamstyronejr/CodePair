import testingLib

def test_1(id):
  params = [4]
  expectedValue = 10
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = [13]
  expectedValue = 91
  test = testingLib.expect(id, params)
  test.toBe(expectedValue)

def test_3(id):
  params = [600]
  expectedValue = 180300
  test = testingLib.expect(id, params)
  test.toBe(expectedValue)

testingLib.test("main(4) should equal 10", test_1);
testingLib.test("main(13) should equal 91", test_2);
testingLib.test("main(600) should equal 180300", test_3);
