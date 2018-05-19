'use strict';

(function (angular) {
  angular.module('showapp').controller('navCtrl', ['$scope', '$state', 'alertify', 'commonSrv', 'localStorageService', navCtrl]);

  function navCtrl($scope, $state, alertify, commonSrv, localStorageService) {
    const nav = this,
          common = commonSrv,
          ls = localStorageService;

    const init = () => {
      nav.activeLink = nav.getActiveLink();
      if (!nav.activeLink) {
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
//# sourceMappingURL=navCtrl.js.map
