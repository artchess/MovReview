
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

module.controller('newMovieController', ["$scope", "$http", "$window", function ($scope, $http, $window) {

    $scope.newMovie = {};

    $scope.save = function () {

        $http.post('/api/movies', $scope.newMovie)
                .then(function (result) {
                    //success
                    var newMovie = result.data;
                    toastr.success("Pelicula <b>Salvada</b> Correctamente");

                    //Una vez salvado regreso a la pagina de movies
                    $window.location = '#/movies';
                },
                function () {
                    //Error
                    toastr.error('No fue posible salvar la pelicula', 'Error');
                });

    }

    //$scope.cancelMovie = function () {
    //    $window.location = "#/movies";
    //}

    //Timeout function to show spinner
    //setTimeout(function () {
    //    $scope.save = function () {
    //        //Making Spinner On
    //        $('#loader').show();
    //        dataService.addMovie($scope.newMovie)
    //            .then(function () {
    //                //success
    //                toastr.success("Data Saved Successfully");
    //                $window.location = "#/movies";
    //            }, function () {
    //                //Error
    //                toastr.error("Error in Saving Data");
    //            }).then(function () {
    //                //Hide the progressbar in any case
    //                $('#loader').hide();
    //            });
    //    }
    //}, 1000);
}]);