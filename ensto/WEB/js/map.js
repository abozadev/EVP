app.controller('MapCtrl', function($scope, $location, $rootScope, Service, $timeout) {

  var position;

  Service.getCharging().then(function(success){
    $scope.carCharging = success.data;
  })

  Service.getLocation().then(function(success){
    $scope.carLoaction = success.data;
    position = {lat: $scope.carLoaction.coordinates.latitude, lng: $scope.carLoaction.coordinates.longitude}
    $timeout(function() {initMap()}, 4000);
    //calcRoute();
  })

  $scope.init = function(){

  }
  $scope.init();


  var map;
  var directionsService;
  var directionsDisplay;
  function initMap() {

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
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
    calcRoute();
    searchChargers();
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

function searchChargers()
{
  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  google.maps.PlacesService();
  service.nearbySearch({
    location: { lat: $scope.carLoaction.coordinates.latitude, lng: $scope.carLoaction.coordinates.longitude},
    radius: $scope.carCharging.estimatedRange,
    type: ['ev charger']
  }, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

});
