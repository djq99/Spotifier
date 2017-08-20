var app = angular.module('Spotifier', ['ui.bootstrap']);

app.controller('MainCtrl', ['$scope', '$http', '$window',
	function ($scope, $http, $window) {

		$scope.predicate = 'followers';
		$scope.currentPage = 1;
		$scope.reverse = false;

		$scope.order = function (predicate) {
			$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
			$scope.predicate = predicate;
		};
		$scope.searchFunc = function () {

			$http({
				url: '/search',
				method: "GET",
				params: {text: $scope.input}
			}).then(function callback(result) {
				console.log(result.data);
				var data = preprocessData(result.data);
				$scope.items = data;
				$scope.totalItems = $scope.items.length;
				$scope.numPerPage = 6;
				$scope.paginate = function (value) {
					var begin, end, index;
					begin = ($scope.currentPage - 1) * $scope.numPerPage;
					end = begin + $scope.numPerPage;
					index = $scope.items.indexOf(value);
					return (begin <= index && index < end);
				};

			});

		}
		$scope.setSelected = function (id) {
			$window.location.href = "https://open.spotify.com/artist/" + id;
		}

	}]);

function preprocessData(data) {
	var newData = data.sort(function (a, b) {
		return (a.followers.total < b.followers.total) ? 1 : ((b.followers.total < a.followers.total) ? -1 : 0);
	});
	newData.forEach(function(d){
		if(d.genres.length == 0){
			d.genres = "None"
		}
		else{
			var str = "";
			for(var i = 0; i < d.genres.length -1; i++){
				str += d.genres[i];
				str += ", ";
			}
			str += d.genres[d.genres.length -1];
			d.genres = str;
		}
		if(d.images.length == 0){
			d.images = "https://www.rulgaye.pk/img/NoImage.png"
		}
		else{
			d.images = d.images[0].url
		}
	})
	return newData;

}
