app.controller('BookChargerCtrl', function($scope, $location, $rootScope, $route, $routeParams, Service, $http, $timeout) {

  $scope.MODAL_BOOK_URL = 'views/bookCharger_modal.html';

  $scope.selectedPlaces = [];
  $scope.markersList = [];
  $scope.bookCharge = {};

  $scope.CHARGER_POSITION = {
    lat : 60.184452, 
    lng : 24.831673
  }

  $scope.auth = false;

  $scope.user = {
    name: '',
    pass: ''
  }

  Service.loadPlacesJSON().then(function(success){
    $scope.listPlaces = success.data;
  })

  $scope.loadTags = function(query){
    var ret = [];
    if (query != null && query.length > 0){
      $scope.listPlaces.forEach(function(place){
        if (place.value.toUpperCase().search(query.toUpperCase()) != -1){
          ret.push(place.value);
        }
      });
    }
    return ret;
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

  $scope.getPlacesType = function(){
    var ret = [];
    $scope.selectedPlaces.forEach(function(selectedPlace){
      $scope.listPlaces.forEach(function(place){
        if (place.value === selectedPlace.text){
          ret.push(place.type);
        }
      })
    })
    return ret;
  }

  $scope.searchPOIs = function(){
    $scope.clearMarkers();
    var placesList = $scope.getPlacesType();
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    if (placesList.length > 0){
      service.nearbySearch({
        location: $scope.CHARGER_POSITION,
        radius: 500,
        type: placesList
      }, $scope.callback);
    }
  }

  $scope.callback = function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        $scope.createMarker(results[i]);
      }
    }
  }

  $scope.createMarker = function(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });
    $scope.markersList.push(marker)

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }

  $scope.clearMarkers = function(){
    $scope.markersList.forEach(function(markers){
      markers.setMap(null);
    })
    $scope.markersList = null;
    $scope.markersList = [];
  }

  $scope.bookCharger = function(connection){
    Service.bookedHours().then(function(success){
      $scope.bookedHours = success.data;
      $('#bookCharge_modal').modal();
    })
  }

  $scope.checkDate = function(date, type){
    var ret = true;
    if ($scope.bookedHours && type === "hour"){
      var month = date.month() + 1;
      month = month < 10 ? '0' + month : month;
      var mask = date.date() + '/' + month + '/' + date.year();

      $scope.bookedHours.forEach(function(bookedHours){
        if (bookedHours.day === mask){
          bookedHours.bookedHours.forEach(function(hour){
            if (date.hour() +"" === hour.hour &&  hour.chargingPoint == $scope.chargingPoint.id){
              ret = false;
            }
          })
        }
      }) 
    }
    return ret;
  }

  $scope.book = function(){
    var date = $scope.bookCharge.dateModel;
    var month = date.month() + 1;
    month = month < 10 ? '0' + month : month;
    var mask = date.date() + '/' + month + '/' + date.year();
    var obj = {
      date: mask,
      hour: date.hour(),
      rfid: $scope.bookCharge.rfid,
      id: 771,
      chargingPoint: $scope.chargingPoint.id
    }
    Service.setBookedHours(obj).then(function(success){
      Service.addChargingPoint(771, {identifier: $routeParams.id}).then(function(success){

      })      
    })
    $('#bookCharge_modal').modal();
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
