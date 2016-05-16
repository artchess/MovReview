
//Defined Module
var movieReviewModule = angular.module('movieReviewEdit', []);

//Rutas Definidas
movieReviewModule.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/editMovie/:Id', {
        controller: 'movieEditController',
        templateUrl: '/templates/editMovie.html'
    });

    $routeProvider.otherwise({
        redirectTo: '/movies'
    });

}]);

movieReviewModule.controller('movieEditController', ['$scope', 'movieService', '$window', '$routeParams', function ($scope, movieService, $window, $routeParams) {
    //inicializo movie y movie id
    $scope.movie = null;
    $scope.MovieId = null;

    //obtengo la pelicula por id
    movieService.getMovieById($routeParams.Id)
            .then(function (data) {
                //success
                $scope.movie = data;
            }, function () {
                //error
                toastr.error('Error al obtener pelicula con id:' + $routeParams.Id);
            });

    $scope.editMovie = function () {
        movieService.movieEdit($scope.movie)
            .then(function () {
                //success
                toastr.success('¡Pelicula <b>editada</b> satisfactoriamente!');
                $window.location = '#/movies';
            }, function () {
                //error
                toastr.error('Error al editar pelicula');
            });
    };

    $scope.deleteMovie = function () {
        movieService.removeMovie($scope.movie.Id)
            .then(function () {
                //success
                toastr.success('¡Pelicula <b>eliminada</b> satisfactoriamente!');
                $window.location = '#/movies';
            }, function () {
                //error
                toastr.error('Error al eliminar película con el Id: ' + $scope.movie.Id);
            });
    };

}]);