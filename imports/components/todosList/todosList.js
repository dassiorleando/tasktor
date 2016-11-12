import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import template from './todosList.html';
import { Tasks } from '../../api/tasks.js';

class TodosListCtrl {
  constructor($scope, $mdToast) {
    $scope.viewModel(this);
    this.subscribe('tasks');

    this.hideCompleted = false;

    this.helpers({
      tasks() {
        const selector = {};

        // If hide completed is checked, filter tasks
        if (this.getReactively('hideCompleted')) {
          selector.checked = {
            $ne: true
          };
        }

        return Tasks.find(selector, {
          sort: {
            createdAt: -1
          }
        });
      },
      incompleteCount() {
        return Tasks.find({
          checked: {
            $ne: true
          }
        }).count();
    },
    currentUser(){
      return Meteor.user();
    }
  })
}
  addTask(newTask) {
    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    if(!newTask){
      $mdToast.show(
      $mdToast.simple()
        .textContent('Simple Toast!')
        .position(last)
        .hideDelay(3000)
      );
    }
    // Insert a task into the collection
    Meteor.call('tasks.insert', newTask);
    // Clear form
    this.newTask = '';
  }

  setChecked(task) {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  }

  removeTask(task) {
     Meteor.call('tasks.remove', task._id);
  }

  setPrivate(task) {
    Meteor.call('tasks.setPrivate', task._id, !task.private);
  }
}

export default angular.module('todosList', [
  angularMeteor,
  ngMaterial
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', '$mdToast', TodosListCtrl]
  });
