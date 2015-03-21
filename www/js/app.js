var imgurApp = angular.module("imgur", ["ionic", "ngStorage", "ngCordova", "ngImgur"]);
var imgurInstance = null;

imgurApp.run(function($ionicPlatform, $imgur, $state, $localStorage) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

imgurApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("login", {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: "LoginController",
        })
        .state("secure", {
            url: "/secure",
            templateUrl: "templates/secure.html",
            controller: "SecureController",
            abstract: true
        })
        .state("secure.tabs", {
            url: "/imgur",
            abstract: true,
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
        .state("secure.tabs.viral", {
            url: "/viral",
            views: {
                "viral": {
                    templateUrl: "templates/tabs_viral.html",
                    controller: "TabsController"
                }
            }
        })
        .state("secure.tabs.me", {
            url: "/me",
            views: {
                "me": {
                    templateUrl: "templates/tabs_me.html",
                    controller: "TabsController"
                }
            }
        })
        .state("secure.tabs.messages", {
            url: "/messages",
            views: {
                "messages": {
                    templateUrl: "templates/tabs_messages.html",
                    controller: "TabsController"
                }
            }
        });
    $urlRouterProvider.otherwise('/login');
});

imgurApp.controller("LoginController", function($scope, $state, $ionicHistory, $localStorage, $cordovaOauth, $imgur) {

    $ionicHistory.clearHistory();

    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });

    if(!window.cordova) {
        $localStorage.imgur = {
            oauth: {
                access_token: "IMGUR_ACCESS_TOKEN_FOR_WEB_ONLY",
                account_username: "nraboy"
            }
        };
        imgurInstance = new $imgur($localStorage.imgur.oauth.access_token);
        $state.go("secure.tabs.viral");
    } else if($localStorage.imgur !== undefined && (new Date).getTime() < $localStorage.imgur.oauth.expires_at) {
        imgurInstance = new $imgur($localStorage.imgur.oauth.access_token);
        $state.go("secure.tabs.viral");
    }

    $scope.login = function() {
        $cordovaOauth.imgur("319aaa6d9162af7").then(function(result) {
            console.log(JSON.stringify(result));
            result.expires_at = (new Date).getTime() + (result.expires_in * 1000);
            $localStorage.imgur = {
                oauth: result
            };
            console.log("JUST SIGNED IN " + JSON.stringify($localStorage.imgur));
            imgurInstance = new $imgur(result.access_token);
            $state.go("secure.tabs.viral");
        }, function(error) {
            console.log(error);
        });
    }

});

imgurApp.controller("SecureController", function($scope, $state, $localStorage) {

    $scope.logout = function() {
        delete $localStorage.imgur;
        $state.go("login");
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

imgurApp.controller("TabsController", function($scope, $ionicLoading, $localStorage, $cordovaCamera) {

    $scope.images = [];
    $scope.conversations = [];

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

    $scope.messages = function(isPulling) {
        if(!isPulling || isPulling === false) {
            $ionicLoading.show({template: "Loading..."});
        }
        imgurInstance.getConversationList().then(function(result) {
            $scope.conversations = result;
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

    $scope.me = function(isPulling) {
        if(!isPulling || isPulling === false) {
            $ionicLoading.show({template: "Loading..."});
        }
        imgurInstance.getAccountImages($localStorage.imgur.oauth.account_username).then(function(result) {
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
