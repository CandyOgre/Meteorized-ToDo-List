import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if(instance.state.get('hideCompleted') && instance.state.get('ownerFirst')) {
      alert('Use only one option, please');
      } else if(instance.state.get('hideCompleted')) {
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else if(instance.state.get('ownerFirst')) {

        return ReactiveMethod.call('getSortedTasks');

    } else {
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  },
  hideCompleted() {
    return Template.instance().state.get('hideCompleted');
  },
  ownerFirst() {
    return Template.instance().state.get('ownerFirst');
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-task'(e) {
    e.preventDefault();

    const text = e.target.text.value;
    Meteor.call('tasks.insert', text);

    e.target.text.value = "";
  },
  'change .hide-completed input'(e, instance) {
    instance.state.set('hideCompleted', e.target.checked);
  },
  'change .owner-first'(e, instance) {
    instance.state.set('ownerFirst', e.target.checked);
  },
});