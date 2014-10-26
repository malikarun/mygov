angular.module('mygov.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Groups', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var groups = [
    { id: 0, name: 'Clean Ganga' },
    { id: 1, name: 'Digital India' },
    { id: 2, name: 'Girl Child Education' },
    { id: 3, name: 'Green India' },
    { id: 4, name: 'Incredible India' },
    { id: 5, name: 'Job Creation' },
    { id: 6, name: 'Skill Development' },
    { id: 7, name: 'Clean India' },
    { id: 8, name: 'Watershed Management' }
  ];

  return {
    all: function() {
      return groups;
    },
    get: function(groupId) {
      // Simple index lookup
      return groups[groupId];
    }
  }
})