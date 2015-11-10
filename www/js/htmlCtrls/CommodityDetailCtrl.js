/**
 * Created by wujin on 2015/11/5.
 * 该控制器对应商品细节页面的控制
 */


rootModule.controller('CommodityDetailCtrl',function($scope,$stateParams,$rootScope,$ionicPopup){
    //从传入页面的参数中获取商品ID
    $scope.id=$stateParams.commodityId;
    $scope.onApplyTrade=function(){
        $ionicPopup.confirm({
            title: '申请交易提示',
            template: '请在洽谈成功后(本平台上私信洽谈或者电话洽谈)根据约定好的细节申请交易，只有双方都同意该交易申请，交易方可生效。',
            cancelText: '取消',
            okText: '确认申请'
        }).then(function(result){
            if(result){//点击确认
            }
            else{
            }
        });
    };

    $scope.isCollected=false;
    $scope.changeCollect=function(){
      $scope.isCollected=!$scope.isCollected;
      if($scope.isCollected){
        window.plugins.toast.showShortBottom("完成收藏");
      }else{
        window.plugins.toast.showShortBottom("取消收藏");
      }
    };
});
