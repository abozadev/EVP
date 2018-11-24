app.factory('Service', function ($http) {
    var url = 'http://localhost:8888';
    var eq = 'http://localhost:3000'
    return {
        getChargingPoints: function(){
            return $http.get(url + '/chargingPoints')
        },
        getCharging: function(){
            return $http.get(eq + '/getCharging')
        },
        getLocation: function(){
            return $http.get(eq + '/getLocation')
        }
    }
});
