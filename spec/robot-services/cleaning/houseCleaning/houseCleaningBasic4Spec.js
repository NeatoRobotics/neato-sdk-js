describe("Robot Services: houseCleaning basic-4", function() {
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
          "houseCleaning": "basic-4"
        }
      };

  robot.state = robotState;
  robot.__initializeAvailableServices();

  beforeEach(function() {
    spyOn(robot, '__call').and.returnValue(deferredObject);
  });

  describe("#startHouseCleaning", function() {

    it("calls Nucleo with the appropriate command and default parameters", function() {
      var result = robot.startHouseCleaning();

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "startCleaning",
        params: {
          category: Neato.Constants.CLEAN_HOUSE_MODE,
          mode: Neato.Constants.TURBO_MODE,
          navigationMode: Neato.Constants.EXTRA_CARE_OFF
        }
      });
      expect(result).toBe(deferredObject);
    });

    it("calls Nucleo overriding default parameters", function() {
      var result = robot.startHouseCleaning({
        mode: Neato.Constants.ECO_MODE,
        navigationMode: Neato.Constants.EXTRA_CARE_ON
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "startCleaning",
        params: {
          category: Neato.Constants.CLEAN_HOUSE_MODE,
          mode: Neato.Constants.ECO_MODE,
          navigationMode: Neato.Constants.EXTRA_CARE_ON
        }
      });
      expect(result).toBe(deferredObject);
    });

    it("calls Nucleo with boundaryId", function () {
      var result = robot.startHouseCleaning({
        boundaryId: 1234
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "startCleaning",
        params: {
          category: Neato.Constants.CLEAN_MAP_MODE,
          mode: Neato.Constants.TURBO_MODE,
          navigationMode: Neato.Constants.EXTRA_CARE_OFF,
          boundaryId: 1234
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
          navigationMode: Neato.Constants.EXTRA_CARE_OFF
        }
      });
      expect(result).toBe(deferredObject);
    });
  });

  it("it support eco/turbo mode", function() {
    expect(robot.supportEcoTurboMode()).toBe(true);
  });

  it("it support cleaning frequency", function() {
    expect(robot.supportFrequency()).toBe(true);
  });

  it("it support extra care", function() {
    expect(robot.supportExtraCare()).toBe(true);
  });
});
