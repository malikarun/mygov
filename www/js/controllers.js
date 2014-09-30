angular.module('starter.controllers', [])

.controller('ActivitiesCtrl', function($scope) {
})

.controller('GroupsCtrl', function($scope, Groups) {
  $scope.groups = Groups.all();
})

.controller('GroupDetailCtrl', function($scope, $stateParams, Groups) {
  $scope.group = Groups.get($stateParams.groupId);
})

.controller('DiscussCtrl', function($scope, Groups) {
  $scope.groups = Groups.all();
})

.controller('TasksCtrl', function($scope, Groups) {
  $scope.groups = Groups.all();
})

.controller('SettingsCtrl', function($scope) {
});
