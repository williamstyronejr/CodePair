import testingLib
import sys
sys.path.append("..")
from usercode import main as runUserCode


def test_1(id):
  params = ["String"]
  expectedValue = "SSttrriinngg"

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue=expectedValue)

def test_2(id):
  params = ["string"]
  expectedValue = "ssttrriinngg"

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue)

def test_3(id):
  params = ["Hello World!"]
  expectedValue = "HHeelllloo  WWoorrlldd!!"

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue)

def test_4(id):
  params = ["1234!_ "]
  expectedValue = "11223344!!__  "

  userResult = runUserCode(*params)
  test = testingLib.expect(id, userResult)
  test.toBe(expectedValue)


testingLib.test("main(\"String\") should equal \"SSttrriinngg\"", test_1);
testingLib.test("main(\"string\") should equal \"ssttrriinngg\"", test_2);
testingLib.test("main(\"Hello World!\") should equal \"HHeelllloo  WWoorrlldd!!\"", test_3);
testingLib.test("main(\"1234!_ \") should equal \"11223344!!__  \"", test_4);
