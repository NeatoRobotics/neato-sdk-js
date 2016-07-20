describe("Neato Utils", function() {

  describe("#haveEqualProps", function() {

    describe("when objects have the same props", function() {
      var obj1 = { one: 1, two: 2, three: [3, 1, 2] };
      var obj2 = { two: 2, three: [3, 1, 2], one: 1 };

      it("returns true", function() {
        expect(Neato.utils.haveEqualProps(obj1, obj2)).toEqual(true);
      });
    });

    describe("when objects have different props", function() {
      var obj1 = { one: 1, two: 2, three: [3, 1, 3] };
      var obj2 = { two: 2, three: [3, 1, 2], one: 1 };

      it("returns true", function() {
        expect(Neato.utils.haveEqualProps(obj1, obj2)).toEqual(false);
      });
    });

    describe("when first object has less props", function() {
      var obj1 = { one: 1, three: [3, 1, 2] };
      var obj2 = { two: 2, three: [3, 1, 2], one: 1 };

      it("returns false", function() {
        expect(Neato.utils.haveEqualProps(obj1, obj2)).toEqual(false);
      });
    });

    describe("when second object has less props", function() {
      var obj1 = { one: 1, two: 2, three: [3, 1, 2] };
      var obj2 = { two: 2, three: [3, 1, 2] };

      it("returns true", function() {
        expect(Neato.utils.haveEqualProps(obj1, obj2)).toEqual(false);
      });
    });
  });

  describe("#clone", function() {

    describe("when no rejected elements are passed in", function() {

      it("clones all of the object", function() {
        var obj = { a: 1, b: 2, c: 3 };
        var clone = Neato.utils.clone(obj);

        expect(clone.a).toEqual(1);
        expect(clone.b).toEqual(2);
        expect(clone.c).toEqual(3);

        delete obj.a;
        expect(clone.a).toEqual(1);
      });
    });

    describe("when rejected elements are passed in", function() {

      it("clones all of the object except the rejected elements", function() {
        var obj = { a: 1, b: 2, c: 3 };
        var clone = Neato.utils.clone(obj, {
          except: ["c"]
        });

        expect(Neato.utils.haveEqualProps(obj, clone)).toEqual(false);
        expect(clone.a).toEqual(1);
        expect(clone.b).toEqual(2);
        expect(typeof(clone.c)).toEqual("undefined");

        delete obj.a;
        expect(clone.a).toEqual(1);
      });
    });

    describe("when selected elements are passed in", function() {

      it("clones only the selected elements of the object", function() {
        var obj = { a: 1, b: 2, c: 3 };
        var clone = Neato.utils.clone(obj, {
          only: ["c"]
        });

        expect(Neato.utils.haveEqualProps(obj, clone)).toEqual(false);
        expect(typeof(clone.a)).toEqual("undefined");
        expect(typeof(clone.b)).toEqual("undefined");
        expect(clone.c).toEqual(3);

        delete obj.c;
        expect(clone.c).toEqual(3);
      });
    });
  });

  describe("#isNullOrEmptyJSON", function() {

    describe("when an object is null or undefined", function () {

      it("return true", function () {
        var obj = null;
        var obj2 = undefined;
        var obj3 = {};

        expect(Neato.utils.isNullOrEmptyJSON(obj)).toEqual(true);
        expect(Neato.utils.isNullOrEmptyJSON(obj2)).toEqual(true);
        expect(Neato.utils.isNullOrEmptyJSON(obj3)).toEqual(true);
      });
    });
  });

  describe("#isNullOrEmptyJSON", function() {

    describe("when an object is not null or undefined", function () {

      it("return false", function () {
        var obj = {name:"marco"};

        expect(Neato.utils.isNullOrEmptyJSON(obj)).toEqual(false);
      });
    });
  });
});
