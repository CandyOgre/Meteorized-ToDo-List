import { Meteor } from 'meteor/meteor';

import { Tasks } from '/imports/api/tasks.js';

// Here we define basic data for our `tasks` collection
// when it's empty
Meteor.startup(() => {
  if(Tasks.find().count() === 0) {
    Tasks.insert({
      text: 'Take out the trash',
      createdAt: new Date(),
      owner: null,
      username: 'Miki',
      private: false,
      checked: false
    });
    Tasks.insert({
      text: 'Walk with a dog',
      createdAt: new Date(),
      owner: null,
      username: 'Antonio',
      private: false,
      checked: false
    });
    Tasks.insert({
      text: 'Buy some carrot',
      createdAt: new Date(),
      owner: null,
      username: 'Antonio',
      private: false,
      checked: false
    });
  }
});