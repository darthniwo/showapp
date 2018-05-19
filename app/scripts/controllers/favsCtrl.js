'use strict';
(function(angular) {
  angular
    .module('showapp')
    .controller('favsCtrl', [
      '$scope',
      'alertify',
      'commonSrv',
      'localStorageService',
      favsCtrl,
    ]);

  function favsCtrl($scope, alertify, commonSrv, localStorageService) {
    const obj = this,
      common = commonSrv,
      ls = localStorageService;

    function init() {
      console.log('favsCtrl');
    }

    init();
  }
})(angular);
