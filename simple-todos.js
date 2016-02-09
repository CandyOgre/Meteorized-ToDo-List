Tasks = new Mongo.Collection('tasks');

if(Meteor.isClient) {
  Meteor.subscribe('tasks');
  
  Template.body.helpers({
    tasks: function() { 
      if(Session.get('hideCompleted')) {
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get('hideCompleted');
    },
    incompleteCount: function() {
      return Tasks.find({checked: {$ne: true}}).count();
    } 
  });

  Template.body.events({
    'submit .new-task': function(event) {
      event.preventDefault();
      var text = event.target.text.value;
      
      Meteor.call('addTask', text);

      event.target.text.value = '';
    },
    'change .hide-completed input': function (event) {
      Session.set('hideCompleted', event.target.checked);
    }
  });

  Template.task.helpers({
    isOwner: function() {
      console.log(this);
      return this.owner === Meteor.userId();
    }
  });

  Template.task.events({
    // handle click event on object with .toggle-checked class
    "click .toggle-checked": function () {
      Meteor.call('setChecked', this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call('deleteTask', this._id);
    },
    "click .toggle-private": function() {
      Meteor.call('setPrivate', this._id, !this.private);
    }
  });

// configure the accounts UI to use usernames instead of email addresses
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

}

Meteor.methods({
  addTask: function(text) {
    if(!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function(taskId) {
    var task = Meteor.findOne(taskId);
    if(task.private && task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  }, 
  setChecked: function(taskId, setChecked) {
    var task = Meteor.findOne('taskId');
    if(task.private && task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, {$set: {checked: setChecked} });
  },
  setPrivate: function(taskId, setToPrivate) {
    var task = Tasks.findOne('taskId');
    if(task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.update(taskId, {$set: {private: setToPrivate} });
  }
});

if(Meteor.isServer) {
  Meteor.publish('tasks', function() {
    return Tasks.find({
      $or: [
        {private: {$ne: true}},
        {owner: this.userId}
      ]
    });
  });
}

// Before deploy we must: meteor remove insecure
// This is the package that allows us to edit the database from the client.
// It's useful when prototyping, but now we are taking off the training wheels

// meteor remove autopublish
// By default Meteor sends all data to client. Need to handle this