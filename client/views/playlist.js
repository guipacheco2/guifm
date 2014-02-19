Template.playlist.events({
  'click .playSong': function(evt) {
    evt.preventDefault();
    guifm.rdio.play($(evt.currentTarget).parents('li').attr('id'));
  },
  'click .removeSong': function(evt) {
    if ($(evt.currentTarget).parents('li').hasClass('active')) {
      guifm.rdio.next();
    };

    if (guifm.core.countSongs() >= 5 && ! guifm.core.hasNext(2)) {
      guifm.core.getNext();
    };

    Playlist.remove(this._id);
  }
});

Template.playlist.rendered = function() {
  var playingTrack;

  $(window).on('resize', function() {
    document.getElementById('playlist').style.maxHeight = document.documentElement.clientHeight - document.getElementById('player').offsetHeight + 'px';
  });
  $(window).trigger('resize');

  playingTrack = Session.get('playingTrack')
  if (playingTrack) {
    guifm.core.activeSong(playingTrack.key);
    guifm.core.scrollSong(playingTrack.key);
  };
};

Template.playlist.songs = function() {
  return Playlist.find();
};

Template.playlist.rdioId = function() {
  if (this.tracks.length < 0 || ! this.tracks[0].foreign_id) {
    Playlist.remove(this._id);
    return false;
  };

  return this.tracks[0].foreign_id.replace('rdio-BR:track:', '');
};