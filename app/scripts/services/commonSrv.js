'use strict';
(function(angular) {
  angular
    .module('showapp')
    .factory('commonSrv', ['$http', '$cookies', 'alertify', commonSrv]);

  function commonSrv($http, $cookies, alertify) {
    const common = {maps: {}};

    common.urls = {
      api: 'https://api.themoviedb.org/3',
      movieGenres: '/genre/movie/list',
      tvGenres: '/genre/tv/list',
      series: '/discover/tv',
      movies: '/discover/movie',
      movieSearch: '/search/movie',
      tvSearch: '/search/tv',
    };
    common.apiKey = '?api_key=09b9ece1e65a600aca53a9b246cedd9e';
    common.response = null;

    common.toMap = (array, mapName, key) => {
      if (!common.maps[mapName]) {
        common.maps[mapName] = {};
      }
      array.forEach(item => {
        common.maps[mapName][item[key]] = item;
      });
      common.maps[mapName]['src'] = array;
      //return common.maps[mapName];
    };

    common.getMovieGenres = () => {
      return common.method.get(common.urls.movieGenres).then(() => {
        const {genres} = common.response;
        common.toMap(genres, 'movieGenres', 'id');
      });
    };

    common.getTVGenres = () => {
      return common.method.get(common.urls.tvGenres).then(() => {
        const {genres} = common.response;
        common.toMap(genres, 'tvGenres', 'id');
      });
    };

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
