describe("Robot Services: maps basic-2", function () {
  var robot = new Neato.Robot("serial", "secretKey")
    , deferredObject = "deferredObject"
    , userDeferredObject = "userDeferredObject"
    , detailsDeferredObject = "detailsDeferredObject"
    , persistentMapsDeferredObject = "persistentMapsDeferredObject"
    , robotState = {
      "version": 2,
      "reqId": "77",
      "result": "ok",
      "data": {},
      "state": 1,
      "action": 0,
      "availableServices": {
        "maps": "basic-2"
      }
    };

  robot.state = robotState;
  robot.__initializeAvailableServices();

  beforeEach(function () {
    // mock session user
    Neato.user = new Neato.User();
    Neato.user.token = "abc";
    spyOn(robot, '__call').and.returnValue(deferredObject);
    spyOn(Neato.user, '__getRobotMaps').and.returnValue(userDeferredObject);
    spyOn(Neato.user, '__getMapDetails').and.returnValue(detailsDeferredObject);
    spyOn(Neato.user, '__getRobotPersistentMaps').and.returnValue(persistentMapsDeferredObject);
  });

  describe("#maps", function () {

    it("doesn't calls Nucleo in any way", function () {
      var result = robot.maps();

      expect(robot.__call).not.toHaveBeenCalled();
      expect(result).not.toBe(deferredObject);
    });

    it("calls Beehive __getRobotMaps", function () {
      var result = robot.maps();

      expect(Neato.user.__getRobotMaps).toHaveBeenCalled();
      expect(result).toBe(userDeferredObject);
    });
  });

  describe("#map details", function () {

    it("doesn't calls Nucleo in any way", function () {
      var result = robot.mapDetails();

      expect(robot.__call).not.toHaveBeenCalled();
      expect(result).not.toBe(deferredObject);
    });

    it("calls Beehive __getRobotMaps", function () {
      var result = robot.mapDetails();

      expect(Neato.user.__getMapDetails).toHaveBeenCalled();
      expect(result).toBe(detailsDeferredObject);
    });
  });

  describe("#persistent maps", function () {

    it("doesn't calls Nucleo in any way", function () {
      var result = robot.persistentMaps();

      expect(robot.__call).not.toHaveBeenCalled();
      expect(result).not.toBe(deferredObject);
    });

    it("calls Beehive __getRobotPersistentMaps", function () {
      var result = robot.persistentMaps();

      expect(Neato.user.__getRobotPersistentMaps).toHaveBeenCalled();
      expect(result).toBe(persistentMapsDeferredObject);
    });
  });
});
