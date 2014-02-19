Template.guifm.events({
  'click .close': function() {
    Session.set('zeroResults', false);
  }
});

Template.guifm.showResults = function () {
  return Session.get('showResults');
};

Template.guifm.zeroResults = function() {
  return Session.get('zeroResults');
};

Template.guifm.rdioReady = function() {
  return Session.get('rdioReady');
};