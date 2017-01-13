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
          "spotCleaning": "basic-1"
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
           mode: Neato.Constants.TURBO_MODE,
           modifier: Neato.Constants.HOUSE_FREQUENCY_NORMAL,
           spotWidth: Neato.Constants.SPOT_AREA_LARGE,
           spotHeight: Neato.Constants.SPOT_AREA_LARGE
         }
       });
       expect(result).toBe(deferredObject);
     });

    it("calls Nucleo overriding default parameters", function() {
      var result = robot.startSpotCleaning({
        mode: Neato.Constants.ECO_MODE,
        modifier: Neato.Constants.HOUSE_FREQUENCY_DOUBLE,
        spotWidth: Neato.Constants.SPOT_AREA_SMALL,
        spotHeight: Neato.Constants.SPOT_AREA_SMALL
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "startCleaning",
        params: {
          category: Neato.Constants.CLEAN_SPOT_MODE,
          mode: Neato.Constants.ECO_MODE,
          modifier: Neato.Constants.HOUSE_FREQUENCY_DOUBLE,
          spotWidth: Neato.Constants.SPOT_AREA_SMALL,
          spotHeight: Neato.Constants.SPOT_AREA_SMALL
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
          mode: Neato.Constants.TURBO_MODE,
          modifier: Neato.Constants.HOUSE_FREQUENCY_NORMAL,
          spotWidth: Neato.Constants.SPOT_AREA_LARGE,
          spotHeight: Neato.Constants.SPOT_AREA_LARGE
        }
      });
      expect(result).toBe(deferredObject);
    });
  });
});
