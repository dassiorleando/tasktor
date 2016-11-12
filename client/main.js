import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import todosList from '../imports/components/todosList/todosList';
import '../imports/startup/accounts-config.js';

angular.module('simple-todos', [
  angularMeteor,
  ngMaterial,
  todosList.name,
  'accounts.ui'
]);

function onReady() {
  angular.bootstrap(document, ['simple-todos']);
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
