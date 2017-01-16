describe("Robot Services: preferences basic-1", function() {
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
          "preferences": "basic-1"
        }
  };

  robot.state = robotState;
  robot.__initializeAvailableServices();

  beforeEach(function() {
    spyOn(robot, '__call').and.returnValue(deferredObject);
  });

  describe("#getPreferences", function() {

     it("calls Nucleo with the appropriate command", function() {
       var result = robot.getPreferences();

       expect(robot.__call).toHaveBeenCalledWith({
         reqId: "1",
         cmd: "getPreferences"
       });
       expect(result).toBe(deferredObject);
     });
  });

  describe("#SetPreferences", function() {

    it("calls Nucleo with the appropriate default command", function() {
      var result = robot.setPreferences();

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "setPreferences",
        params: {
          dirtbinAlertReminderInterval: 150,
          filterChangeReminderInterval: 43200,
          brushChangeReminderInterval: 172800
        }
      });
      expect(result).toBe(deferredObject);
    });

    it("calls Nucleo with the overrided params", function() {
      var result = robot.setPreferences({
        dirtbinAlertReminderInterval: 10,
        filterChangeReminderInterval: 11,
        brushChangeReminderInterval: 12
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "setPreferences",
        params: {
          dirtbinAlertReminderInterval: 10,
          filterChangeReminderInterval: 11,
          brushChangeReminderInterval: 12
        }
      });
      expect(result).toBe(deferredObject);
    });
  });
});
