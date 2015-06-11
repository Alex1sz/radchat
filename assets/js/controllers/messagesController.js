angular.module('app')
  .controller('MessagesController', function($scope, MessageService) {
    MessageService.getAll().then(function(result) {
      $scope.messages = result.data;
    });

    $scope.createMessage = function() {
      if ($scope.newMessageForm.$valid) {
        Messages.create($scope.newMessage).then(function(result) {
          $scope.messages = result.data.messages;
          $scope.newMessage = '';
        });
      }
    };
    // scope function to show specified message
    $score.showMessage = function() {
      MessageService[$scope.type]($scope.message, $scope.title);
    };

    $scope.deleteMessage = function(message) {
      Messages.remove(message).success(function() {
        var messageIndex = $scope.messages.indexOf(message);
        $scope.messages.splice(messageIndex, 1);
      });
    }
  });