app.config(['$routeProvider', 'ChartJsProvider', function ($routeProvider, ChartJsProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    }).when('/bookCharger', {
        templateUrl: 'views/bookCharger.html',
        controller: 'BookChargerCtrl'
    });
}]);
