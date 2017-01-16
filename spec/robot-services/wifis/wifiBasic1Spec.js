describe("Robot Services: wifi basic-1", function() {
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
          "wifi": "basic-1"
        }
  };

  robot.state = robotState;
  robot.__initializeAvailableServices();

  beforeEach(function() {
    spyOn(robot, '__call').and.returnValue(deferredObject);
  });

  describe("#getWifiNetworks", function() {

     it("calls Nucleo with the appropriate command", function() {
       var result = robot.getWifiNetworks();

       expect(robot.__call).toHaveBeenCalledWith({
         reqId: "1",
         cmd: "getWifiNetworks"
       });
       expect(result).toBe(deferredObject);
     });
  });

  describe("#setWifiNetwork", function() {

    it("calls Nucleo with the appropriate default command and parameters", function() {
      var result = robot.setWifiNetwork({
        ssid: "helloWifi"
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "setWifiNetwork",
        params: {
          ssid: "helloWifi"
        }
      });
      expect(result).toBe(deferredObject);
    });
  });

  describe("#addWifiNetwork", function() {

    it("calls Nucleo with the appropriate default command and parameters", function() {
      var result = robot.addWifiNetwork({
        ssid: "helloWifi",
        password: "123456"
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "addWifiNetwork",
        params: {
          ssid: "helloWifi",
          password: "123456"
        }
      });
      expect(result).toBe(deferredObject);
    });
  });

  describe("#removeWifiNetwork", function() {

    it("calls Nucleo with the appropriate default command and parameters", function() {
      var result = robot.removeWifiNetwork({
        ssid: "helloWifi"
      });

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "removeWifiNetwork",
        params: {
          ssid: "helloWifi"
        }
      });
      expect(result).toBe(deferredObject);
    });
  });

  describe("#getAvailableWifiNetworks", function() {

    it("calls Nucleo with the appropriate command", function() {
      var result = robot.getAvailableWifiNetworks();

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "getAvailableWifiNetworks"
      });
      expect(result).toBe(deferredObject);
    });
  });

  describe("#resetWifiNetworks", function() {

    it("calls Nucleo with the appropriate command", function() {
      var result = robot.resetWifiNetworks();

      expect(robot.__call).toHaveBeenCalledWith({
        reqId: "1",
        cmd: "resetWifiNetworks"
      });
      expect(result).toBe(deferredObject);
    });
  });
});
