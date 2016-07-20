describe("Nucleo Services: findMe", function() {
  var robot = new Neato.Robot("serial", "secretKey")
    , deferredObject = "deferredObject";

  beforeEach(function() {
    spyOn(robot, '__call').and.returnValue(deferredObject);
  });

  describe("#findMe", function() {

     it("calls Nucleo with the appropriate command", function() {
       var result = robot.findMe();

       expect(robot.__call).toHaveBeenCalledWith({
         reqId: "1",
         cmd: "findMe"
       });
       expect(result).toBe(deferredObject);
     });
  });
});
