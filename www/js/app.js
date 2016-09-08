(function () {

  var app = angular.module('myreddit', ['ionic', 'angularMoment']);

  app.controller('RedditCtrl', function ($scope, $http) {
    $scope.stories = [];
    var redditLocal = "http://localhost:3000/android";
    var redditProduction = "http://ionic.deontwikkelaar.be/reddit/android";

    function loadStories(params, callback) {
      $http.get(redditProduction, {params: params})
        .success(function (response) {
          var stories = [];
          response.data.children.forEach(function (child) {
            var story = child.data;
            if (invalidThumbNail(story.thumbnail)) {
              story.thumbnail = 'http://www.redditstatic.com/icon.png';
            }
            stories.push(child.data);
          });
          callback(stories);
        });
    }

    function invalidThumbNail(thumbnail) {
      return !thumbnail || thumbnail === 'self' || thumbnail === 'default';
    }

    $scope.loadOlderStories = function () {
      var params = {};
      if ($scope.stories.length > 0) {
        params['after'] = $scope.stories[$scope.stories.length - 1].name;
      }

      loadStories(params, function (olderStories) {
        $scope.stories = $scope.stories.concat(olderStories);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.loadNewerStories = function () {
      var params = {before: $scope.stories[0].name};
      loadStories(params, function (newerStories) {
        $scope.stories = newerStories.concat($scope.stories);
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.openLink = function (url) {
      window.open(url, '__blank');
    };

  });

  app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.cordova && window.cordova.inAppBrowser) {
        window.open = window.cordova.InAppBrowser.open;
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });


})();
