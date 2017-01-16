describe("Robot Services: spotCleaning basic-1", function() {
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
          "spotCleaning": "micro-2"
        }
      };

  robot.state = robotState;
  robot.__initializeAvailableServices();

  beforeEach(function() {
    spyOn(robot, '__call').and.returnValue(deferredObject);
  });

  describe("#startSpotCleaning", function() {

     it("calls Nucleo with the appropriate command and parameters", function() {
       var result = robot.startSpotCleaning();

       expect(robot.__call).toHaveBeenCalledWith({
         reqId: "1",
         cmd: "startCleaning",
         params: {
           category: Neato.Constants.CLEAN_SPOT_MODE,
           navigationMode: Neato.Constants.EXTRA_CARE_OFF
         }
       });
       expect(result).toBe(deferredObject);
     });

    it("calls Nucleo overriding default parameters", function() {
      var result = robot.startSpotCleaning({
        navigationMode: Neato.Constants.EXTRA_CARE_ON
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "startCleaning",
        params: {
          category: Neato.Constants.CLEAN_SPOT_MODE,
          navigationMode: Neato.Constants.EXTRA_CARE_ON
        }
      });
      expect(result).toBe(deferredObject);
    });

    it("calls Nucleo discarding unsupported parameters", function() {
      var result = robot.startSpotCleaning({
        unsupportedKey: "unsupportedValue"
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "startCleaning",
        params: {
          category: Neato.Constants.CLEAN_SPOT_MODE,
          navigationMode: Neato.Constants.EXTRA_CARE_OFF
        }
      });
      expect(result).toBe(deferredObject);
    });
  });

  it("it doesn't support eco/turbo mode", function() {
    expect(robot.supportEcoTurboMode()).toBe(false);
  });

  it("it doesn't support cleaning frequency", function() {
    expect(robot.supportFrequency()).toBe(false);
  });

  it("it support extra care", function() {
    expect(robot.supportExtraCare()).toBe(true);
  });

  it("it doesn't support cleaning area", function() {
    expect(robot.supportArea()).toBe(false);
  });
});
