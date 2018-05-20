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
          ctrl.state.movieGenres.src.unshift({id: 0, name: ''});
          //ctrl.genreSelected = {id: 0, name: ''};
        });
      } else {
        ctrl.state.movieGenres = common.maps.movieGenres;
        ctrl.state.movieGenres.src.unshift({id: 0, name: ''});
        //ctrl.genreSelected = {id: 0, name: ''};
      }
    };

    /**
     * [years description]
     * @type {Array}
     */
    ctrl.years = [
      {id: 0, label: 'All'},
      {id: 2018, label: '2018'},
      {id: 2017, label: '2017'},
      {id: 2016, label: '2016'},
      {id: 2015, label: '2015'},
      {id: 2014, label: '2014'},
      {id: 2013, label: '2013'},
      {id: 2012, label: '2012'},
      {id: 2011, label: '2011'},
      {id: 2010, label: '2010'},
      {id: 2009, label: '2009'},
      {id: 2008, label: '2008'},
      {id: 2007, label: '2007'},
      {id: 2006, label: '2006'},
      {id: 2005, label: '2005'},
      {id: 2004, label: '2004'},
      {id: 2003, label: '2003'},
      {id: 2002, label: '2002'},
      {id: 2001, label: '2001'},
      {id: 2000, label: '2000'},
    ];

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
     * [filters description]
     * @type {Object}
     */
    ctrl.filters = {
      searchText: '',
      yearSelected: ctrl.years[0],
      genreSelected: [],
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

    /**
     * [openTrailer description]
     * @param  {[type]} movieId [description]
     * @return {[type]}         [description]
     */
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
        modal.close.then(function(result) {
          console.log('closes');
        });
      });
    };

    ctrl.getSearchUrl = () => {
      const url =
        ctrl.filters.searchText !== ''
          ? common.urls.movieSearch
          : common.urls.movies;
      const query =
        ctrl.filters.searchText !== ''
          ? '&query=' + ctrl.filters.searchText
          : '';
      const genres =
        ctrl.filters.genreSelected.length > 0
          ? '&with_genres=' +
            common.getSelectedGenresIds(ctrl.filters.genreSelected).join()
          : '';
      const year =
        ctrl.filters.yearSelected.id !== 0
          ? '&year=' + ctrl.filters.yearSelected.id
          : '';
      return {url, extras: query + genres + year};
    };

    /**
     * [search description]
     * @return {[type]} [description]
     */
    ctrl.search = () => {
      const searchTerms = ctrl.getSearchUrl();
      common.method.get(searchTerms.url, searchTerms.extras).then(() => {
        ctrl._setResults(common.response);
      });
    };

    /**
     * [onPageChange description]
     * @param  {[type]} page [description]
     * @return {[type]}      [description]
     */
    ctrl.onPageChange = page => {
      const nextPage = '&page=' + page;
      const searchTerms = ctrl.getSearchUrl();
      common.method
        .get(searchTerms.url, searchTerms.extras + nextPage)
        .then(() => {
          ctrl._setResults(common.response);
        });
    };

    init();
  }
})(angular);
