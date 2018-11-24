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
        },
        loadPlacesJSON: function(){
            return $http.get('/misc/places.json')
        },
        bookedHours: function(){
            return $http.get(url + '/bookedHours')
        },
        getParentPermissions: function(id){
            return $http.get(url + '/getParentPermissions/'+id)
        },
        setBookedHours: function(obj){
            return $http.post(url + '/bookedHours', obj)
        },
        addChargingPoint: function(obj, id){
            return $http.post(url + '/chargingPoint/'+id, obj)
        }
    }
});
