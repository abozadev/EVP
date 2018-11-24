app.controller('BookChargerCtrl', function($scope, $location, $rootScope, Service) {

  Service.getChargingPoints().then(function(success){
    $scope.chargingPointsGroup = success.data;
  })

  $scope.init = function(){
    
  }
  $scope.init();
});
