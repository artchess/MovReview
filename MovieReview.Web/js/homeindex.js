
var module = angular.module("homeIndex", ['ngRoute']);

//Route Configuration
module.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/", {
        controller: "homeIndexController",
        templateUrl: "/templates/home.html"
    });

    $routeProvider.when("/movies", {
        controller: "homeIndexController",
        templateUrl: "/templates/movies.html"
    });

    $routeProvider.when("/newMovie", {
        controller: "newMovieController",
        templateUrl: "/templates/newMovie.html"
    });

    //default
    $routeProvider.otherwise({ redirectTo: "/" });
}]);

module.controller('homeIndexController', ['$scope', '$http', function ($scope, $http) {

    $("#loader").show();

    //Vacio colleccion
    $scope.data = [];

    //API call
    //Tomeout para mostrar spinner
    setTimeout(function () {
        $http.get('/api/movies')
            .then(function (result) {
                //success
                //copia la coleccion de result.data a $scope.data
                angular.copy(result.data, $scope.data);
            }, function () {
                //Error
                //Todo: se cambiara luego por toastr lib
                console.log("No se pudo obtener datos");
            })
            .then(function () {
                $('#loader').hide();
            });
    }, 100);

}]);