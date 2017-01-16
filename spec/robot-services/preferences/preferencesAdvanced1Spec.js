describe("Robot Services: preferences advanced-1", function() {
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
          "preferences": "advanced-1"
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
          robotSounds: false,
          dirtbinAlert: false,
          allAlerts: false,
          leds: false,
          buttonClicks: false,
          dirtbinAlertReminderInterval: 150,
          filterChangeReminderInterval: 43200,
          brushChangeReminderInterval: 172800,
          clock24h: false,
          locale: "en"
        }
      });
      expect(result).toBe(deferredObject);
    });

    it("calls Nucleo with the overrided params", function() {
      var result = robot.setPreferences({
        robotSounds: true,
        dirtbinAlert: true,
        allAlerts: true,
        leds: true,
        buttonClicks: true,
        dirtbinAlertReminderInterval: 1,
        filterChangeReminderInterval: 2,
        brushChangeReminderInterval: 3,
        clock24h: true,
        locale: "it"
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "setPreferences",
        params: {
          robotSounds: true,
          dirtbinAlert: true,
          allAlerts: true,
          leds: true,
          buttonClicks: true,
          dirtbinAlertReminderInterval: 1,
          filterChangeReminderInterval: 2,
          brushChangeReminderInterval: 3,
          clock24h: true,
          locale: "it"
        }
      });
      expect(result).toBe(deferredObject);
    });
  });
});
