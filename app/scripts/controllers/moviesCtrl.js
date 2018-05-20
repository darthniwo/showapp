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
     * [init: Method to initialize inner variables and states]
     * @return {[N/A]} [void]
     */
    const init = () => {
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
     * [years: Store the years for filter use]
     * @type {Array}
     */
    ctrl.years = common.years;

    /**
     * [state: Main variables of the controller]
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
     * [filters: Controller UI filters used on view]
     * @type {Object}
     */
    ctrl.filters = {
      searchText: '',
      yearSelected: ctrl.years[0],
      genreSelected: [],
    };

    /**
     * [_setResults: Method for setting the response results afer search on the controller]
     * @param {[Object]} data [Results variable]
     */
    ctrl._setResults = data => {
      const {results, total_pages, total_results} = data;
      ctrl.state.movies = results;
      ctrl.state.totalItems = total_results;
      ctrl.state.totalPages = total_pages;
    };

    /**
     * [openTrailer: Method for triggering the modal that shows the trailer]
     * @param  {[Integer]} movieId [Movie ID for searching details]
     * @return {[N/A]}         [void]
     */
    ctrl.openTrailer = movieId => {
      ModalService.showModal({
        templateUrl: 'views/modal.html',
        controller: 'modalCtrl',
        controllerAs: 'obj',
        inputs: {
          movieId,
        },
      }).then(function(modal) {
        modal.close.then(function(result) {});
      });
    };

    /**
     * [renderGenres: Method for render the genre's name for a giving set of genres]
     * @param  {[Array]} genres [Array of ids provided on every movie object]
     * @return {[String]}        [String with ganres names sepparated by comma]
     */
    ctrl.renderGenres = genres => {
      const filteredGenres = ctrl.state.movieGenres.src.filter(genre => {
        return genres.indexOf(genre.id) !== -1;
      });
      return filteredGenres.map(genre => genre.name).join(', ');
    };

    /**
     * [truncateText: Local truncate method]
     * @param  {[String]} text  [Text to be truncated]
     * @param  {[Integer]} chars [Chars to truncate]
     * @return {[String]}       [Truncated string with an ellipsis at the end]
     */
    ctrl.truncateText = (text, chars) => {
      return common.truncate(text, chars);
    };

    /**
     * [checkFav: Method for checking if the selected movie has been marked as favourite]
     * @param  {[Object]} item [Movie object]
     * @return {[Boolean]}      [True or false, depending on the check] // can be refactored
     */
    ctrl.checkFav = item => {
      const favs = common.maps.favs || {};
      return Boolean(favs) && favs[item.id];
    };

    /**
     * [getFavClass: Method returning the used to show if the movie has been marked as favourite]
     * @param  {[Object]} item [Movie object]
     * @return {[String]}      [Class used on view (string)]
     */
    ctrl.getFavClass = item => {
      return ctrl.checkFav(item) ? 'fa-heart' : 'fa-heart-o';
    };

    /**
     * [toggleFav: MEthod used to mark/unmark a movie as favourite]
     * @param {[Object]} item [Movie object]
     */
    ctrl.toggleFav = item => {
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
     * [_getSearchUrl: Inner method to create the final search url]
     * @return {[String]} [Search URL]
     */
    ctrl._getSearchUrl = () => {
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
     * [search: Main search method]
     * @return {[Array]} [Response from the get method]
     */
    ctrl.search = () => {
      const searchTerms = ctrl._getSearchUrl();
      common.method.get(searchTerms.url, searchTerms.extras).then(() => {
        ctrl._setResults(common.response);
      });
    };

    /**
     * [onPageChange: Mehotd used on every page change]
     * @param  {[Integer]} page [Page number]
     * @return {[Array]} [Response from the get method]
     */
    ctrl.onPageChange = page => {
      const nextPage = '&page=' + page;
      const searchTerms = ctrl._getSearchUrl();
      common.method
        .get(searchTerms.url, searchTerms.extras + nextPage)
        .then(() => {
          ctrl._setResults(common.response);
        });
    };

    init();
  }
})(angular);
