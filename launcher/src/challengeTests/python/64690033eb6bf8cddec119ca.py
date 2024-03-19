import testingLib

def test_1(id):
  params = ["String"]
  expectedValue = "SSttrriinngg"
  test = testingLib.expect(id, params)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = ["string"]
  expectedValue = "ssttrriinngg"
  test = testingLib.expect(id, params)
  test.toBe(expectedValue)

def test_3(id):
  params = ["Hello World!"]
  expectedValue = "HHeelllloo  WWoorrlldd!!"
  test = testingLib.expect(id, params)
  test.toBe(expectedValue)

def test_4(id):
  params = ["1234!_ "]
  expectedValue = "11223344!!__  "
  test = testingLib.expect(id, params)
  test.toBe(expectedValue)


testingLib.test("main(\"String\") should equal \"SSttrriinngg\"", test_1);
testingLib.test("main(\"string\") should equal \"ssttrriinngg\"", test_2);
testingLib.test("main(\"Hello World!\") should equal \"HHeelllloo  WWoorrlldd!!\"", test_3);
testingLib.test("main(\"1234!_ \") should equal \"11223344!!__  \"", test_4);
