Template.musicSearch.events({
  'submit #songSearch': function(evt) {
    evt.preventDefault();

    var searchTerm,
    songs = [],
    artists = [];

    searchTerm = $(evt.currentTarget).find('input').val();
    if (searchTerm.length < 3) {
      return false;
    };

    guifm.echonest.searchSong(searchTerm, function() {
      if (this.data.response.songs.length === 0) {
        Session.set('resultSongs', false);
        songs = false;
        if (! songs && ! artists) Session.set('zeroResults', true);
        return false;
      };

      _.each(this.data.response.songs, function(song) {
        if (song.tracks.length > 0) songs.push(song);
      });

      Session.set('resultSongs', songs);
      Session.set('showResults', true);
      Session.set('zeroResults', false);
    });

    guifm.echonest.artistSearch(searchTerm, function() {
      if (this.data.response.artists.length === 0) {
        Session.set('resultArtists', false);
        artists = false;
        if (! songs && ! artists) Session.set('zeroResults', true);
        return false;
      };

      _.each(this.data.response.artists, function(artist) {
        artists.push(artist);
      });

      Session.set('resultArtists', artists);
      Session.set('showResults', true);
      Session.set('zeroResults', false);
    });
  }
});