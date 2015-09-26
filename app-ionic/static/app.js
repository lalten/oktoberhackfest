var FBURL="https://vivid-inferno-1896.firebaseio.com/"

angular.module('ionic.example', ['ionic', 'firebase'])

    .controller('MapCtrl', function($scope, $ionicLoading, $compile, MapItems) {
      function initialize() {
        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });



        $scope.map = map;

		$scope.addMarker();
      }
      google.maps.event.addDomListener(window, 'load', initialize);

		$scope.addMarker = function() {
        	var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
			var marker = new google.maps.Marker({
			  position: myLatlng,
			  map: $scope.map,
			  title: 'Uluru (Ayers Rock)'
			});

			google.maps.event.addListener(marker, 'click', function() {
			  infowindow.open($scope.map,marker);
			});


		}
      
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
      
    })

.factory("MapItems", function($firebaseArray) {
  var itemsRef = new Firebase(FBURL+"/MapItems");
  return $firebaseArray(itemsRef);
})
