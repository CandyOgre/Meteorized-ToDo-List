Tasks = new Mongo.Collection('tasks');

Meteor.methods({
  addTask: function(text) {
    if(!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      private: false,
      checked: false
    });
  },

  deleteTask: function(taskId) {
    var task = Tasks.findOne(taskId);
    
    if(task.private && task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  },

  setChecked: function(taskId, setChecked) {
    var task = Tasks.findOne(taskId);

    if(task.private && task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, {$set: {checked: setChecked} });
  },

  setPrivate: function(taskId, setToPrivate) {
    var task = Tasks.findOne(taskId);

    if(task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, {$set: {private: setToPrivate} });
  },
  getSortedTasks: function() {
    var pipeline = [
    // project a field showing if current user is owner
    {$project: 
      {text:1, createdAt:1, owner:1, username:1, private:1, checked:1, current: 
        {$eq: ["$username", Meteor.userId()]}
      }
    },
    // Sort stage: Brings documents on top with current = true
    {$sort: 
      {current:-1}
    },
    // Remove field name 'current' induced in first stage
    {$project:
      {text:1, createdAt:1, owner:1, username:1, private:1, checked:1}
    } 
    ];
    return Tasks.aggregate(pipeline, {explain: true});
  },
});