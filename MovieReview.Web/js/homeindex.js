
var app = angular.module("app", []);

app.controller('homeIndexController', function ($scope, $http) {
    //$scope.data = [
    //    {
    //        MovieName: "Avatar",
    //        DirectorName: "James Cameron",
    //        ReleaseYear: "2009",
    //        Reviews: "3"
    //    },
    //    {
    //        MovieName: "Titanic",
    //        DirectorName: "James Cameron",
    //        ReleaseYear: "1997",
    //        Reviews: "30"
    //    },
    //    {
    //        MovieName: "Die another day",
    //        DirectorName: "Lee Tamahori",
    //        ReleaseYear: "2002",
    //        Reviews: "10"
    //    },
    //    {
    //        MovieName: "Godzilla",
    //        DirectorName: "Gareth Edwards",
    //        ReleaseYear: "2014",
    //        Reviews: "40"
    //    }
    //];

    $("#loader").show();

    $scope.count = 0;

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
    }, 1000);

});