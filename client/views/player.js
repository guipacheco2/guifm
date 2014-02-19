Template.player.events({
  'click #play': function(evt) {
    evt.preventDefault();
    if (Session.get('playingTrack')) {
      guifm.rdio.play();
    } else {
      guifm.rdio.playfirst();
    };
  },

  'click #pause': function(evt) {
    evt.preventDefault();
    guifm.rdio.pause();
  },

  'click #previous': function(evt) {
    evt.preventDefault();
    guifm.rdio.previous();
  },

  'click #next': function(evt) {
    evt.preventDefault();
    guifm.rdio.next();
  }
});

Template.player.isPlaying = function() {
  return Session.get('isPlaying');
};