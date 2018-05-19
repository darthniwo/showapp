'use strict';

(function (angular) {
  angular.module('showapp').controller('seriesCtrl', ['$scope', 'alertify', 'commonSrv', 'localStorageService', seriesCtrl]);

  function seriesCtrl($scope, alertify, commonSrv, localStorageService) {
    const ctrl = this,
          common = commonSrv,
          ls = localStorageService;

    function init() {
      console.log('seriesCtrl');
      ctrl.getInitialList();
    }

    ctrl.state = {
      series: null,
      currentPage: 1,
      totalItems: 0,
      totalPages: 0
    };

    ctrl.getInitialList = () => {
      common.method.get(common.urls.series).then(() => {
        const { results, total_pages, total_results } = common.response;
        ctrl.state.series = results;
        ctrl.state.totalItems = total_results;
        ctrl.state.totalPages = total_pages;
      });
    };

    init();
  }
})(angular);
//# sourceMappingURL=seriesCtrl.js.map
