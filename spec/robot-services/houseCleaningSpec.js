describe("Nucleo Services: houseCleaning", function() {
  var robot = new Neato.Robot("serial", "secretKey")
    , deferredObject = "deferredObject";

  beforeEach(function() {
    spyOn(robot, '__call').and.returnValue(deferredObject);
  });

  describe("#startCleaning", function() {

    it("calls Nucleo with the appropriate command", function() {
      var result = robot.startCleaning({
        category: 11,
        mode: 22,
        modifier: 33
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "startCleaning",
        params: {
          category: 11,
          mode: 22,
          modifier: 33
        }
      });
      expect(result).toBe(deferredObject);
    });
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
