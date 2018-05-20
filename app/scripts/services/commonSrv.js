'use strict';
(function(angular) {
  angular
    .module('showapp')
    .factory('commonSrv', ['$http', '$cookies', 'alertify', commonSrv]);

  function commonSrv($http, $cookies, alertify) {
    const common = {maps: {}};

    /**
     * [urls description]
     * @type {Object}
     */
    common.urls = {
      api: 'https://api.themoviedb.org/3',
      movieGenres: '/genre/movie/list',
      tvGenres: '/genre/tv/list',
      series: '/discover/tv',
      movies: '/discover/movie',
      movieSearch: '/search/movie',
      tvSearch: '/search/tv',
    };
    /**
     * [apiKey description]
     * @type {String}
     */
    common.apiKey = '?api_key=09b9ece1e65a600aca53a9b246cedd9e';

    /**
     * [years description]
     * @type {Array}
     */
    common.years = [
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
     * [response description]
     * @type {[type]}
     */
    common.response = null;

    common.toMap = (array, mapName, key) => {
      if (!common.maps[mapName]) {
        common.maps[mapName] = {};
      }
      array.forEach(item => {
        common.maps[mapName][item[key]] = item;
      });
      common.maps[mapName]['src'] = array;
    };

    /**
     * [truncate description]
     * @param  {[type]} str   [description]
     * @param  {[type]} chars [description]
     * @return {[type]}       [description]
     */
    common.truncate = (str, chars) => {
      let text = str;
      let maxPos = chars;
      if (text.length > maxPos) {
        text = text.substr(0, maxPos) + '...';
        return text;
      } else {
        return str;
      }
    };

    /**
     * [getMovieGenres description]
     * @return {[type]} [description]
     */
    common.getMovieGenres = () => {
      return common.method.get(common.urls.movieGenres).then(() => {
        const {genres} = common.response;
        common.toMap(genres, 'movieGenres', 'id');
      });
    };

    /**
     * [getTVGenres description]
     * @return {[type]} [description]
     */
    common.getTVGenres = () => {
      return common.method.get(common.urls.tvGenres).then(() => {
        const {genres} = common.response;
        common.toMap(genres, 'tvGenres', 'id');
      });
    };

    /**
     * [getSelectedGenresIds description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    common.getSelectedGenresIds = array => {
      return array.map(genre => genre.id);
    };

    /**
     * [getGenreString description]
     * @param  {[type]} array [description]
     * @return {[type]}       [description]
     */
    common.getGenreString = array => {
      return array.map(genre => genre.name);
    };

    /**
     * [method description]
     * @type {Object}
     */
    common.method = {
      get: (endPoint, extras = '') => {
        return $http({
          method: 'GET',
          url: common.urls.api + endPoint + common.apiKey + extras,
        }).then(response => {
          common.response = response.data;
        });
      },
    };

    return common;
  } //end of common
})(angular);
