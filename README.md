Unofficial Imgur App
==============================

An unofficial Imgur application created using Ionic Framework and Apache Cordova.  This application
is compatible with Android and iOS and makes use of the Imgur RESTful APIs and ngCordova AngularJS
extension set.


Requirements
-------------

* Apache Cordova 3.5+
* [Apache Cordova InAppBrowser Plugin](http://cordova.apache.org/docs/en/3.0.0/cordova_inappbrowser_inappbrowser.md.html)
* [Apache Cordova Camera Plugin](https://github.com/apache/cordova-plugin-camera)
* [ngCordova](http://www.ngcordova.com)
* [ngImgur](https://github.com/nraboy/ng-imgur)


Configuration
-------------

Download this example project from GitHub and run the following commands:

    $ ionic platform add android
    $ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git
    $ cordova plugin add org.apache.cordova.camera

The above commands will add the Android build platform and install the required Apache InAppBrowser plugin.

This application requires you to have your own Imgur application registered with imgur.com.  Doing so
will give you a unique client id that can be included into your project.  When registering your application with Facebook,
make sure to set the callback uri to **http://localhost/callback**, otherwise ngCordova will not function.

With the client id in hand, open **www/js/app.js** and find the following line:

    $cordovaOauth.imgur("CLIENT_ID_HERE")

You will want to replace **CLIENT_ID_HERE** with the official key.


Usage
-------------

With this example project configured on your computer, run the following from the Terminal or command prompt:

    $ ionic build android

Install the application binary to your device or simulator.


Have a question or found a bug (compliments work too)?
-------------

Tweet me on Twitter - [@nraboy](https://www.twitter.com/nraboy)


Resources
-------------

Imgur - [http://www.imgur.com](http://www.imgur.com)

Ionic Framework - [http://www.ionicframework.com](http://www.ionicframework.com)

AngularJS - [http://www.angularjs.org](http://www.angularjs.org)

Apache Cordova - [http://cordova.apache.org](http://cordova.apache.org)

ngCordova - [http://www.ngcordova.com](http://www.ngcordova.com)
