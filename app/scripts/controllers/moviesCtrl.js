'use strict';
(function(angular) {
  angular
    .module('showapp')
    .controller('moviesCtrl', [
      '$scope',
      'alertify',
      'commonSrv',
      'localStorageService',
      'ModalService',
      moviesCtrl,
    ]);

  function moviesCtrl(
    $scope,
    alertify,
    commonSrv,
    localStorageService,
    ModalService
  ) {
    const ctrl = this,
      common = commonSrv,
      ls = localStorageService;

    /**
     * [init description]
     * @return {[type]} [description]
     */
    const init = () => {
      console.log('moviesCtrl');
      if (!common.maps.movieGenres) {
        common.getMovieGenres().then(() => {
          ctrl.state.movieGenres = common.maps.movieGenres;
        });
      } else {
        ctrl.state.movieGenres = common.maps.movieGenres;
      }
    };

    /**
     * [state description]
     * @type {Object}
     */
    ctrl.state = {
      movies: null,
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      limit: 20,
      movieGenres: null,
    };

    /**
     * [_setResults description]
     * @param {[type]} data [description]
     */
    ctrl._setResults = data => {
      const {results, total_pages, total_results} = data;
      ctrl.state.movies = results;
      ctrl.state.totalItems = total_results;
      ctrl.state.totalPages = total_pages;
    };

    ctrl.openTrailer = movieId => {
      console.log(movieId);

      ModalService.showModal({
        templateUrl: 'views/modal.html',
        controller: 'modalCtrl',
        controllerAs: 'obj',
        inputs: {
          movieId,
        },
      }).then(function(modal) {
        // The modal object has the element built, if this is a bootstrap modal
        // you can call 'modal' to show it, if it's a custom modal just show or hide
        // it as you need to.

        modal.close.then(function(result) {
          console.log('closes');
        });
      });
    };

    /**
     * [search description]
     * @return {[type]} [description]
     */
    ctrl.search = () => {
      const url =
        ctrl.searchText !== '' ? common.urls.movieSearch : common.urls.movies;
      const query = ctrl.searchText !== '' ? '&query=' + ctrl.searchText : '';
      common.method.get(url, query).then(() => {
        ctrl._setResults(common.response);
      });
    };

    /**
     * [onPageChange description]
     * @param  {[type]} page [description]
     * @return {[type]}      [description]
     */
    ctrl.onPageChange = page => {
      const extra = '&page=' + page;
      common.method.get(common.urls.movies, extra).then(() => {
        ctrl._setResults(common.response);
      });
    };

    init();
  }
})(angular);
