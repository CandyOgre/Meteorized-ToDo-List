Template.body.onCreated(function(){
  this.subscribe('tasks');
});

Template.body.helpers({
  tasks: function() {
    if(Session.get('hideCompleted') && Session.get('ownerFirst')) {
      alert('Use only one option, please');
      } else if(Session.get('hideCompleted')) {
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else if(Session.get('ownerFirst')) {

        return ReactiveMethod.call('getSortedTasks');
        
    } else {
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  },
  hideCompleted: function () {
    return Session.get('hideCompleted');
  },
  ownerFirst: function() {
    return Session.get('ownerFirst');
  },
  incompleteCount: function() {
    return Tasks.find({checked: {$ne: true}}).count();
  } 

});

Template.body.events({
  'submit .new-task': function(e) {
    e.preventDefault();
    
    var text = e.target.text.value;
    Meteor.call('addTask', text);
    e.target.text.value = '';
  },
  // 'change .hide-completed' works equal. Any differences ?
  'change .hide-completed input': function (e) {
    Session.set('hideCompleted', e.target.checked);
  },
  'change .owner-first': function(e) {
    Session.set('ownerFirst', e.target.checked);
  },
});