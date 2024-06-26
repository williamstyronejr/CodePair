from pathlib import Path
import json

tests = []
expectations = dict()
totalTest = 0
testsPassed = 0
testsFailed = 0
error = None

class Expect():
  val = 0
  id = ''

  def __init__(self, id, value):
    self.value = value
    self.id = id

  def toBe(self, expectedValue):
    global testsPassed
    global testsFailed
    # Receiving function as expectedvalue will be marked as failed
    if callable(expectedValue):
      expectations[self.id]["expects"] = [
        *expectations[self.id]["expects"],
        {
          "status": False,
          "name": f"Expected: {expectedValue} Received: function"
        }
      ]
      testsFailed += 1
      return


    # Dict comparison
    if (self.value == expectedValue):
      expectations[self.id]["expects"] = [
        *expectations[self.id]["expects"],
        {
          "status": True,
          "name": f"Expected: {expectedValue} Received: {self.value}"
        }
      ]

      testsPassed += 1
      return


    expectations[self.id]["expects"] = [
      *expectations[self.id]["expects"],
      {
        "status": False,
        "name": f"Expected: {expectedValue} Received: {self.value}"
      }
    ]
    testsFailed += 1


def expect(id, val):
  return Expect(id, val)


def test(name, fn, timeout = 5000):
  global totalTest
  tests.append({"name": name, "fn": fn, "timeout": timeout})
  totalTest += 1

def runTestFile():
  for userTest in tests:
    expectations[userTest["name"]] = { "name": userTest["name"], "status": True, "expects": [] }
    userTest["fn"](userTest["name"])
    for expect in expectations[userTest["name"]]["expects"]:
       if not expect["status"]:
          expectations[userTest["name"]]["status"] = False
          break

def showResults():
	output = {
		"numOfTests": totalTest,
		"passedTests": testsPassed,
		"failedTests": testsFailed,
		"testResults": list(expectations.values()),
		"time": 0,
	}

	print(json.dumps(output))

def searchTestFolder():
    folder = Path("../../challengeTests")
    return folder.exists()

def run():
  # if searchTestFolder():
  runTestFile()
  showResults()
