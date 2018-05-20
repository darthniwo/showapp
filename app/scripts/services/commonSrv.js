'use strict';
(function(angular) {
  angular
    .module('showapp')
    .factory('commonSrv', ['$http', '$cookies', 'alertify', commonSrv]);

  function commonSrv($http, $cookies, alertify) {
    const common = {maps: {}};

    /**
     * [urls: General endpoint urls of the API]
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
      movieDetail: '/movie/',
      tvDetail: '/tv/',
    };
    /**
     * [apiKey: Required key for API use]
     * @type {String}
     */
    common.apiKey = '?api_key=09b9ece1e65a600aca53a9b246cedd9e';

    /**
     * [years: Array of year values used in filters section]
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
     * [response: General internal variable in which every call response will be stored]
     * @type {[Depending on the response: Array - Object]}
     */
    common.response = null;

    /**
     * [toMap: Method to construct an map object with the key provided]
     * @param  {[Array]} array   [Array of elements to be mapped]
     * @param  {[String]} mapName [Desired map name, it will be used as key to access the map]
     * @param  {[String]} key     [Parameter to be used as main object key for the map]
     * @return {[Object]}         [Resulting object map]
     */
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
     * [truncate: method for truncating strings]
     * @param  {[String]} str   [String to be truncated]
     * @param  {[Integer]} chars [Desired character length for truncating the string]
     * @return {[String]}       [Truncated string with an ellipsis at the end]
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
     * [getMovieGenres: Method to retrieve the genres used in movie search]
     * @return {[Object]} [Map object with the original array, located in {src} key ]
     */
    common.getMovieGenres = () => {
      return common.method.get(common.urls.movieGenres).then(() => {
        const {genres} = common.response;
        common.toMap(genres, 'movieGenres', 'id');
      });
    };

    /**
     * [getTVGenres: Method to retrieve the genres used in movie search]
     * @return {[Object]} [Map object with the original array, located in {src} key ]
     */
    common.getTVGenres = () => {
      return common.method.get(common.urls.tvGenres).then(() => {
        const {genres} = common.response;
        common.toMap(genres, 'tvGenres', 'id');
      });
    };

    /**
     * [getSelectedGenresIds: Method to get the ids of the selected genres in the filter]
     * @param  {[Array]} array [Object's array of the selected genres]
     * @return {[Array]}       [Array of ids]
     */
    common.getSelectedGenresIds = array => {
      return array.map(genre => genre.id);
    };

    /**
     * [method: General Methods object, only uses get for now]
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
