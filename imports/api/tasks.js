import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Model of Tasks collection for CRUD operations
export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  // Get published tasks
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [{
        private: {
          $ne: true
        }
      }, {
        owner: this.userId
      }, ],
    });
  });
}

Meteor.methods({
  // Insert a Task
  'tasks.insert' (text) {
    check(text, String);  // Be sure we have a valid type of Task's description

    // Make sure the user is logged in before inserting a task, elsewhere throw an not-authorized meteor Error
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),    // The created date is the current date
      owner: Meteor.userId(),   // The owner of the Task is the current connected user
      username: Meteor.user().username,
    });
  },
  // Remove a Task by his Id
  'tasks.remove' (taskId) {
    check(taskId, String);    // Be sure to have a valid String Task's Id
    const task = Tasks.findOne(taskId);   // Find Tas, corresponding to this Id
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    // Now we remove the Task
    Tasks.remove(taskId);
  },
  // Set a Task as finish by updating the his checked attribute
  'tasks.setChecked' (taskId, setChecked) {
    // Be sure to have valid String Id and Boolean setChecked variables
    check(taskId, String);
    check(setChecked, Boolean);
    // Get the Task corresponding to the providing taskId
    const task = Tasks.findOne(taskId);
     if (task.private && task.owner !== Meteor.userId()) {
       // If the task is private, make sure only the owner can check it off
       throw new Meteor.Error('not-authorized');
     }

    // Now we set the Task as checked
    Tasks.update(taskId, {
      $set: {
        checked: setChecked
      }
    });
  },

  // Make a Task private
  'tasks.setPrivate' (taskId, setToPrivate) {
    // Check types of parameters(taskId & setToPrivate must respectively be String and Boolean)
    check(taskId, String);
    check(setToPrivate, Boolean);

    // Get the task corresponding to taskId
    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    // Now we update the Task to make it private
    Tasks.update(taskId, {
      $set: {
        private: setToPrivate
      }
    });
  },
});
