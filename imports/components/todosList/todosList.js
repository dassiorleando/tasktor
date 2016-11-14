import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import template from './todosList.html';
import { Tasks } from '../../api/tasks.js';

class TodosListCtrl {
  constructor($scope, $mdToast) {
    $scope.viewModel(this);
    this.subscribe('tasks');

    // Initially we don't hide completed tasks
    this.hideCompleted = false;

    this.helpers({
      tasks() {
        const selector = {};

        // If hide completed is checked, filter tasks
        // Get hideCompleted var reactively
        // So when it is updating we will update the list according to it
        if (this.getReactively('hideCompleted')) {
          selector.checked = {
            $ne: true
          };
        }
        // Find task with filtering by hideCompleted and sorting by created date
        return Tasks.find(selector, {
          sort: {
            createdAt: -1
          }
        });
      },
      // Count incompleted tasks
      incompleteCount() {
        return Tasks.find({
          checked: {
            $ne: true
          }
        }).count();
    },
    // Get the current user
    currentUser(){
      return Meteor.user();
    }
  })
}
  // Add a new Task
  addTask(newTask) {
    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    // If the task is not valid we make a Toast on the right top corner
    if(!newTask){
      $mdToast.show(
      $mdToast.simple()
        .textContent('Please, Task is not correctly filled!')
        .position(last)
        .hideDelay(3000)
      );
    }
    // Insert a task into the collection
    Meteor.call('tasks.insert', newTask);
    // Clear form input of task
    this.newTask = '';
  }

  setChecked(task) {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  }

  removeTask(task) {
    // Remove a task
     Meteor.call('tasks.remove', task._id);
  }

  setPrivate(task) {
    // Set a Task as private to the currentUser who is the owner of it
    Meteor.call('tasks.setPrivate', task._id, !task.private);
  }
}

// We create a component to put all of these in the ui with a simple Tag: <todos-list></todos-list>
export default angular.module('todosList', [
  angularMeteor,
  ngMaterial
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', '$mdToast', TodosListCtrl]
  });
