'use strict';
(function(angular) {
  angular
    .module('showapp')
    .controller('navCtrl', [
      '$scope',
      '$location',
      '$state',
      'alertify',
      'commonSrv',
      'localStorageService',
      navCtrl,
    ]);

  function navCtrl(
    $scope,
    $location,
    $state,
    alertify,
    commonSrv,
    localStorageService
  ) {
    const nav = this,
      common = commonSrv,
      ls = localStorageService;

    const init = () => {
      nav.activeLink = nav.getActiveLink();
      const path = $location.path();
      if (!nav.activeLink || path === '/') {
        nav.activeLink = 'movies';
        ls.set('activeLink', nav.activeLink);
        $state.go('main.movies');
      }
    };

    nav.locations = ['movies', 'series', 'favourites'];

    nav.navigate = location => {
      nav.activeLink = location;
      ls.set('activeLink', location);
      $state.go('main.' + location);
    };

    nav.getActiveLink = () => {
      return ls.get('activeLink');
    };

    init();
  }
})(angular);
