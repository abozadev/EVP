app.controller('MapCtrl', function($scope, $location, $rootScope, Service) {

  var position;

  Service.getCharging().then(function(success){
    $scope.carCharging = success.data;
  })

  Service.getLocation().then(function(success){
    $scope.carLoaction = success.data;
    position = {lat: $scope.carLoaction.coordinates.latitude, lng: $scope.carLoaction.coordinates.longitude}
    initMap();
    calcRoute();
  })

  $scope.init = function(){

  }
  $scope.init();


  var map;
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  
  function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
      center: position,
      zoom: 5
    });
    var image = '../img/car_icon.png'
    //var image = '../img/charger.png'
    var marker = new google.maps.Marker({
          position: position,
          map: map,
          title: 'EV',
          icon: image
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directionsPanel'));
  }

  function calcRoute() {
  //var start = document.getElementById('start').value;
  var end = {lat: 60.187604, lng: 24.824835};
  var request = {
    origin: position,
    destination: end,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });
}

});
