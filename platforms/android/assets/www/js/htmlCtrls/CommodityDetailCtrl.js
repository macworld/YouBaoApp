/**
 * Created by wujin on 2015/11/5.
 * 该控制器对应商品细节页面的控制
 */


rootModule.controller('CommodityDetailCtrl',function($scope,$stateParams,$rootScope){
    //从传入页面的参数中获取商品ID
    $scope.id=$stateParams.commodityId;
});
