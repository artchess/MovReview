
var homeIndexModule = angular.module("homeIndex", ['ngRoute', 'ui.bootstrap', 'movieReviewEdit']);

//Route Configuration
homeIndexModule.config(["$routeProvider", function ($routeProvider) {
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

    $routeProvider.when("/reviews/:Id", {
        controller: "reviewsController",
        templateUrl: "/templates/reviews.html"
    });

    $routeProvider.when("/newReview/:Id", {
        controller: "newreviewController",
        templateUrl: "/templates/newReview.html"
    });

    $routeProvider.when("/editReview/:Id", {
        controller: "revieweditController",
        templateUrl: "/templates/editReview.html"
    });

    //default
    $routeProvider.otherwise({ redirectTo: "/" });
}]);

// mi servicio para CRUD
// $q es un parametro especial que nos permite crear un objeto deferrable
// un objeto deferrable puede exponer una promesa, de modo que el consumidor de la función _getMovies
// pueda usarla como sintaxis de lo que es necesario hacer cuando es satisfactorio o hubo algun fallo.
homeIndexModule.factory('movieService', ['$http', '$q', function ($http, $q) {
    var _movies = [];
    var _reviews = [];

    //Funcion para traer peliculas
    var _getMovies = function () {
        //para resolver la promesa
        var deferred = $q.defer();

        //API call
        $http.get('/api/movies')
            .then(function (result) {
                //success
                //angular.copy copies the collection from source to destination
                angular.copy(result.data, _movies);
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

    // obtención de críticas
    var _getReviews = function (Id) {
        var deferred = $q.defer();
        $http.get('/api/MovieReviews/' + Id)
            .then(function (result) {
                //Success
                angular.copy(result.data, _reviews);
                deferred.resolve(result.data);
            }, function () {
                //Error
                deferred.reject();
            });

        return deferred.promise;
    }

    // obtencion de críticas por id
    var _getReviewsById = function (Id) {
        var deferred = $q.defer();
        _getReviews(Id)
            .then(function (reviews) {
                //success
                if (reviews)
                    deferred.resolve(reviews);
                else
                    deferred.reject();
            }, function () {
                //Error
                deferred.reject();
            });

        return deferred.promise;
    }

    // agregar nueva crítica
    var _addReview = function (MovieId, newReview) {
        var deferred = $q.defer();
        $http.post('/api/MovieReviews/' + MovieId, newReview)
            .then(function () {
                //success
                deferred.resolve();
            }, function () {
                //error
                deferred.reject();
            })

        return deferred.promise;
    }

    //Obten crítica por id
    var _getReviewByReviewerId = function (Id) {
        var deferred = $q.defer();
        $http.get('/api/Lookups/getbyreviewerid?Id=' + Id)
            .then(function (result) {
                //success
                deferred.resolve(result.data);
            }, function () {
                //error
                deferred.reject();
            });
        return deferred.promise;
    };

    //actualizar crítica
    //Updating Review
    var _updateReview = function (newReview) {
        var deferred = $q.defer();
        $http.put('/api/MovieReviews/', newReview)
            .then(function () {
                //Success
                deferred.resolve();
            }, function () {
                deferred.reject();
            });
        return deferred.promise;
    };

    //Deleting the Review
    var _removeReview = function (Id) {
        var deferred = $q.defer();

        $http.delete('/api/MovieReviews/' + Id)
            .then(function () {
                //success
                deferred.resolve();
            },
            function () {
                //error
                deferred.reject();
            });
        return deferred.promise;
    }

    //habilito el uso de las siguientes propiedades para que otras partes de angular lo puedan usar
    return {
        movies: _movies,
        reviews: _reviews,
        getMovies: _getMovies,
        getMovieById: _getMovieById,
        movieEdit: _movieEdit,
        removeMovie: _removeMovie,
        getReviews: _getReviews,
        getReviewsById: _getReviewsById,
        addReview: _addReview,
        getReviewByReviewerId: _getReviewByReviewerId,
        updateReview: _updateReview,
        removeReview: _removeReview
    };
}]);

homeIndexModule.controller('homeIndexController', ['$scope', '$http', 'movieService', function ($scope, $http, movieService) {
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

homeIndexModule.controller('newMovieController', ["$scope", "$http", "$window", function ($scope, $http, $window) {

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

homeIndexModule.controller('reviewsController', ["$scope", "$routeParams", "$window", "movieService", function ($scope, $routeParams, $window, movieService) {

        $scope.reviews = null;
        $scope.MovieId = null;

        //$scope.goToAddReview = function () {
        //    $window.location = "/#newReview/" + $routeParams.Id;
        //}

        //Setting Timeout for spinner
        $('#loader').show();
        //Timeout function to show spinner
        
        setTimeout(function () {
            movieService.getReviewsById($routeParams.Id)
                .then(function (review) {
                    //Success
                    //Para paginación
                    $scope.currentPage = 1;
                    $scope.numPerPage = 4;
                    $scope.maxSize = 5;

                    $scope.numPages = function () {
                        return Math.ceil(review.length / $scope.numPerPage);
                    };

                    $scope.$watch('currentPage + numPerPage', function () {
                        var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
                        $scope.filteredReviews = review.slice(begin, end);

                    });
                    $scope.reviews = review;
                    $scope.MovieId = $routeParams.Id;
                    toastr.success("Críticas obtenidas satisfactoriamente");
                }, function () {
                    //Error
                    toastr.error("Error al obtener críticas");
                })
                .then(function () {
                    $('#loader').hide();
                });
        }, 100);
}]);

homeIndexModule.controller('newreviewController', ["$scope", "$routeParams", "$window", "movieService", function ($scope, $routeParams, $window, movieService) {

    $scope.ReviewerRating = 3;
    $scope.max = 5;
    $scope.isReadonly = false;
    $scope.MovieId = null;
    $scope.newReview = {};

    $scope.cancelReview = function () {
        $window.history.back();
    }

    $scope.saveReview = function () {
        movieService.addReview($routeParams.Id, $scope.newReview)
                    .then(function () {
                        //success
                        toastr.success("Gracias por tu feedback!");
                        $window.location = "#/reviews/" + $routeParams.Id;
                    }, function () {
                        //error
                        toastr.error("No se pudo guardar la nueva crítica");
                    });
    }

}]);

homeIndexModule.controller('revieweditController', ["$scope", "$routeParams", "$window", "movieService", function ($scope, $routeParams, $window, movieService) {

    $scope.review = null;
    $scope.newReview = {};

    movieService.getReviewByReviewerId($routeParams.Id)
        .then(function (result) {
            $scope.review = result;
        }, function () {
            toastr.error('No se pudo obtener la crítica.');
        });

    $scope.cancelReview = function () {
        $window.history.back();
    }

    //Editando la crítica 
    $scope.editReview = function () {
        movieService.updateReview($scope.review)
            .then(function () {
                //success
                toastr.success('Crítica editada satisfactoriamente');
                $window.location = '#/movies';
            }, function () {
                toastr.error('Error al editar la crítica');
            })
    };

    //Eliminando la cítica
    $scope.deleteReview = function () {
        movieService.removeReview($scope.review.Id)
            .then(function () {
                //success
                toastr.success('Crítica eliminada satisfactoriamente');
                $window.location = '#/movies';
            }, function () {
                //error
                toastr.error('Error al eliminar la crítica con el Id:' + $scope.review.Id);
            })
    };

}])