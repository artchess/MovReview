
/// <reference path=".../scripts/jasmine.js" />
/// <reference path="../../moviereview.web/js/appjstest.js" />

//http://jasmine.github.io/1.3/introduction.html

//myAppTest
  //defino mi suite de tests
describe("myapp tests -->", function () {

    //es un subgrupo o grupo de tests, escritos con it
    // esto es un "spec", que contiene una o mas expectaciones que testea el estado del codigo bajo testing.
    // una expectación en jasmine.js es una afirmación que puede ser true o false. 
    // un spec con todas sus expectaciones como true es un spec satisfactorio.
    // Un spec con uno o mas expectaciones que evaluan en false es un spec fallido.
    it("isDebug", function () { // nombre del test y funcion para checar la afirmación
        //el valor que recibe por parámetro expec que es llamado "actual". Este es ligado a una función de macheo
        //que recibe el valor esperado.
        expect(myapp.isLocale).toEqual(true);
    });

    it("log", function () {
        expect(myapp.log).toBeDefined();
    })

});