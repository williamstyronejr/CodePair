import testingLib

def test_1(id):
  params = [2, 8]
  expectedValue = 20
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = [90, 20]
  expectedValue = 220
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)

def test_3(id):
  params = [25, 25]
  expectedValue = 100
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)

def test_4(id):
  params = [1, 8]
  expectedValue = 18
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)

def test_5(id):
  params = [8, 1]
  expectedValue = 18
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)

testingLib.test("main(2, 8)   should equal 20", test_1);
testingLib.test("main(90, 20) should equal 220", test_2);
testingLib.test("main(25, 25) should equal 100", test_3);
testingLib.test("main(1, 8)   should equal 18", test_4);
testingLib.test("main(8, 1)   should equal 18", test_5);