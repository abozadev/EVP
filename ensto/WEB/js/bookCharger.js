app.controller('BookChargerCtrl', function($scope, $location, $rootScope, $route, $routeParams, Service, $http, $timeout) {

  $scope.MODAL_BOOK_URL = 'views/bookCharger_modal.html';

  $scope.CHARGER_POSITION = {
    lat : 60.184452, 
    lng : 24.831673
  }

  $scope.auth = false;

  $scope.user = {
    name: '',
    pass: ''
  }

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

  $scope.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: $scope.CHARGER_POSITION,
      zoom: 15
    });
    var image = '../img/charger.png'
    var marker = new google.maps.Marker({
      position: $scope.CHARGER_POSITION,
      map: map,
      title: 'EV',
      icon: image
    });
  }

  $scope.init = function(){
    $scope.credentials = localStorage.getItem('keys');
    if ($scope.credentials != null){
      $scope.auth = true;
      $scope.setAuthorizationHeader();
      if ($routeParams.id){
        // Details
        $scope.loadChargingPoint();
        $timeout(function() {$scope.initMap();}, 4000);        
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
