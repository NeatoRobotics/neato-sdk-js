describe("Nucleo Services: schedule", function() {
  var robot = new Neato.Robot("serial", "secretKey")
    , deferredObject = "deferredObject";

  beforeEach(function() {
    spyOn(robot, '__call').and.returnValue(deferredObject);
  });

  describe("#setSchedule", function() {

    it("calls Nucleo with the appropriate command", function() {
      var result = robot.setSchedule({
        0: { mode: 1, startTime: "09:05" },
        3: { mode: 2, startTime: "14:45" }
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "setSchedule",
        params: {
          type: 1,
          events: [
            {
              mode: 1,
              day: 0,
              startTime: "09:05"
            },
            {
              mode: 2,
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
