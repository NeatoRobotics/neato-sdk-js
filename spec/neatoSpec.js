//describe("Neato", function() {
//
//  describe("#initialize", function() {
//
//    describe("when options are not passed in", function() {
//
//      it("initializes a Nucleo object with the passed in options", function() {
//        var neato = new Neato();
//        expect(neato.nucleo.host).toEqual("nucleo.neatocloud.com");
//      });
//    });
//
//    describe("when options are passed in", function() {
//
//      it("initializes a Neato object with the passed in options", function() {
//        var neato = new Neato({
//          onConnected: "callback1",
//          onDisconnected: "callback2",
//          onStateChange: "callback3"
//        });
//
//        expect(neato.nucleo.callbacks.onConnected).toEqual("callback1");
//        expect(neato.nucleo.callbacks.onDisconnected).toEqual("callback2");
//        expect(neato.nucleo.callbacks.onStateChange).toEqual("callback3");
//      });
//
//      it("allows for multiple instances of object", function() {
//        var neato1 = new Neato({
//          onConnected: "callback1"
//        });
//        var neato2 = new Neato({
//          onConnected: "callback2"
//        });
//
//        expect(neato1.nucleo.callbacks.onConnected).toEqual("callback1");
//        expect(neato2.nucleo.callbacks.onConnected).toEqual("callback2");
//      });
//    });
//  });
//
//  describe("Nucleo proxy functions", function() {
//    var neato = new Neato();
//
//    describe("common", function() {
//
//      it("calls connectTo", function() {
//        spyOn(neato.nucleo, "connectTo");
//        neato.connectTo("serial", "secretKey");
//        expect(neato.nucleo.connectTo).toHaveBeenCalledWith("serial", "secretKey");
//      });
//
//      it("calls disconnectFrom", function() {
//        spyOn(neato.nucleo, "disconnectFrom");
//        neato.disconnectFrom("serial");
//        expect(neato.nucleo.disconnectFrom).toHaveBeenCalledWith("serial");
//      });
//
//      it("calls getRobotState", function() {
//        spyOn(neato.nucleo, "getRobotState");
//        neato.getRobotState("serial", "secretKey");
//        expect(neato.nucleo.getRobotState).toHaveBeenCalledWith("serial", "secretKey");
//      });
//
//      it("calls getRobotState", function() {
//        spyOn(neato.nucleo, "getRobotState");
//        neato.getRobotState("serial", "secretKey");
//        expect(neato.nucleo.getRobotState).toHaveBeenCalledWith("serial", "secretKey");
//      });
//
//      it("calls getRobotInfo", function() {
//        spyOn(neato.nucleo, "getRobotInfo");
//        neato.getRobotInfo("serial", "secretKey");
//        expect(neato.nucleo.getRobotInfo).toHaveBeenCalledWith("serial", "secretKey");
//      });
//    });
//
//    describe("cleaning", function() {
//
//      it("calls startCleaning", function() {
//        spyOn(neato.nucleo, "startCleaning");
//        neato.startCleaning("serial", "secretKey", { some: "options" });
//        expect(neato.nucleo.startCleaning).toHaveBeenCalledWith("serial", "secretKey", { some: "options" });
//      });
//
//      it("calls stopCleaning", function() {
//        spyOn(neato.nucleo, "stopCleaning");
//        neato.stopCleaning("serial", "secretKey");
//        expect(neato.nucleo.stopCleaning).toHaveBeenCalledWith("serial", "secretKey");
//      });
//
//      it("calls pauseCleaning", function() {
//        spyOn(neato.nucleo, "pauseCleaning");
//        neato.pauseCleaning("serial", "secretKey");
//        expect(neato.nucleo.pauseCleaning).toHaveBeenCalledWith("serial", "secretKey");
//      });
//
//      it("calls resumeCleaning", function() {
//        spyOn(neato.nucleo, "resumeCleaning");
//        neato.resumeCleaning("serial", "secretKey");
//        expect(neato.nucleo.resumeCleaning).toHaveBeenCalledWith("serial", "secretKey");
//      });
//
//      it("calls sendToBase", function() {
//        spyOn(neato.nucleo, "sendToBase");
//        neato.sendToBase("serial", "secretKey");
//        expect(neato.nucleo.sendToBase).toHaveBeenCalledWith("serial", "secretKey");
//      });
//    });
//
//    describe("schedule", function() {
//
//      it("calls setSchedule", function() {
//        spyOn(neato.nucleo, "setSchedule");
//        neato.setSchedule("serial", "secretKey", { some: "options" });
//        expect(neato.nucleo.setSchedule).toHaveBeenCalledWith("serial", "secretKey", { some: "options" });
//      });
//
//      it("calls getSchedule", function() {
//        spyOn(neato.nucleo, "getSchedule");
//        neato.getSchedule("serial", "secretKey");
//        expect(neato.nucleo.getSchedule).toHaveBeenCalledWith("serial", "secretKey");
//      });
//
//      it("calls enableSchedule", function() {
//        spyOn(neato.nucleo, "enableSchedule");
//        neato.enableSchedule("serial", "secretKey");
//        expect(neato.nucleo.enableSchedule).toHaveBeenCalledWith("serial", "secretKey");
//      });
//
//      it("calls disableSchedule", function() {
//        spyOn(neato.nucleo, "disableSchedule");
//        neato.disableSchedule("serial", "secretKey");
//        expect(neato.nucleo.disableSchedule).toHaveBeenCalledWith("serial", "secretKey");
//      });
//    });
//  });
//});
