var imgurApp = angular.module("imgur", ["ionic", "ngCordovaOauth", "ngImgur"]);
var imgurInstance = null;

imgurApp.run(function($ionicPlatform, $imgur) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        imgurInstance = new $imgur("283e5177ef9cf6d83d10333f4dcaf58118104979");
    });
});

imgurApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("secure", {
            url: "/secure",
            templateUrl: "templates/secure.html"
        })
        .state("secure.imgur", {
            url: "/imgur",
            views: {
                "secure-content": {
                    templateUrl: "templates/imgur_tabs.html"
                }
            }
        })
        .state("secure.account", {
            url: "/account",
            views: {
                "secure-content": {
                    templateUrl: "templates/account_settings.html"
                }
            }
        })
        .state("secure.imgur.tabs", {
            url: "/tabs",
            views: {
                "viral": {
                    templateUrl: "templates/tabs_viral.html",
                    controller: "TabsController"
                },
                "me": {
                    templateUrl: "templates/tabs_me.html",
                    controller: "TabsController"
                },
                "messages": {
                    templateUrl: "templates/tabs_messages.html",
                    controller: "TabsController"
                }
            }
        });
    $urlRouterProvider.otherwise('/secure/imgur/tabs');
});

imgurApp.controller("TabsController", function($scope, $ionicLoading) {

    $scope.images = [];

    $scope.viral = function() {
        $ionicLoading.show({template: "Loading..."});
        imgurInstance.getGallery("hot", "viral").then(function(result) {
            $scope.images = result;
        }, function(error) {
            console.error(error);
        }).then(function() {
            $ionicLoading.hide();
        });
    }

});
