app.factory('Service', function ($http) {
    var url = 'http://localhost:8888';
    return {
        getChargingPoints: function(){
            return $http.get(url + '/chargingPoints')
        }
    }
});
