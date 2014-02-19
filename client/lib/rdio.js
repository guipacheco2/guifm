(function($) { 'use strict';

  function Rdio() {
    R.ready($.proxy(this.onReady, this));
  };

  Rdio.prototype.onReady = function() {
    Session.set('rdioReady', true);
    R.player.on('change:playState', this.playStateChanged);
    R.player.on('change:playingTrack', this.playingTrackChanged);
  };

  Rdio.prototype.playStateChanged = function(playState) {
    switch(playState) {
      case 0:
        Session.set('isPlaying', false);
        break;

      case 1:
        Session.set('isPlaying', true);
        break;

      case 2:
        Session.set('isPlaying', false);
        Session.set('playingTrack', false);
        break;
    };
  };

  Rdio.prototype.playingTrackChanged = function(playing) {
    if (playing === null) {
      guifm.rdio.next();
    } else {
      playing = _.pick(playing.attributes, 'key', 'name', 'album', 'artist', 'bigIcon', 'icon400', 'icon');
      Session.set('playingTrack', playing);
      guifm.core.scrollSong(playing.key);
      guifm.core.activeSong(playing.key);
      guifm.core.setBG(playing.bigIcon || playing.icon400 || playing.icon);
    };

    if (guifm.core.countSongs() >= 5 && ! guifm.core.hasNext()) {
      guifm.core.getNext();
    };
  };

  Rdio.prototype.play = function(rdioID) {
    if (rdioID) {
      R.player.play({source: rdioID});
    } else {
      R.player.togglePause();
    };
  };

  Rdio.prototype.pause = function() {
    R.player.pause();
  };

  Rdio.prototype.next = function() {
    var $playing,
        $next;

    $playing = $('.list-group-item.active');
    $next = $playing.next();
    this.play($next.attr('id'));
  };

  Rdio.prototype.previous = function() {
    var $prev = $('.list-group-item.active').prev();
    this.play($prev.attr('id'));
  };

  Rdio.prototype.playfirst = function() {
    var $first = $('.list-group-item').first();
    this.play($first.attr('id'));
  };

  $(function() {
    guifm.rdio = new Rdio();
  });

})(jQuery);