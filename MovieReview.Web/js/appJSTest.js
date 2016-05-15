//appJSTest
//Creamos una funcion auto ejecutable con una variable global

(function (myapp) {

    //setting isLocale a true
    myapp.isLocale = true;

    //mensajes de log en la consola
    //si isLocale es true
    myapp.log = function (msg) {
        if (myapp.isLocale) {
            console.log(msg);
        }
    };

})(window.myapp = window.myapp || {});