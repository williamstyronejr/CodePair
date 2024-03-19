import testingLib

def test_1(id):
  params = [[1,2,3,4,5]]
  expectedValue = [1,5]
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = [[1]]
  expectedValue = [1,1]
  test = testingLib.expect(id, params)
  test.toBe(expectedValue)

def test_3(id):
  params = [[2334454,5]]
  expectedValue = [5,2334454]
  test = testingLib.expect(id, params)
  test.toBe(expectedValue)

testingLib.test("main([1, 2, 3, 4, 5]) should equal [1, 5]", test_1);
testingLib.test("main([1]) should equal [1, 1]", test_2);
testingLib.test("main([2334454, 5]) should equal [5, 2334454]", test_3);
