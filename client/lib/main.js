window.guifm = {};

Session.set('isPlaying', false);
Session.set('playingTrack', false);
Session.set('rdioReady', false);

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};