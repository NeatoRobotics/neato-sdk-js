Neato.Services.houseCleaning_basic3 = {

  startHouseCleaning: function(options) {
    options = options || {};

    var message = {
      reqId: "1",
      cmd: "startCleaning",
      params: {
        category: Neato.Constants.CLEAN_HOUSE_MODE,
        mode: options.mode || Neato.Constants.TURBO_MODE,
        navigationMode: options.navigationMode || Neato.Constants.EXTRA_CARE_OFF
      }
    };
    return this.__call(message);
  },
  supportEcoTurboMode: function() {
    return true;
  },
  supportFrequency: function() {
    return false;
  },
  supportExtraCare: function() {
    return true;
  },
  stopCleaning: Neato.Services.cleaning.stopCleaning,
  pauseCleaning: Neato.Services.cleaning.pauseCleaning,
  resumeCleaning: Neato.Services.cleaning.resumeCleaning,
  sendToBase: Neato.Services.cleaning.sendToBase
};
