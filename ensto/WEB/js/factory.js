app.factory('Service', function ($http) {
    var url = 'http://localhost:8888';
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
        }
    }
});
