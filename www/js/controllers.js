//该文件用于存放一些比较简单的控制器逻辑
var rootModule = angular.module('ZhangYouBao.controllers',[])

.controller('DashCtrl', function($scope) {})

.controller('AccountCtrl', function($scope,$state,$rootScope) {


    $scope.$on('$ionicView.beforeEnter',function(){
        if(typeof ($rootScope.isLogin) ==undefined || $rootScope.isLogin==false)
        {
            $state.go('login');
        }
    });

})

.controller('HomeCtrl', function($scope,$state) {
    $scope.hasMessage=true;
    $scope.onHomeSelect=function()
    {
        console.log('in');
        $state.go('tab.home');
    };
})



.controller('SearchCtrl', function($scope) {
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

