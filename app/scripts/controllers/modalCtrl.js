'use strict';
(function(angular) {
  angular
    .module('showapp')
    .controller('modalCtrl', [
      '$scope',
      'commonSrv',
      'movieId',
      'close',
      modalCtrl,
    ]);

  function modalCtrl($scope, commonSrv, movieId, close) {
    const modal = this,
      common = commonSrv;

    modal.closeModal = () => {
      close('close', 200);
    };
  }
})(angular);
