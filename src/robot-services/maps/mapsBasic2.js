Neato.Services.maps_basic2 = {
  maps: function() {
    return Neato.user.__getRobotMaps(this.serial);
  },
  mapDetails: function(mapId) {
    return Neato.user.__getMapDetails(this.serial, mapId);
  }
}
