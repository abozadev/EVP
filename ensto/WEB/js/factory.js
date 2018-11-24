app.factory('Service', function ($http) {
    var url = 'http://localhost:8888';
    var eq = 'http://localhost:3000'
    return {
        getChargingPoints: function(){
            return $http.get(url + '/chargingPoints')
        },
        getDiagnostics: function(){
            console.log(eq);
            return $http.get(eq + '/getDiagnostics')
        }
    }
});
