describe("Robot Services: generalInfo basic-1", function() {
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
          "generalInfo": "basic-1"
        }
  };

  robot.state = robotState;
  robot.__initializeAvailableServices();

  beforeEach(function() {
    spyOn(robot, '__call').and.returnValue(deferredObject);
  });

  describe("#getGeneralInfo", function() {

     it("calls Nucleo with the appropriate command", function() {
       var result = robot.generalInfo();

       expect(robot.__call).toHaveBeenCalledWith({
         reqId: "1",
         cmd: "getGeneralInfo"
       });
       expect(result).toBe(deferredObject);
     });
  });
});
