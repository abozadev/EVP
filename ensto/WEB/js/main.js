app.controller('MainCtrl', function($scope, $location) {
  $scope.aa = {};
  $scope.getActive = function () {
      $scope.active = "";
      if ($location.path() === "/"){
          $scope.active = "HOME";
      } else if ($location.path().indexOf("bookCharger") !== -1){
          $scope.active = "BOOKCHARGER";
      } else if ($location.path().indexOf("diagnostics") !== -1){
          $scope.active = "DIAGNOSTICS";
      }
      return $scope.active;
  };

  $scope.goTo = function(path) {
      $location.path(path);
  }

});
