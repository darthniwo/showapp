'use strict';
(function(angular) {
  angular
    .module('showapp')
    .config(['$stateProvider', '$urlRouterProvider', Appconfig]);

  function StorageProvider(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('showapp').setNotify(false, false);
  }

  function Appconfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'views/layout.html',
        controller: 'navCtrl',
        controllerAs: 'nav',
      })
      .state('main.movies', {
        url: 'movies',
        templateUrl: 'views/movies.html',
        controller: 'moviesCtrl',
        controllerAs: 'obj',
      })
      .state('main.series', {
        url: 'series',
        templateUrl: 'views/series.html',
        controller: 'seriesCtrl',
        controllerAs: 'obj',
      })
      .state('main.favourites', {
        url: 'favourites',
        templateUrl: 'views/favs.html',
        controller: 'favsCtrl',
        controllerAs: 'obj',
      });
  }
})(angular);
