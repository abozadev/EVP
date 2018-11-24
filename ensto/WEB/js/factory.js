app.factory('Service', function ($http) {
    var url = 'http://localhost:8888';
    var eq =  'http://localhost:3000'
    function getHeader(){
        var headers = {
            'Authorization' : 'Basic ' + localStorage.getItem('keys')
        }
    }
    return {
        getChargingPoints: function(){
            return $http.get(url + '/chargingPoint', {headers : getHeader()})
        },
        getChargingPoint: function(id){
            return $http.get(url + '/chargingPoint/' + id, {headers : getHeader()})
        },
        getCharging: function(){
            return $http.get(eq + '/getCharging')
        },
        getLocation: function(){
            return $http.get(eq + '/getLocation')
        }
    }
});
