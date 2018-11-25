app.controller('MapCtrl', function($scope, $location, $rootScope, Service, $timeout) {

  var eq =  'http://localhost:3000'

  var radius;
  var position;

Service.getLocation().then(function(success){
    $scope.carLoaction = success.data;
    Service.getCharging().then(function(res){
            $scope.carCharging = res.data;
            radius = $scope.carCharging.estimatedRange * 1000;
            position = {lat: $scope.carLoaction.coordinates.latitude, lng: $scope.carLoaction.coordinates.longitude}
            $timeout(function() {initMap()}, 4000);
    });
})


  $scope.init = function(){

  }
  $scope.init();

  var map;
  var directionsService;
  var directionsDisplay;
  var infowindow;
  var waypts = [];
  var circle;
  var boxpolys = null;
	var directions = null;
	var infowindow;
	var service;
	var markersArray = []; //marker array
  var end;
  var searchBox;
  function initMap() {

    map = new google.maps.Map(document.getElementById('map_route'), {
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

    circle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                center: position,
                radius: radius
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var btt = document.getElementById('search-route');
    btt.addEventListener("click", search());
    //directionsDisplay.setMap(map);
    //directionsDisplay.setPanel(document.getElementById('directionsPanel'));

    infowindow = new google.maps.InfoWindow();

    service = new google.maps.places.PlacesService(map);
    	        directionService = new google.maps.DirectionsService();
    	        directionsRenderer = new google.maps.DirectionsRenderer({
    	            map: map
                });
    //searchChargers();
    //route(position);
  }

  function search(){
    var markers = [];
       // Listen for the event fired when the user selects a prediction and retrieve
       // more details for that place.
       searchBox.addListener('places_changed', function() {
         var places = searchBox.getPlaces();

         if (places.length == 0) {
           return;
         }

         // Clear out the old markers.
         markers.forEach(function(marker) {
           marker.setMap(null);
         });
         markers = [];

         // For each place, get the icon, name and location.
         var bounds = new google.maps.LatLngBounds();
         places.forEach(function(place) {
           if (!place.geometry) {
             console.log("Returned place contains no geometry");
             return;
           }
           // Create a marker for each place.
           var marker = new google.maps.Marker({
             map: map,
             title: place.name,
             position: place.geometry.location
           });
           markers.push(marker);

           google.maps.event.addListener(marker, 'click', function () {
               infowindow.setContent(place.name);
               infowindow.open(map, marker);
               end = { lat: marker.getPosition().lat(), lng: marker.getPosition().lng()}
               waypts = [];
               route(position);
           });

           if (place.geometry.viewport) {
             // Only geocodes have viewport.
             bounds.union(place.geometry.viewport);
           } else {
             bounds.extend(place.geometry.location);
           }
         });
       });


  }

  function calcRoute(waypts) {
  //var start = document.getElementById('start').value;
  if (waypts.length > 0){
    var request = {
      origin: position,
      destination: end,
      travelMode: 'DRIVING',
      waypoints: waypts,
    };
  }
  else {
    var request = {
      origin: position,
      destination: end,
      travelMode: 'DRIVING'
    };
  }
  directionService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
        //$scope.route = result;
      }
  });

}

function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function distToSegment2(p, v, w) {
  return dist2(getClosestPoint(p,v,w));
}
function getClosestPoint( p, v, w ) {
  var l2 = dist2(v, w);
  if (l2 === 0) return v;	// line is actually a point; just return one ofthe two points
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  // point is closest to v, return v
  if (t < 0) return v;
  // point is closest to w, return w
  if (t > 1) return w;
  // point is closets to some midpoint, return that
  return { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }


// the following two functions are coppied/adapted from an answer to this SO question:
// http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}
// geographic distance courtesy the haversine formula
function geoDistanceKm(p1,p2) {
  var R = 6371; // km
  var x1 = p2.lat()-p1.lat();
  var dLat = x1.toRad();
  var x2 = p2.lng()-p1.lng();
  var dLon = x2.toRad();
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(p1.lat().toRad()) * Math.cos(p2.lat().toRad()) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
  var counter = 0;

  function route(start) {
      // Clear any previous route boxes from the map

      console.log('routing');
      if (geoDistanceKm_2(start,end) >= (radius/1000) - 100){
      console.log('routing');

      clearBoxes();

      // Clear any previous markers from the map
      deleteOverlays();

      var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
      }

      var way = {
        location: {lat: 0.0, lng: 0.0},
        stopover: true
      };
      // Make the directions request
      directionService.route(request, function (result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
          } else {
              alert("Directions query failed: " + status);
          }
          var f = false;
          for (var x = 0; x < result.routes[0].overview_path.length && !f; x++)
          {
            var posX = {lat: result.routes[0].overview_path[x].lat(), lng: result.routes[0].overview_path[x].lng()};
            if (geoDistanceKm_2(start,posX) >= ((radius/1000) - 50))
            {
              circle = new google.maps.Circle({
                          strokeColor: '#FF0000',
                          strokeOpacity: 0.8,
                          strokeWeight: 2,
                          fillColor: '#FF0000',
                          fillOpacity: 0.35,
                          center: posX,
                          //map: map,
                          radius: 70000
              });
              f = true;
            }
          }
          bounds = circle.getBounds();
          // Perform search over this bounds
          var request = {
              bounds: bounds,
              query: "ev charger",
              radius: radius
          };

          service.textSearch(request, function(results,status){
          if (status === google.maps.places.PlacesServiceStatus.OK) {
              // add a "closestPointOnPath" and a "coordinateDistance2" value for sorting;
              // if all we care about is sorting, then we could do without closestPointOnPath
              for( var i=0; i<results.length; i++ ) {
                closestPointOnPath_Cartesian( results[i], result.routes[0].overview_path, function( closestPoint, coordDist2 ){
                  results[i].closestPointOnPath = closestPoint;
                  results[i].coordDist2 = coordDist2;
                  results[i].geoDistKm = geoDistanceKm( results[i].geometry.location, closestPoint );
                });
              }
              // sort results by relative distance (coordDist2)
              results.sort( function(a,b) { return a.coordDist2 - b.coordDist2; } );
              // display the results
              //waypts.push({ position: results[0].              })
              console.log(results[0].geometry.location);
              var found = false;

              for (var i = 0; i < results.length && results[i].geoDistKm < 25 && !found; i++)
              {
                var pos_aux = {lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()}
                if (geoDistanceKm_2(start, pos_aux) >= (((radius/1000)/2) - 50)) {
                  found = true;
                }
                way.location = pos_aux;
                //renderMarker(results[i]);
                //renderResult(results[i],result.routes[0].overview_path);
              } //renderResult(results[i],result.routes[0].overview_path);
              waypts.push(way);
              counter = counter + 1;
          }
            route(way.location);
          });
      });

    } else {
      calcRoute(waypts);
    }
  }

  // determines the closest point to a given place on a given path
  // note that this determines the closest point on a cartesian plane,
  // so it is only accurate for local distances; as geographic distance
  // increases, this method will be less accurate
  function closestPointOnPath_Cartesian( place, path, cb ) {
    var min = Number.MAX_VALUE;
    var closestPoint = null;
    for( var i=0; i<path.length-1; i++ ) {
      var v = { x: path[i].lng(), y: path[i].lat() };
      var w = { x: path[i+1].lng(), y: path[i+1].lat() };
      var p1 = { x: place.geometry.location.lng(), y: place.geometry.location.lat() };
      var p2 = getClosestPoint( p1, v, w );
      var d2 = dist2( p1, p2 );
      if( d2 < min ) {
        min = d2;
        closestPoint = new google.maps.LatLng( p2.y, p2.x );
      }
    }
    cb( closestPoint, min );
  }

  function renderMarker(place) {
      var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
      });
    }

  function renderResult(place,routePath) {
      var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
      });

      markersArray.push(marker);

      // TODO: remove this from production code; only for visualization
      // draw a line fromt he midpoint of the closest point on the route to the result
      //var distLine = new google.maps.Polyline({
      //  path: [place.closestPointOnPath, place.geometry.location],
      //  strokeColor: '#ff0000',
      //  strokeOpacity: 1.0,
      //  strokeWeight: 2
     //});
     //distLine.setMap( map );

      //get place details and add to infowindow
      var request = {
          reference: place.reference
      };

      google.maps.event.addListener(marker, 'click', function () {
          infowindow.setContent(place.name);
          infowindow.open(map, marker);
      });

      //create list of places found
      //document.getElementById('places').innerHTML += "<li><a href='javascript:google.maps.event.trigger(markersArray[" + parseInt(markersArray.length - 1) + "],\"click\");'>" + place.name + " (" + place.geoDistKm.toFixed(1) + " km)</a></li>";
  }

  // Removes the overlays from the map, but keeps them in the array
  function clearOverlays() {
      if (markersArray) {
          for (i in markersArray) {
              markersArray[i].setMap(null);
          }
      }
  }


  // Deletes all markers in the array by removing references to them
  function deleteOverlays() {
      if (markersArray) {
          for (i in markersArray) {
              markersArray[i].setMap(null);
          }
          markersArray.length = 0;
      }
  }

  // Draw the array of boxes as polylines on the map
  function drawBoxes(boxes) {
      boxpolys = new google.maps.Rectangle({
          bounds: boxes,
          fillOpacity: 0,
          strokeOpacity: 1.0,
          strokeColor: '#000000',
          strokeWeight: 1,
          map: map
      });
  }

  // Clear boxes currently on the map
  function clearBoxes() {
      if (boxpolys != null) {
          for (var i = 0; i < boxpolys.length; i++) {
              boxpolys[i].setMap(null);
          }
      }
      boxpolys = null;
  }

    function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

    function closestPointOnPath_Cartesian( place, path, cb ) {
        var min = Number.MAX_VALUE;
        var closestPoint = null;
        for( var i=0; i<path.length-1; i++ ) {
            var v = { x: path[i].lng(), y: path[i].lat() };
            var w = { x: path[i+1].lng(), y: path[i+1].lat() };
            var p1 = { x: place.geometry.location.lng(),
                        y: place.geometry.location.lat() };
            var p2 = getClosestPoint( p1, v, w );
            var d2 = dist2( p1, p2 );
            if( d2 < min ) {
                min = d2;
                closestPoint = new google.maps.LatLng( p2.y, p2.x );
            }
        }
        cb( closestPoint, min );
    }


    // geographic distance courtesy the haversine formula
    function geoDistanceKm(p1,p2) {
        var R = 6371; // km
        var x1 = p2.lat()-p1.lat();
        var dLat = x1.toRad();
        var x2 = p2.lng()-p1.lng();
        var dLon = x2.toRad();
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(p1.lat().toRad()) * Math.cos(p2.lat().toRad()) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    function geoDistanceKm_2(p1,p2) {
        var R = 6371; // km
        var x1 = p2.lat-p1.lat;
        var dLat = x1.toRad();
        var x2 = p2.lng-p1.lng;
        var dLon = x2.toRad();
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(p1.lat.toRad()) * Math.cos(p2.lat.toRad()) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

});
