describe("Robot Services: houseCleaning basic-2", function() {
  var robot = new Neato.Robot("serial", "secretKey")
    , deferredObject = "deferredObject"
    , robotState = {
        "version": 1,
        "reqId": "77",
        "result": "ok",
        "data": {},
        "state": 1,
        "action": 0,
        "availableServices": {
          "houseCleaning": "basic-2"
        }
      };

  robot.state = robotState;
  robot.__initializeAvailableServices();

  beforeEach(function() {
    spyOn(robot, '__call').and.returnValue(deferredObject);
  });

  describe("#startHouseCleaning", function() {

    it("calls Nucleo with the appropriate command and parameters", function() {
      var result = robot.startHouseCleaning();

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "startCleaning",
        params: {
          category: Neato.Constants.CLEAN_HOUSE_MODE,
          mode: Neato.Constants.TURBO_MODE,
          modifier: Neato.Constants.HOUSE_FREQUENCY_NORMAL,
          navigationMode: Neato.Constants.EXTRA_CARE_OFF
        }
      });
      expect(result).toBe(deferredObject);
    });

    it("calls Nucleo overriding default parameters", function() {
      var result = robot.startHouseCleaning({
        mode: Neato.Constants.ECO_MODE,
        modifier: Neato.Constants.HOUSE_FREQUENCY_DOUBLE,
        navigationMode: Neato.Constants.EXTRA_CARE_ON
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "startCleaning",
        params: {
          category: Neato.Constants.CLEAN_HOUSE_MODE,
          mode: Neato.Constants.ECO_MODE,
          modifier: Neato.Constants.HOUSE_FREQUENCY_DOUBLE,
          navigationMode: Neato.Constants.EXTRA_CARE_ON
        }
      });
      expect(result).toBe(deferredObject);
    });

    it("calls Nucleo discarding unsupported parameters", function() {
      var result = robot.startHouseCleaning({
        unsupportedKey: "unsupportedValue"
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "startCleaning",
        params: {
          category: Neato.Constants.CLEAN_HOUSE_MODE,
          mode: Neato.Constants.TURBO_MODE,
          modifier: Neato.Constants.HOUSE_FREQUENCY_NORMAL,
          navigationMode: Neato.Constants.EXTRA_CARE_OFF
        }
      });
      expect(result).toBe(deferredObject);
    });
  });
});
