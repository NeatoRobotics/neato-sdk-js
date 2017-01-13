describe("Robot Services: common cleaning operations (stop, pause, resume, dock)", function() {
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
          "houseCleaning": "basic-1"
        }
      };

  robot.state = robotState;
  robot.__initializeAvailableServices();

  beforeEach(function() {
    spyOn(robot, '__call').and.returnValue(deferredObject);
  });

  describe("#stopCleaning", function() {

    it("calls Nucleo with the appropriate command", function() {
      var result = robot.stopCleaning();

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "stopCleaning"
      });
      expect(result).toBe(deferredObject);
    });
  });

  describe("#pauseCleaning", function() {

    it("calls Nucleo with the appropriate command", function() {
      var result = robot.pauseCleaning();

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "pauseCleaning"
      });
      expect(result).toBe(deferredObject);
    });
  });

  describe("#resumeCleaning", function() {

    it("calls Nucleo with the appropriate command", function() {
      var result = robot.resumeCleaning();

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "resumeCleaning"
      });
      expect(result).toBe(deferredObject);
    });
  });

  describe("#sendToBase", function() {

    it("calls Nucleo with the appropriate command", function() {
      var result = robot.sendToBase();

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "sendToBase"
      });
      expect(result).toBe(deferredObject);
    });
  });
});
