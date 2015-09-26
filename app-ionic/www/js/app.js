var FBURL = "https://vivid-inferno-1896.firebaseio.com/"

angular.module('app-ionic', ['ionic', 'firebase', 'ngCordova'])

.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/')
  	$stateProvider.state('home', {
		url: '/',
		templateUrl: 'home.html'
	})
	.state('spot', {
		url: '/spot',
		templateUrl: 'spot.html'
	})
})

.controller('HomeCtrl', function($scope, $ionicLoading, $compile, MapItems, $state) {
    function initialize() {
        var myLatlng = new google.maps.LatLng(43.07493, -89.381388);

        var mapOptions = {
            center: myLatlng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);


        $scope.map = map;

        $scope.loadSpots();
    }
    google.maps.event.addDomListener(window, 'load', initialize);

    $scope.loadSpots = function() {
        //uncomment  to add test marker
        /*
		MapItems.$add({
			'icon': '',
			'name': 'TestSpot',
			'shortdesc': 'This is a test spot',
			'location': {
				'lat': 123,
				'lng': 123
			}
	  	});
		*/


        MapItems.$loaded().then(function() {
            console.log('laoded');
            angular.forEach(MapItems, function(item) {
                console.log('item', item);
                $scope.addMarker(item);
            });
        });
    }

	$scope.infoWindow = new google.maps.InfoWindow();

    $scope.addMarker = function(spot) {
        //Info window's content
        var contentString = "<div><div><img class='shop-icon' src='" + spot.icon + "' alt='" + spot.name + "'/><span class='item-text-wrap'>" + spot.name + "</span></div><div class='shop-offer'>" + spot.shortdesc + "</div><div class='card'><img class='card-art' src='" + spot.icon + "' alt='" + spot.name + "'/><a href='#/spot'>more Info</a></div></div>";
        var compiled = $compile(contentString)($scope);

        //Get location
        var locationLatLng = new google.maps.LatLng(spot.location.lat, spot.location.lng);

        //Create marker
        var marker = new google.maps.Marker({
            position: locationLatLng,
            map: $scope.map,
            title: spot.name
        });

        google.maps.event.addListener(marker, 'click', function() {
			//go to details page
			$state.go('spot',{id: 123});

			//dont show any info window anymore
            //$scope.infoWindow.setContent(compiled[0]);
            //$scope.infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);
    }

    $scope.markers = [];

    $scope.centerOnMe = function() {
        if (!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
			new google.maps.Marker({
				position: {lat: pos.coords.latitude, lng: pos.coords.longitude},
				map: $scope.map,
			  });

            $ionicLoading.hide();
        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
    };

    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };

})
.controller('SpotCtrl', function($scope, $ionicPlatform, $cordovaImagePicker) {


	$scope.upload = function(){

console.log($scope.uploadField);
			alert('Upload file: ' + $scope.uploadField.value);
	};
})

.factory("MapItems", function($firebaseArray) {
    var itemsRef = new Firebase(FBURL + "/MapItems");
    return $firebaseArray(itemsRef);
})
