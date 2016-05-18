var app = angular.module('directoryApp',['ngRoute','directoryApp.controllers','directoryApp.factories']);
app.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl : '/static/partials/users.html',
      controller  : 'users'
    })
    .when('/add-user', {
      templateUrl : '/static/partials/add-user.html',
      controller  : 'users'
    })
    .when('/view-user/:id', {
      templateUrl : '/static/partials/view-user.html',
      controller  : 'view-user'
    })
    .when('/edit-user/:id', {
      templateUrl : '/static/partials/edit-user.html',
      controller  : 'view-user'
    });
});

