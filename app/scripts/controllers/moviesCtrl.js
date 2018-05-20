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
      const favs = ls.get('favs');
      if (!common.maps.movieGenres) {
        common.getMovieGenres().then(() => {
          ctrl.state.movieGenres = common.maps.movieGenres;
        });
      } else {
        ctrl.state.movieGenres = common.maps.movieGenres;
      }
      if (favs && !common.maps.favs) {
        common.toMap(favs, 'favs', 'id');
      }
    };

    /**
     * [years description]
     * @type {Array}
     */
    ctrl.years = common.years;

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

    ctrl.getGenreString = () => {
      return 'genres';
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

    /**
     * [renderGenres description]
     * @param  {[type]} genres [description]
     * @return {[type]}        [description]
     */
    ctrl.renderGenres = genres => {
      const filteredGenres = ctrl.state.movieGenres.src.filter(genre => {
        return genres.indexOf(genre.id) !== -1;
      });
      return filteredGenres.map(genre => genre.name).join(', ');
    };

    /**
     * [truncateText description]
     * @param  {[type]} text  [description]
     * @param  {[type]} chars [description]
     * @return {[type]}       [description]
     */
    ctrl.truncateText = (text, chars) => {
      return common.truncate(text, chars);
    };

    /**
     * [checkFav description]
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    ctrl.checkFav = item => {
      const favs = common.maps.favs || {};
      return Boolean(favs) && favs[item.id] ? true : false;
    };

    /**
     * [getFavClass description]
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    ctrl.getFavClass = item => {
      return ctrl.checkFav(item) ? 'fa-heart' : 'fa-heart-o';
    };

    /**
     * [addToFavs description]
     * @param {[type]} item [description]
     */
    ctrl.addToFavs = item => {
      let favStorage = ls.get('favs') || [];
      const {favs} = common.maps;
      if (Boolean(favs) && favs[item.id]) {
        delete favs[item.id];
        favStorage = favStorage.filter(fav => fav.id !== item.id);
      } else {
        favStorage.push(item);
      }
      ls.set('favs', favStorage);
      common.toMap(favStorage, 'favs', 'id');
    };

    /**
     * [getSearchUrl description]
     * @return {[type]} [description]
     */
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
