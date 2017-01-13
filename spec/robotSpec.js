describe("Robot", function() {

  describe("#initialize", function() {

    describe("when options are not passed in", function() {

      it("saves robot serial & secret key and sets the defaults", function() {
        var robot = new Neato.Robot("serial", "secretKey");

        expect(robot.serial).toEqual("serial");
        expect(robot.secretKey).toEqual("secretKey");
        expect(robot.host).toEqual("nucleo.neatocloud.com");
        expect(robot.port).toEqual(4443);
        expect(typeof(robot.onDisconnected)).toEqual("undefined");
        expect(typeof(robot.onStateChange)).toEqual("undefined");
      });
    });

    describe("when options are passed in", function() {

      it("saves robot serial & secret key and saves the options", function() {
        var robot = new Neato.Robot("serial", "secretKey", {
          host: "host",
          port: 4444,
          onDisconnected: "onDisconnected",
          onStateChange: "onStateChange"
        });

        expect(robot.serial).toEqual("serial");
        expect(robot.secretKey).toEqual("secretKey");
        expect(robot.host).toEqual("nucleo.neatocloud.com");
        expect(robot.port).toEqual(4443);
        expect(robot.onDisconnected).toEqual("onDisconnected");
        expect(robot.onStateChange).toEqual("onStateChange");
      });

      it("allows for multiple instances of object", function() {
        var robot1 = new Neato.Robot("serial1", "secretKey1");
        var robot2 = new Neato.Robot("serial2", "secretKey2");

        expect(robot1.serial).toEqual("serial1");
        expect(robot1.secretKey).toEqual("secretKey1");
        expect(robot2.serial).toEqual("serial2");
        expect(robot2.secretKey).toEqual("secretKey2");
      });
    });
  });

  describe("#connect", function() {
    var robot = new Neato.Robot("serial", "secretKey");

    beforeEach(function() {
      spyOn(robot, "getState");
      jasmine.clock().install();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it("updates the robot state regularly", function() {
      robot.connect();
      expect(robot.getState).toHaveBeenCalled();
      expect(robot.getState.calls.count()).toEqual(1);

      jasmine.clock().tick(3500);
      expect(robot.getState).toHaveBeenCalled();
      expect(robot.getState.calls.count()).toEqual(2);

      jasmine.clock().tick(3500);
      expect(robot.getState).toHaveBeenCalled();
      expect(robot.getState.calls.count()).toEqual(3);
    });
  });

  describe("#disconnect", function() {
    var robot = new Neato.Robot("serial", "secretKey");

    it("stops updating the robot state", function() {
      spyOn(robot, "getState");
      jasmine.clock().install();

      robot.connect();
      expect(robot.getState).toHaveBeenCalled();
      expect(robot.getState.calls.count()).toEqual(1);

      robot.disconnect();

      jasmine.clock().tick(3500);
      expect(robot.getState.calls.count()).toEqual(1);

      jasmine.clock().uninstall();
    });

    it("calls __disconnect", function() {
      var disconnectSpy = jasmine.createSpy("disconnectSpy");
      robot.__disconnect = disconnectSpy;

      robot.disconnect()

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  describe("Common calls", function() {
    var robot = new Neato.Robot("1234567890", "secret-key")
      , deferredObject = "deferredObject";

    beforeEach(function() {
      spyOn(robot, '__call').and.returnValue(deferredObject);
    });

    describe("#getState", function() {

      it("calls Robot with the appropriate command", function() {
        var result = robot.getState();

        expect(robot.__call).toHaveBeenCalledWith({ reqId: "1", cmd: "getRobotState" });
        expect(result).toBe(deferredObject);
      });
    });
  });

  describe("#__call", function() {
    var serial = "1234567890"
      , secretKey = "secret-key"
      , message = { my: "message" }
      , robot;

    beforeEach(function() {
      robot = new Neato.Robot(serial, secretKey);
    });

    describe("the request", function() {
      var request;

      beforeEach(function() {
        jasmine.clock().install();

        var requestDate = new Date("September 15, 2015 15:25:12 GMT");
        jasmine.clock().mockDate(requestDate);

        robot.__call(message);
        request = mostRecentAjaxRequest();
      });

      afterEach(function() {
        jasmine.clock().uninstall();
      });

      it("calls Nucleo with the proper url and method", function() {
        expect(request.url).toBe("https://nucleo.neatocloud.com:4443/vendors/neato/robots/1234567890/messages");
        expect(request.method).toBe("POST");
      });

      it("calls Nucleo with the proper headers", function() {
        expect(request.requestHeaders["Accept"]).toEqual("application/vnd.neato.nucleo.v1");
        expect(request.requestHeaders["X-Date"]).toEqual("Tue, 15 Sep 2015 15:25:12 GMT");
        expect(request.requestHeaders["Authorization"]).toEqual("NEATOAPP c97178e4480ebe2e2246051a0e9cee4e347c5bc8edfbea1e221f2e9c2d6b6610");
      });

      it("calls Nucleo with the proper body", function() {
        expect(request.params).toEqual('{"my":"message"}');
      });
    });

    describe("when response http code is success", function() {
      var extractedReply = { result: "ok", data: { some: "response-data" } };

      var respondWithSuccess = function() {
        mostRecentAjaxRequest().respondWith({
          status: 200,
          responseText: '{"some": "response"}'
        });
      };

      beforeEach(function() {
        spyOn(robot, "__setState");
        spyOn(robot, "__extractReplyFromReponse").and.returnValue(extractedReply);
      });

      describe("and robot result is 'ok'", function() {

        beforeEach(function() {
          extractedReply.result = "ok";
        });

        it("sets the robot state", function() {
          robot.__call(message);
          respondWithSuccess();

          expect(robot.__setState).toHaveBeenCalledWith({ some: 'response' });
        });

        it("calls the #done method of the returned deferred object with the correct params & context", function() {
          var testRobot
            , testResult
            , testData;

          robot.__call(message).done(function(result, data) {
            testRobot = this;
            testResult = result;
            testData = data;
          });
          respondWithSuccess();

          expect(testRobot).toBe(robot);
          expect(testResult).toEqual("ok");
          expect(testData).toEqual({ some: "response-data" });
        });

        it("does not call the #fail method", function() {
          var failCallback = jasmine.createSpy("failCallback");

          robot.__call(message).fail(failCallback);
          respondWithSuccess();

          expect(failCallback).not.toHaveBeenCalled();
        });

        it("does not call __disconnect", function() {
          var disconnectSpy = jasmine.createSpy("disconnectSpy");
          robot.__disconnect = disconnectSpy;

          robot.__call(message);
          respondWithSuccess();

          expect(disconnectSpy).not.toHaveBeenCalled();
        });
      });

      describe("and robot result is not 'ok'", function() {

        beforeEach(function() {
          extractedReply.result = "some-failure";
        });

        it("sets the robot state", function() {
          robot.__call(message);
          respondWithSuccess();

          expect(robot.__setState).toHaveBeenCalledWith({ some: 'response' });
        });

        it("does not call the #done method", function() {
          var doneCallback = jasmine.createSpy("doneCallback");

          robot.__call(message).done(doneCallback);
          respondWithSuccess();

          expect(doneCallback).not.toHaveBeenCalled();
        });

        it("calls the #fail method of the returned deferred object with the correct params & context", function() {
          var testRobot
            , testResult
            , testData;

          robot.__call(message).fail(function(result, data) {
            testRobot = this;
            testResult = result;
            testData = data;
          });
          respondWithSuccess();

          expect(testRobot).toEqual(robot);
          expect(testResult).toEqual("some-failure");
          expect(testData).toEqual({ some: "response-data" });
        });

        it("does not call __disconnect", function() {
          var disconnectSpy = jasmine.createSpy("disconnectSpy");
          robot.__disconnect = disconnectSpy;

          robot.__call(message);
          respondWithSuccess();

          expect(disconnectSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe("when response http code is failure", function() {

      var respondWithFailure = function() {
        mostRecentAjaxRequest().respondWith({
          status: 404,
          responseText: '{"some":"network-error"}'
        });
      };

      it("sets the robot state to undefined", function() {
        robot.state = { some: "state" };

        robot.__call(message);
        respondWithFailure();

        expect(typeof(robot.state)).toEqual("undefined");
      });

      it("does not call the #done method of the returned deferred object", function() {
        var doneCallback = jasmine.createSpy("doneCallback");

        robot.__call(message).done(doneCallback);
        respondWithFailure();

        expect(doneCallback).not.toHaveBeenCalled();
      });

      it("does not call the #fail method of the returned deferred object", function() {
        var failCallback = jasmine.createSpy("failCallback");

        robot.__call(message).fail(failCallback);
        respondWithFailure();

        expect(failCallback).not.toHaveBeenCalled();
      });

      it("calls __disconnect", function() {
        var disconnectSpy = jasmine.createSpy("disconnectSpy");
        robot.__disconnect = disconnectSpy;

        robot.disconnect()

        expect(disconnectSpy).toHaveBeenCalled();
      });
    });
  });

  describe("#__setState", function() {
    var robot;

    beforeEach(function() {
      robot = new Neato.Robot("serial", "secretKey");
    });

    describe("when the robot is online", function() {

      beforeEach(function() {
        robot.state = {
          "state": 2,
          "action": 1,
          "other": "old-value"
        };
      });

      describe("when json contains state elements", function() {

        describe("and the state has changed", function() {
          var json = {
            "version": 1,
            "reqId": "77",
            "result": "ok",
            "data": {},
            "state": 2,
            "action": 1,
            "other": "new-value"
          };

          it("sets the robot state", function() {
            robot.__setState(json);

            expect(robot.state).toEqual({
              "state": 2,
              "action": 1,
              "other": "new-value"
            });
          });

          it("triggers the onStateChange callback and __initializeAvailableServices method", function() {
            var testRobot
              , triggered;

            robot.onStateChange = function() {
              testRobot = this;
              triggered = true;
            };

            spyOn(robot, '__initializeAvailableServices');

            robot.__setState(json);

            expect(testRobot).toBe(robot);
            expect(triggered).toEqual(true);

            expect(robot.__initializeAvailableServices).toHaveBeenCalled();
          });
        });


        describe("and the state has not changed", function() {
          var json = {
            "version": 1,
            "reqId": "77",
            "result": "ok",
            "data": {},
            "state": 2,
            "action": 1,
            "other": "old-value"
          };

          it("does not edit the robot state", function() {
            robot.__setState(json);

            expect(robot.state).toEqual({
              "state": 2,
              "action": 1,
              "other": "old-value"
            });
          });

          it("does not trigger the onStateChange callback", function() {
            var onStateChangeCallback = jasmine.createSpy("onStateChangeCallback");
            robot.onStateChange = onStateChangeCallback;

            robot.__setState(json);

            expect(onStateChangeCallback).not.toHaveBeenCalled();
          });
        });
      });

      describe("when json does not contain state elements", function() {
        var json = {
          "version": 1,
          "reqId": "77",
          "result": "ok",
          "data": {},
          "action": 1,
          "other": "other-value"
        };

        it("does not modify the robot state", function() {
          robot.__setState(json);

          expect(robot.state).toEqual({
            "state": 2,
            "action": 1,
            "other": "old-value"
          });
        });
      });
    });

    describe("when the robot is offline", function() {

      beforeEach(function() {
        delete robot.state;
      });

      describe("when json contains state elements", function() {
        var json = {
          "version": 1,
          "reqId": "77",
          "result": "ok",
          "data": {},
          "state": 2,
          "action": 1,
          "other": "new-value"
        };

        it("sets the robot state", function() {
          robot.__setState(json);

          expect(robot.state).toEqual({
            "state": 2,
            "action": 1,
            "other": "new-value"
          });
        });

        it("triggers the onStateChange callback", function() {
          var testRobot
            , triggered;

          robot.onStateChange = function() {
            testRobot = this;
            triggered = true;
          };

          robot.__setState(json);

          expect(testRobot).toBe(robot);
          expect(triggered).toEqual(true);
        });
      });

      describe("when json does not contain state elements", function() {
        var json = {
          "version": 1,
          "reqId": "77",
          "result": "ok",
          "data": {},
          "action": 1,
          "other": "other-value"
        };

        it("does not modify the robot state", function() {
          robot.__setState(json);

          expect(typeof(robot.state)).toEqual("undefined");
        });

        it("does not trigger the onStateChange callback", function() {
          var onStateChangeCallback = jasmine.createSpy("onStateChangeCallback");
          robot.onStateChange = onStateChangeCallback;

          robot.__setState(json);

          expect(onStateChangeCallback).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("#__disconnect", function() {
    var robot;

    beforeEach(function() {
      robot = new Neato.Robot("serial", "secretKey");
      robot.state = { some: "state" };
    });

    it("deletes the state", function() {
      robot.__disconnect();

      expect(typeof(robot.state)).toEqual("undefined");
    });

    it("triggers the onDisconnected callback", function() {
      var onDisconnectedCallback = jasmine.createSpy("onDisconnectedCallback");
      robot.onDisconnected = onDisconnectedCallback;

      robot.__disconnect("one", "two");

      expect(onDisconnectedCallback).toHaveBeenCalledWith("one", "two");
    });
  });

  describe("#__extractReplyFromReponse", function() {
    var robot
      , json = {
      "version": 1,
      "reqId": "77",
      "result": "a-result",
      "data": { some: "reply-data" },
      "state": 2,
      "action": 1,
      "other": "other-value"
    };

    beforeEach(function() {
      robot = new Neato.Robot("serial", "secretKey");
    });

    it("returns only the reply elements", function() {
      expect(robot.__extractReplyFromReponse(json)).toEqual({
        result: "a-result",
        data: { some: "reply-data" }
      })
    });
  });
});
