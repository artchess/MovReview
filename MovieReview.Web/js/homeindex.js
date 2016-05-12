
var module = angular.module("homeIndex", ['ngRoute', 'ui.bootstrap', 'movieReviewEdit']);

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

// mi servicio para CRUD
// $q es un parametro especial que nos permite crear un objeto deferrable
// un objeto deferrable puede exponer una promesa, de modo que el consumidor de la función _getMovies
// pueda usarla como sintaxis de lo que es necesario hacer cuando es satisfactorio o hubo algun fallo.
module.factory('movieService', ['$http', '$q', function ($http, $q) {

    //Funcion para traer peliculas
    var _getMovies = function () {
        //para resolver la promesa
        var deferred = $q.defer();

        //API call
        $http.get('/api/movies')
            .then(function (result) {
                //success
                deferred.resolve(result.data);
            }, function () {
                //Error
                deferred.reject();
            });

        return deferred.promise;
    } // fin de _getMovies

    //obtener pelicula por id
    var _getMovieById = function(Id) {
        var deferred = $q.defer();

        $http.get('/api/movies/' + Id)
            .then(function (result) {
                //Success
                deferred.resolve(result.data);
            }, function () {
                //error
                deferred.reject();
            });

        return deferred.promise;s
    } // fin de _getMovieById

    //edicion de pelicula
    var _movieEdit = function (movie) {
        var deferred = $q.defer();

        $http.put('/api/movies/', movie)
            .then(function () {
                //Success
                deferred.resolve();
            }, function () {
                //error
                deferred.reject();
            });

        return deferred.promise;
    } // fin de _movieEdit

    // eliminacion de pelicula
    var _removeMovie = function (Id) {
        var deferred = $q.defer();

        $http.delete('/api/movies/' + Id)
            .then(function () {
                //success
                deferred.resolve();
            }, function () {
                //error
                deferred.reject();
            });

        return deferred.promise;
    }

    //habilito el uso de las siguientes propiedades para que otras partes de angular lo puedan usar
    return {
        getMovies: _getMovies,
        getMovieById: _getMovieById,
        movieEdit: _movieEdit,
        removeMovie: _removeMovie
    };
}]);

module.controller('homeIndexController', ['$scope', '$http', 'movieService', function ($scope, $http, movieService) {
    //Coleccion vacía
    $scope.data = {};
    $scope.data.movies = [];

    $("#loader").show();

    setTimeout(function () {
        movieService.getMovies()
                .then(function (data) {
                    //success
                    //copia la coleccion de result.data a $scope.data
                    angular.copy(data, $scope.data.movies);
                    toastr.success('Obtención de películas satisfactoria.');
                },
                function () {
                    //error
                    toastr.error('Ocurrio un error al obtener las películas');
                })
                .then(function(){
                    $('#loader').hide();
                });
    }, 10);
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

module.controller('reviewsController', ["$scope", "$routeParams", "$window", "movieService", function ($scope, $routeParams, $window, movieService) {

        $scope.reviews = null;
        $scope.MovieId = null;

        //$scope.goToAddReview = function () {
        //    $window.location = "/#newReview/" + $routeParams.Id;
        //}
        ////Setting Timeout for spinner
        //$('#loader').show();
        ////Timeout function to show spinner
        //setTimeout(function () {
        //    dataService.getReviewById($routeParams.Id)
        //        .then(function (review) {
        //            //Success
        //            //For pagination
        //            $scope.currentPage = 1;
        //            $scope.numPerPage = 10;
        //            $scope.maxSize = 11;

        //            $scope.numPages = function () {
        //                return Math.ceil(review.length / $scope.numPerPage);
        //            };

        //            $scope.$watch('currentPage + numPerPage', function () {
        //                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        //                , end = begin + $scope.numPerPage;
        //                $scope.filteredReviews = review.slice(begin, end);

        //            });
        //            $scope.reviews = review;
        //            $scope.MovieId = $routeParams.Id;
        //            toastr.success("Reviews retrieved Successfully");
        //        }, function () {
        //            //Error
        //            toastr.error("Error in Fetching Reviews");
        //        })
        //        .then(function () {
        //            $('#loader').hide();
        //        });
        //}, 1000);
}]);