import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';

import './body.html';

Template.body.helpers({
  tasks() {
    return Tasks.find({}, {sort: {createdAt: -1} });
  },
});

Template.body.events({
  'submit .new-task'(e) {
    e.preventDefault();

    Tasks.insert({
      text: e.target.text.value,
      createdAt: new Date(),
    });

    e.target.text.value = "";
  },
});