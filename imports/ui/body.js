import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },

  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-task'(e) {
    e.preventDefault();

    Tasks.insert({
      text: e.target.text.value,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });

    e.target.text.value = "";
  },
  'change .hide-completed input'(e, instance) {
    instance.state.set('hideCompleted', e.target.checked);
  },
});