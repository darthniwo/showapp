'use strict';
(function(angular) {
  angular
    .module('showapp')
    .controller('favsCtrl', [
      '$scope',
      'alertify',
      'commonSrv',
      'localStorageService',
      'ModalService',
      favsCtrl,
    ]);

  function favsCtrl(
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
          ctrl.state.genres = common.maps.movieGenres;
          ctrl._setResults();
        });
      } else {
        ctrl.state.genres = common.maps.movieGenres;
        ctrl._setResults();
      }
      if (favs && !common.maps.favs) {
        common.toMap(favs, 'favs', 'id');
      }
    };

    /**
     * [state: Main variables of the controller]
     * @type {Object}
     */
    ctrl.state = {
      favs: null,
      genres: null,
    };

    /**
     * [openTrailer: Method for triggering the modal that shows the trailer]
     * @param  {[Integer]} movieId [Movie ID for searching details]
     * @return {[N/A]}         [void]
     */
    ctrl.openTrailer = item => {
      ModalService.showModal({
        templateUrl: 'views/modal.html',
        controller: 'modalCtrl',
        controllerAs: 'obj',
        inputs: {
          itemId: item.id,
          kind: Boolean(item.original_name) ? 'serie' : 'movie',
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
    ctrl.renderGenres = (genres, item) => {
      const filteredGenres = ctrl.state.genres.src.filter(genre => {
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
     * [toggleFav: Method used to unmark a item as favorite]
     * @param {[Object]} item [Movie object]
     */
    ctrl.toggleFav = item => {
      let favStorage = ls.get('favs') || [];
      const {favs} = common.maps;
      delete favs[item.id];
      favStorage = favStorage.filter(fav => fav.id !== item.id);
      ls.set('favs', favStorage);
      common.toMap(favStorage, 'favs', 'id');
      ctrl._setResults();
    };

    /**
     * [_setResults: Method to retrieve the favorites from localStorage and set the local controller variables]
     */
    ctrl._setResults = () => {
      const favs = ls.get('favs') || [];
      if (Boolean(favs)) {
        ctrl.state.favs = favs.map(fav => {
          const temp = Object.assign({}, fav);
          temp.title = Boolean(fav.title) ? fav.title : fav.original_name;
          temp.release_date = Boolean(fav.release_date)
            ? fav.release_date
            : fav.first_air_date;
          return temp;
        });
      }
    };

    init();
  }
})(angular);
