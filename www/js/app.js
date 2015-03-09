var imgurApp = angular.module("imgur", ["ionic", "ngCordova", "ngImgur"]);
var imgurInstance = null;

imgurApp.run(function($ionicPlatform, $imgur, $state) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        if(!window.cordova) {
            imgurInstance = new $imgur("IMGUR_ACCESS_TOKEN_FOR_WEB_ONLY");
            $state.go("secure.imgur.tabs");
        }
    });
});

imgurApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("login", {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: "LoginController"
        })
        .state("secure", {
            url: "/secure",
            templateUrl: "templates/secure.html"
        })
        .state("secure.imgur", {
            url: "/imgur",
            views: {
                "secure-content": {
                    templateUrl: "templates/imgur_tabs.html",
                    controller: "ImgurController"
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
    $urlRouterProvider.otherwise('/login');
});

imgurApp.controller("LoginController", function($scope, $state, $ionicHistory, $cordovaOauth, $imgur) {

    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });

    $scope.login = function() {
        $cordovaOauth.imgur("319aaa6d9162af7").then(function(result) {
            console.log(JSON.stringify(result));
            imgurInstance = new $imgur(result.access_token);
            $state.go("secure.imgur.tabs");
        }, function(error) {
            console.log(error);
        });
    }

});

imgurApp.controller("ImgurController", function($scope, $ionicLoading, $cordovaCamera, $cordovaFileTransfer) {

    $scope.upload = function() {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            console.log(imageData);
            $ionicLoading.show({template: "Uploading..."});
            var options = {
                fileKey: "image",
                fileName: "image.jpg",
                chunkedMode: false,
                mimeType: "image/jpeg",
                headers: {
                    "Authorization": "Bearer " + imgurInstance.getAccessToken()
                }
            };
            $cordovaFileTransfer.upload("https://api.imgur.com/3/image", imageData, options).then(function(result) {
                console.log(result);
            }, function(error) {
                console.error(error);
            }).then(function() {
                $ionicLoading.hide();
            });
        }, function(error) {
            console.error(error);
        });
    }

});

imgurApp.controller("TabsController", function($scope, $ionicLoading, $cordovaCamera) {

    $scope.images = [];

    $scope.viral = function(isPulling) {
        if(!isPulling || isPulling === false) {
            $ionicLoading.show({template: "Loading..."});
        }
        imgurInstance.getGallery("hot", "viral").then(function(result) {
            $scope.images = result;
        }, function(error) {
            console.error(error);
        }).then(function() {
            if(!isPulling || isPulling === false) {
                $ionicLoading.hide();
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }
        });
    }


});
