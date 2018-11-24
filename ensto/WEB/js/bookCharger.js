app.controller('BookChargerCtrl', function($scope, $location, $rootScope, $route, $routeParams, Service, $http) {

  $scope.loadChargingPoints = function(){
    Service.getChargingPoints().then(function(success){
      $scope.chargingPoints = success.data;
    });
  }

  $scope.loadChargingPoint = function(){
    Service.getChargingPoint($routeParams.id).then(function(success){
      $scope.chargingPoint = success.data;
    });
  }

  $scope.auth = false;

  $scope.user = {
    name: "",
    pass: ""
  }

  $scope.setAuthorizationHeader = function(){
    $http.defaults.headers.common.Authorization = 'Basic ' + localStorage.getItem('keys');
  }

  $scope.login = function(){
    localStorage.setItem('keys', btoa($scope.user.name + ':' + $scope.user.pass));
    $route.reload();
  }

  $scope.logout = function(){
    localStorage.removeItem('keys');
    $route.reload();
  }

  $scope.goToDetail = function(id){
    $location.path('/bookCharger/' + id);
  }

  $scope.goToList = function(){
    $location.path('/bookCharger');
  }

  $scope.init = function(){
    $scope.credentials = localStorage.getItem('keys');
    if ($scope.credentials != null){
      $scope.auth = true;
      $scope.setAuthorizationHeader();
      if ($routeParams.id){
        // Details
        $scope.loadChargingPoint();
      } else {
        // List        
        $scope.loadChargingPoints();
      }      
    } else if ($routeParams.id){
      $location.path('/bookCharger');
    }
  }
  $scope.init();
});
