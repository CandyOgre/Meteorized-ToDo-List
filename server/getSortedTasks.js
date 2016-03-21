Meteor.methods({
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
    console.log(Tasks.aggregate(pipeline, {explain: true}));
    return Tasks.aggregate(pipeline, {explain: true});
  },
});