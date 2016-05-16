/// <reference path="../scripts/jasmine.js" />
/// <reference path="../../moviereview.web/scripts/jquery-1.10.2.min.js" />
/// <reference path="../../moviereview.web/scripts/angular.min.js" />
/// <reference path="../../moviereview.web/scripts/ui-bootstrap-tpls-0.3.0.min.js" />
/// <reference path="../../moviereview.web/scripts/angular-route.min.js" />
/// <reference path="../../moviereview.web/scripts/angular-mocks.js" />
/// <reference path="../../moviereview.web/js/homeindex.js" />
/// <reference path="../../moviereview.web/js/movie-review-edit.js" />

//para poder correr las pruebas en Test Explorer necesito tener installado
// la extension llamada Chutzpah en el visual studio.

describe("home-Index Tests -->", function () {

    //instanciamos el modulo primero, esto correrá antes de cualquier test
    beforeEach(function () {
        module("homeIndex");
    });

    //para testear bits y bytes individuales dentro de home-Index
    describe("movieService-->", function () {
        it("se pudo cargar peliculas", function () {
            inject(function (movieService) {
                //para el primer run
                expect(movieService.movies.length).toEqual(0);

            });
        });
    });

    //$httpbackend service
    var $httpBackend; // imita o simula la llamada $http
    var url = '/api/movies';

    var fakedMoviesResponse = [{
        Id: 1,
        MovieName: "Godzilla",
        DirectorName: "Gareth Edwards",
        ReleaseYear: "2014",
        NoOfReviews: 6
    }, {
        Id: 3,
        MovieName: "Titanic",
        DirectorName: "James Cameron",
        ReleaseYear: "1997",
        NoOfReviews: 3
    }, {
        Id: 4,
        MovieName: "Die Another Day",
        DirectorName: "Lee Tamahori",
        ReleaseYear: "2002",
        NoOfReviews: 0
    }, {
        Id: 7,
        MovieName: "Taken 3",
        DirectorName: "Olivier Megaton",
        ReleaseYear: "2014",
        NoOfReviews: 0
    }, {
        Id: 9,
        MovieName: "Top Gun",
        DirectorName: "Tony Scott",
        ReleaseYear: "1986",
        NoOfReviews: 0
    }];

    beforeEach(inject(function ($injector) { // corre antes de cada test
        $httpBackend = $injector.get("$httpBackend");
        $httpBackend.whenGET(url).respond(fakedMoviesResponse);
    }));

    afterEach(function () { // esto corre despues de cada test
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    //test the backend call
    describe("Testing Movies GET Call -->", function () {

        it("Loaded Movies", inject(function (movieService) {
            $httpBackend.expectGET(url);
            movieService.getMovies();
            $httpBackend.flush(); // espera a obtener la respuesta
            expect(movieService.movies.length).toEqual(5);
        }));

    });

    describe("Testing Home-Index Controller-->", function () {

        it("Load Movies", inject(function ($controller, $http, movieService) {

            var scopeObj = {};

            $httpBackend.expectGET(url);

            var ctrl = $controller("homeIndexController", {
                $scope: scopeObj,
                $http: $http,
                movieService: movieService
            });

            movieService.getMovies();
            $httpBackend.flush();
            expect(ctrl).not.toBeNull();
            expect(scopeObj.data).toBeDefined();
        }));
    });

});
