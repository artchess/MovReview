
$(function () {
    $(window).on("load resize", function () {
        $(".fill-screen").css("height", window.innerHeight);
    });

    // add Bootstrap's scrollspy
    $('body').scrollspy({
        target: '.navbar',
        offset: 160
    });

    // smooth scrolling
    $('nav a, .down-button a').bind('click', function (event) {
        var isDownBtn = $(this).parent().hasClass('down-button');
        if (isDownBtn) {
            $('html, body').stop().animate({
                scrollTop: $($(this).data('go')).offset().top - 100
            }, !isDownBtn ? 900 : 1200, 'easeInOutExpo');
            event.preventDefault();
        }   
    });

    // parallax scrolling with stellar.js
    $(window).stellar();
});