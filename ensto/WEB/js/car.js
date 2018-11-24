app.controller('CarCtrl', function($scope, $location, $rootScope, Service) {

  Service.getDiagnostics().then(function(success){
    $scope.carDiagnostics = success.data;
  })

  $scope.init = function(){

  }
  $scope.init();
});
