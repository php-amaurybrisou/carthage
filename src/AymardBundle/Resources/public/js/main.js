angular.module('aymardApp', []).config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

$(document).ready(function(){

    $("#side-menu")
        .mouseover(function(){
            window.setTimeout(function(){
                $("#page-description").removeClass("hidden");
            }, 0)
        })
        .mouseleave(function(){
            $("#page-description").addClass("hidden");
        })
    $('#menu-trigger').click(function(){
        $("#side-menu").toggleClass("menu-active");
    })
})