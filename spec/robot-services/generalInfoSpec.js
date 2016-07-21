describe("Nucleo Services: generalInfo", function() {
  var robot = new Neato.Robot("serial", "secretKey")
    , deferredObject = "deferredObject";

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
