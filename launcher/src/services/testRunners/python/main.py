import sys
import importlib
import testingLib

def printErrorMsg(str):
	# Should output to console as in json format
  print(f'{{ "error": {str} }}')
  return

def main():
  args = sys.argv
  if (args.__len__() != 2):
    printErrorMsg("Test file name was not provided, code run was stopped.")
    return

  testName = args[1]
  if type(testName) is not str or testName.strip() == "":
    printErrorMsg("Test file is invalid. Provide a valid file name")
    return

  i = importlib.import_module(f"test.{testName}")
  testingLib.run()

main()
