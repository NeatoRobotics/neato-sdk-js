describe("Robot Services: schedule minimal-1", function() {
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
          "schedule": "minimal-1"
        }
      };

  robot.state = robotState;
  robot.__initializeAvailableServices();

  beforeEach(function() {
    spyOn(robot, '__call').and.returnValue(deferredObject);
  });

  describe("#setSchedule", function() {

    it("calls Nucleo with the appropriate command and parameters", function() {
      var result = robot.setSchedule({
        0: { mode: Neato.Constants.TURBO_MODE, startTime: "09:05" },
        3: { startTime: "14:45" }
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "setSchedule",
        params: {
          type: 1,
          events: [
            {
              day: 0,
              startTime: "09:05"
            },
            {
              day: 3,
              startTime: "14:45"
            }
          ]
        }
      });
      expect(result).toBe(deferredObject);
    });
  });

  describe("#getSchedule", function() {

    it("calls Nucleo with the appropriate command", function() {
      var result = robot.getSchedule();

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "getSchedule"
      });
      expect(result).toBe(deferredObject);
    });
  });

  describe("#enableSchedule", function() {

    it("calls Nucleo with the appropriate command", function() {
      var result = robot.enableSchedule();

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "enableSchedule"
      });
      expect(result).toBe(deferredObject);
    });
  });

  describe("#disableSchedule", function() {

    it("calls Nucleo with the appropriate command", function() {
      var result = robot.disableSchedule();

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "disableSchedule"
      });
      expect(result).toBe(deferredObject);
    });
  });
});
