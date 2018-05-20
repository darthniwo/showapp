'use strict';
(function(angular) {
  angular
    .module('showapp')
    .controller('modalCtrl', [
      '$scope',
      '$sce',
      'commonSrv',
      'itemId',
      'kind',
      'close',
      modalCtrl,
    ]);

  function modalCtrl($scope, $sce, commonSrv, itemId, kind, close) {
    const modal = this,
      common = commonSrv;

    const init = () => {
      modal.getVideoId();
    };

    modal.loading = false;

    modal.getVideoId = () => {
      modal.loading = true;
      console.log(modal.loading);
      const url =
        kind === 'movie'
          ? common.urls.movieDetail + itemId
          : common.urls.tvDetail + itemId;
      const videoURL = 'https://www.youtube.com/embed/';
      common.method.get(url, '&append_to_response=videos').then(() => {
        modal.trailer = $sce.trustAsResourceUrl(
          videoURL + common.response.videos.results[0].key
        );
        modal.loading = false;
        console.log(modal.loading);
      });
    };

    modal.closeModal = () => {
      close('close', 200);
    };

    init();
  }
})(angular);
