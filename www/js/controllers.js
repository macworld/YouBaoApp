//该文件用于存放一些比较简单的控制器逻辑
var rootModule = angular.module('ZhangYouBao.controllers',[])

.controller('DashCtrl', function($scope) {})



.controller('HomeCtrl', function($scope,$state,NetworkStateService,$ionicPlatform,LoginoutService) {
    $scope.hasMessage=true;
    $scope.onHomeSelect=function()
    {
        $state.go('tab.home');
    };

    //点击挂单
    $scope.onClickAddTrade=function()
    {
        if(LoginoutService.hasLogin())
        {
            $state.go("add-trade");
        }
//        $state.go("add-trade");

    }



})



.controller('SearchCtrl', function($scope,$ionicHistory,$rootScope) {
    $scope.search_click=function()
    {

    };
    setTimeout(function(){

    },300);

})
//全局控制器
.controller('TotalCtrl', function($scope,$state,$rootScope) {
    $rootScope.hideTabs=false;
});

