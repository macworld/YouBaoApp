/**
 * Created by wujin on 2015/10/28.
 * 登录界面的控制器
 */

rootModule.controller('LoginCtrl', function($scope,$http,$rootScope,$state,$ionicTabsDelegate,LoginoutService,TelphoneNum,Password) {
    $scope.normalLogin=true;

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
    };
    //如果已经登录则跳回
    if($rootScope.isLogin){
        $state.go("tab.account");
    }

    var password_record=LoginoutService.isPasswordRecord();
    var auto_login=LoginoutService.isAutoLogin();
    $scope.loginConfig={
        'password_record': password_record,
        'auto_login': auto_login
    };
    console.log($scope.loginConfig);
    //记住密码的显示
    if(password_record)
    {
        //界面上密码显示
        var password=LoginoutService.getRecordedPassword();
        if(password)
        {
            $scope.password=password;
        }
    }
    //上次登录手机号码的自动显示
    $scope.phone=LoginoutService.getLastLoginPhone();


    $scope.login=function(phone,password){
        if(TelphoneNum.isTelNum(phone) && Password.isValid(password))
        {
            LoginoutService.loginWithPassword(phone,password,$scope.loginConfig);
        }
    }


});
