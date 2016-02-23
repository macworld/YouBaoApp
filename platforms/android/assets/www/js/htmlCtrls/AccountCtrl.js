/**
 * Created by wujin on 2015/12/1.
 * 用于个人账户信息界面的展示
 */

rootModule.controller('AccountCtrl', function($scope,$state,$rootScope,LoginoutService,$ionicPopup) {

    $scope.$on('$ionicView.beforeEnter',function(){
        if($rootScope.isLogin==false)
        {
            $state.go('login');
        }
    });

    $scope.onLogout=function(){
        //一旦用户退出登录后，强制关闭自动登录和记住密码？
        //查看是否有记住密码和自动登录的设置，询问用户是否保留这些设置
        if(LoginoutService.isPasswordRecord() || LoginoutService.isAutoLogin())
        {
            $ionicPopup.show({
                template: '检测到您设置了"记住密码"或“自动登录”，请问在退出后是否保留这些设置',
                title: '用户提示',
                scope: $scope,
                buttons: [
                    {
                        text: '不保留',
                        onTap: function(){
                            LoginoutService.clearLoginConfig();
                            logout();
                        }
                    },
                    {
                        text: '<b>保留</b>',
                        type: 'button-positive',
                        onTap: function(){
                            logout();
                        }
                    }
                ]
            });
        }
    };


    var logout=function(){
        $rootScope.isLogin=false;
        $state.go('login');
    };

    $scope.userInfo=$rootScope.userInfo;
    //替换默认的用户头像
    if(typeof($scope.userInfo)!="undefined")
    {
        if(!$scope.userInfo.image_name)
        {
            $scope.userInfo.image_name="img/default.png";
        }

    }






});
