'use strict';
(function(angular) {
  angular
    .module('showapp')
    .controller('modalCtrl', [
      '$scope',
      '$sce',
      'commonSrv',
      'movieId',
      'close',
      modalCtrl,
    ]);

  function modalCtrl($scope, $sce, commonSrv, movieId, close) {
    const modal = this,
      common = commonSrv;

    const init = () => {
      modal.getVideoId();
    };

    modal.loading = false;

    modal.getVideoId = () => {
      modal.loading = true;
      console.log(modal.loading);
      const url = common.urls.movieDetail + movieId;
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
