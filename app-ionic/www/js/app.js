var FBURL = "https://vivid-inferno-1896.firebaseio.com/"

angular.module('ionic.example', ['ionic', 'firebase'])

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

.controller('HomeCtrl', function($scope, $ionicLoading, $compile, MapItems, $state, PositionFactory) {
    function initialize() {
      var pos = PositionFactory.getPosition();
      var myLatlng = new google.maps.LatLng(pos.lat, pos.lng);

      var mapOptions = {
        center: myLatlng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      };
      var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);


      $scope.map = map;

      $scope.updateMyMarker(pos);
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
        angular.forEach(MapItems, function(item) {
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
        $state.go('spot', {
          id: 123
        });

        //dont show any info window anymore
        //$scope.infoWindow.setContent(compiled[0]);
        //$scope.infoWindow.open($scope.map, marker);
      });

      $scope.markers.push(marker);
    }

    $scope.markers = [];

    $scope.myMarker = new google.maps.Marker();
    $scope.updateMyMarker = function(pos) {
      $scope.myMarker.setPosition(pos);
      $scope.myMarker.setMap($scope.map);
    }

    $scope.centerOnMe = function() {
      if (!$scope.map) {
        return;
      }

      $ionicLoading.show({
        template: 'Getting current location...',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function(pos) {
        var pos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        PositionFactory.setPosition(pos);

        $scope.map.setCenter(new google.maps.LatLng(pos.lat, pos.lng));

        $scope.updateMyMarker(pos);


        $ionicLoading.hide();
      }, function(error) {
        console.warn('Unable to get location: ' + error.message);

        $ionicLoading.hide();
        var a = $ionicLoading.show({
          template: 'Unable to get your location',
          showBackdrop: false,
          duration: 1000,
        });
      });
    };

    $scope.clickTest = function() {
      alert('Example of infowindow with ng-click')
    };

})
.controller('SpotCtrl', function($scope) {


  $scope.items = [
    { id: 0 },
    { id: 1 }
  ];
  
})

.factory("MapItems", function($firebaseArray) {
  var itemsRef = new Firebase(FBURL + "/MapItems");
  return $firebaseArray(itemsRef);
})

.factory("PositionFactory", function() {
  function getPosition() {
    this.pos = window.localStorage.getItem('pos.me');
    if (this.pos) {
      this.pos = angular.fromJson(this.pos);
    } else {
      this.pos = {
        //get OHF15 location as default
        lat: 53.5448132,
        lng: 9.9514091,
      }
    }
    return this.pos;
  }

  function setPosition(pos) {
    this.pos = pos;
    window.localStorage.setItem('pos.me', angular.toJson(pos));
  }
  return {
    getPosition: getPosition,
    setPosition: setPosition
  }
})
