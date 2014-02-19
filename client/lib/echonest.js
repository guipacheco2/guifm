(function($) { 'use strict';

  function EchoNest() {
    this.apiKey = 'K3HBDIO31AJKSHMNQ';
    this.format = 'json';
    this.baseUrl = 'http://developer.echonest.com/api/v4/';
  };

  EchoNest.prototype.searchSong = function(title, cb) {
    var params = $.param({
      'api_key': this.apiKey,
      'format': this.format,
      'results': 30,
      'title': title,
      'sort': 'song_hotttnesss-desc',
      'bucket': ['id:rdio-BR', 'tracks', 'song_type'],
      'limit': true
    }, true);

    HTTP.get(this.baseUrl + 'song/search?' + params, function(error, result) {
      if (error) return false;
      cb.call(result);
    });
  };

  EchoNest.prototype.artistSongs = function(id, song_type, cb) {
    var params = $.param({
      'api_key': this.apiKey,
      'format': this.format,
      'results': 30,
      'artist_id': id,
      'sort': 'song_hotttnesss-desc',
      'bucket': ['id:rdio-BR', 'tracks', 'song_type'],
      'limit': true
    }, true);

    if (song_type) params.song_type = song_type;

    HTTP.get(this.baseUrl + 'song/search?' + params, function(error, result) {
      if (error) return false;
      cb.call(result);
    });
  };

  EchoNest.prototype.similarArtist = function(id, cb) {
    var params = $.param({
      'api_key': this.apiKey,
      'id': id,
      'results': 30,
      'bucket': 'id:rdio-BR',
      'limit': true
    }, true);

    HTTP.get(this.baseUrl + 'artist/similar?' + params, function(error, result) {
      if (error) return false;
      cb.call(result);
    });
  };

  EchoNest.prototype.artistSearch = function(name, cb) {
    var params = $.param({
      'api_key': this.apiKey,
      'name': name,
      'results': 30,
      'bucket': 'id:rdio-BR',
      'limit': true
    }, true);

    HTTP.get(this.baseUrl + 'artist/search?' + params, function(error, result) {
      if (error) return false;
      cb.call(result);
    });
  };

  $(function() {
    guifm.echonest = new EchoNest();
  });

})(jQuery);