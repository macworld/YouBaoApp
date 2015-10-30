/**
 * Created by wujin on 2015/10/28.
 * 登录界面的控制器
 */

rootModule.controller('LoginCtrl', function($scope,$http,$rootScope,$state,$ionicTabsDelegate) {
    $scope.normalLogin=true;
//    $scope.onMsgLogin=function(){
//        $scope.normalLogin=false;
//    };
//    $scope.onNormalLogin=function(){
//        $scope.normalLogin=true;
//    };

    $scope.selectTabWithIndex = function(index) {
        $ionicTabsDelegate.select(index);
        if(index==0)
        {
            $scope.normalLogin=true;
        }
        else
        {
            $scope.normalLogin=false;
        }
    }
});
