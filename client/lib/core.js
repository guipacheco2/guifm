(function($) { 'use strict';

  function Core() {};

  Core.prototype.activeSong = function(key) {
    $('.list-group-item.active').removeClass('active');
    $(document.getElementById(key)).addClass('active');
  };

  Core.prototype.setBG = function(bg) {
    $('body').css('background-image', 'url(' + bg + ')');
  };

  Core.prototype.scrollSong = function(key) {
    var $elPlaylist = $(document.getElementById('playlist')),
        $elPlaying = $(document.getElementById(key));

    $elPlaylist.animate({
        scrollTop: $elPlaying.offset().top + $elPlaylist.scrollTop() - $elPlaylist.height() / 2
    }, 500);
  };

  Core.prototype.hasNext = function(count) {
    var $el = $('.list-group-item.active');

    if (! count) count = 1;

    for (var i = 0; i < count; i++) {
      $el = $el.next();
    };

    return (typeof($el[0]) !== 'undefined');
  };

  Core.prototype.countSongs = function() {
    return Playlist.find().count();
  };

  Core.prototype.getArtistsId = function() {
    var playlist = Playlist.find({}, {
      fields: {
        'artist_id': 1
      }
    }).fetch();

    return _.pluck(playlist, 'artist_id')
  };

  Core.prototype.getSongsId = function() {
    var playlist = Playlist.find({}, {
      fields: {
        'id': 1
      }
    }).fetch();

    return _.pluck(playlist, 'id');
  };

  Core.prototype.getSongTypes = function() {
    var playlist,
        song_types,
        types;

    playlist = Playlist.find({}, {
      fields: {
        'song_type': 1
      }
    }).fetch();

    song_types = _.pluck(playlist, 'song_type');
    types = [];

    for (var i = 0; i < song_types.length; i++) {
      for (var j = 0; j < song_types[i].length; j++) {
        types.push(song_types[i][j]);
      };
    };

    return types;
  };

  Core.prototype.getBestSongTypes = function() {
    var types,
        max;

    types = this.countDups(this.getSongTypes());
    max = _.keys(types).max();

    return _.sample(types[max]);
  };

  Core.prototype.countDups = function(arr) {
    var current = null,
        cnt = 0,
        countDups = {};

    arr.sort();

    for (var i = 0; i < arr.length; i++) {
      if (arr[i] != current) {
        if (cnt > 0) {
          if (! countDups[cnt]) {
            countDups[cnt] = [];
          };
          countDups[cnt].push(current);
        };
        current = arr[i];
        cnt = 1;
      } else {
        cnt++;
      };
    };

    if (cnt > 0) {
      if (! countDups[cnt]) {
        countDups[cnt] = [];
      };
      countDups[cnt].push(current);
    };

    return countDups;
  };

  Core.prototype.getArtistaMenos = function() {
    var artists,
        counts;

    artists = this.countDups(this.getArtistsId());
    counts = _.keys(artists);

    return _.sample(artists[counts.min()]);
  };

  Core.prototype.getArtistaMais = function() {
    var artists,
        counts;

    artists = this.countDups(this.getArtistsId());
    counts = _.keys(artists);

    return _.sample(artists[counts.max()]);
  };

  Core.prototype.getNext = function() {
    if (_.random(0, 100) > 75) {
      this.getNextFromSimilar();
    } else {
      this.getNextFromPlaylist();
    };
  };

  Core.prototype.getNextFromPlaylist = function() {
    this.getArtistSong(this.getArtistaMenos());
  };

  Core.prototype.getNextFromSimilar = function() {
    var _this = this;

    guifm.echonest.similarArtist(guifm.core.getArtistaMais(), function() {
      var artists = _.pluck(this.data.response.artists, 'id'),
      existentes = _this.getArtistsId(),
      getted = false;

      artists = _.shuffle(artists);

      for (var i = 0; i < artists.length; i++) {
        if (! getted && existentes.indexOf(artists[i]) === -1) {
          getted = true;
          _this.getArtistSong(artists[i]);
        };
      };

      if (! getted) _this.getArtistSong(_.sample(artists));
    });
  };

  Core.prototype.getArtistSong = function(artistID) {
    var _this = this,
        added = false;

    guifm.echonest.artistSongs(artistID, this.getBestSongTypes(), function() {
      _.each(_.shuffle(this.data.response.songs), function(song) {
        if (! added) {
          if (song.tracks.length > 0 && _this.getSongsId().indexOf(song.id) === -1) {
            Playlist.insert(song);
            added = true;
          };
        };
      });

      if (! added) guifm.core.getNextFromSimilar();
    });
  };

  $(function() {
    guifm.core = new Core();
  });

})(jQuery);