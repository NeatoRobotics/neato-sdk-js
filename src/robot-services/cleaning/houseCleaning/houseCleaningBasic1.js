Neato.Services.houseCleaning_basic1 = {

  startHouseCleaning: function(options) {
    options = options || {};

    var message = {
      reqId: "1",
      cmd: "startCleaning",
      params: {
        category: Neato.Constants.CLEAN_HOUSE_MODE,
        mode: options.mode || Neato.Constants.TURBO_MODE,
        modifier: options.modifier || Neato.Constants.HOUSE_FREQUENCY_NORMAL
      }
    };
    return this.__call(message);
  },

  supportEcoTurboMode: function() {
    return true;
  },
  supportFrequency: function() {
    return true;
  },
  supportExtraCare: function() {
    return false;
  },

  stopCleaning: Neato.Services.cleaning.stopCleaning,
  pauseCleaning: Neato.Services.cleaning.pauseCleaning,
  resumeCleaning: Neato.Services.cleaning.resumeCleaning,
  sendToBase: Neato.Services.cleaning.sendToBase
};
