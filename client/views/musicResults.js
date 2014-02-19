Template.musicResults.events({
  'click .addSong': function(evt) {
    Playlist.insert(this);
    $(document.getElementById('modalResults')).modal('hide');
  },

  'click .getArtistSongs': function(evt) {
    var songs = [];
    guifm.echonest.artistSongs(this.id, null, function() {
      if (this.data.response.songs.length === 0) {
        return false;
      };

      _.each(this.data.response.songs, function(song) {
        if (song.tracks.length > 0) songs.push(song);
      });

      Session.set('resultArtistSongs', songs);
    });
  },

  'click #getArtistsList': function(evt) {
    Session.set('resultArtistSongs', false);
  }
});

Template.musicResults.rendered = function() {
  $(document.getElementById('modalResults')).modal().on('hidden.bs.modal', function() {
    Session.set('showResults', false);
    Session.set('resultArtistSongs', false);
    Session.set('resultSongs', false);
    Session.set('resultArtists', false);
  });

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    Session.set('searchTab', e.target.id);
  });

  if (Session.get('searchTab')) {
    $(document.getElementById(Session.get('searchTab'))).tab('show');
  };
};

Template.musicResults.songs = function() {
  return Session.get('resultSongs');
};

Template.musicResults.artists = function() {
  return Session.get('resultArtists');
};

Template.musicResults.artistSongs = function() {
return Session.get('resultArtistSongs');
};