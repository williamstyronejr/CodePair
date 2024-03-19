import testingLib

def test_1(id):
  params = [[]]
  expectedValue = []
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = [[3,2,1]]
  expectedValue = [1,2,3]
  test = testingLib.expect(id, params)
  test.toBe(expectedValue)


testingLib.test("main([]) should equal []", test_1);
testingLib.test("main([3, 2, 1]) should equal [1, 2, 3]", test_2);
