/// <reference path="../scripts/jasmine.js" />
/// <reference path="../../moviereview.web/scripts/angular.min.js" />
/// <reference path="../../moviereview.web/scripts/angular-mocks.js" />
/// <reference path="../../moviereview.web/js/homeindex.js" />

describe("home-Index Tests -->", function () {

    //para testear bits y bytes individuales dentro de home-Index
    describe("movieService-->", function () {

        it("se pudo cargar peliculas", function () {
            inject(function (movieService) {
                //para el primer run
                expect(movieService.getMovies).toEqual([]);

            });
        });

    });

});
