Neato.Services.schedule_basic1 = {
  setSchedule: function(options) {
    options = options || {};

    var events = $.map(options, function(dayOptions, day) {
      return {
        mode: dayOptions.mode || Neato.Constants.TURBO_MODE,
        day: parseInt(day, 10),
        startTime: dayOptions.startTime
      }
    });

    var message = {
      reqId: "1",
      cmd: "setSchedule",
      params: {
        type: 1,
        events: events
      }
    };
    return this.__call(message);
  },

  getSchedule: function() {
    var message = { reqId: "1", cmd: "getSchedule" };
    return this.__call(message);
  },

  enableSchedule: function() {
    var message = { reqId: "1", cmd: "enableSchedule" };
    return this.__call(message);
  },

  disableSchedule: function() {
    var message = { reqId: "1", cmd: "disableSchedule" };
    return this.__call(message);
  }
}
