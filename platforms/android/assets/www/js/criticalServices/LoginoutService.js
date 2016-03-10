/**
 * Created by wujin on 2015/12/2.
 */

//该服务用于登录和登出的相关逻辑处理
rootService.factory('LoginoutService',function($ionicPopup,$cordovaToast,$http,$rootScope,LocalStorage,NetworkStateService,$state,Bank,$ionicLoading){

    //该服务将记录上一次登录的信息，包括登录的phone，date，password(需要加密)
    var LAST_LOGIN='last_login';
    var PASSWORD_RECORD='password_record';
    var AUTO_LOGIN='auto_login';
    //最长可以多久不登录就停止自动登录
    var MAX_AUTOLOGIN_DAY=7;
    //不连接服务器的登录，该登录仅仅适用于刚刚注册完成的用户
    var loginWithoutConnect=function(password)
    {
        //服务器端已经自动登录，所以这边只要设置本地的登录状态
        $rootScope.isLogin=true;
        saveLoginInfo(password);
    };


    //常规登录 loginConfig中包含对于记住密码和自动登录的设定
    var loginWithPassword=function(phone,password,loginConfig)
    {
        $ionicLoading.show({
            template: '登录中...'
        });
        var $url='https://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/Loginout/login';
        $data={
            'phone': phone,
            'password': password
        };
        angular.toJson($data);
        $http({
            method: 'POST',
            url: $url,
            data: $data
        }).
            success(function(data, status, headers, config)
            {
                switch (status)
                {
                    case 204:
                        $ionicPopup.alert({
                            title: '提示',
                            template: '用户不存在'
                        });
                        break;
                    case 200:
                        $ionicLoading.hide();
                        angular.fromJson(data);
                        $rootScope.userInfo=data;
                        console.log(data);
                        //服务器端已经自动登录，所以这边只要设置本地的登录状态
                        $rootScope.isLogin=true;
                        $cordovaToast.showShortCenter("登录成功");
                        setBankData(data);
                        saveLoginInfo(password);
                        if($rootScope.forceLogin)
                        {
                            //强制跳回
                            $rootScope.forceLogin=false;
                            $rootScope.goBack();
                        }
                        else
                        {
                            //正常登录
                            $state.go("tab.account");
                            //本地设置是否记住密码和自动登录
                            processLoginConfig(loginConfig);
                        }

                        break;
                }
            }).
            error(function(data, status, headers, config)
            {
                $ionicLoading.hide();
                switch(status){
                    case 403:
                        $ionicPopup.alert({
                            title: '提示',
                            template: '账号/密码错误'
                        });
                        break;
                    default:
                        NetworkStateService.defaultStatusProcess(status);
                        break;
                }
            });
    };

    //用于处理记住密码和自动登录的设置，只有每次正常登录成功时这些值才会被记住
    var processLoginConfig=function(loginConfig){
        LocalStorage.set(PASSWORD_RECORD,loginConfig.password_record);
        LocalStorage.set(AUTO_LOGIN,loginConfig.auto_login);
        console.log(LocalStorage.get(AUTO_LOGIN,false));
    };



    var saveLoginInfo=function(password){
        var currDate=new Date().toLocaleDateString();
        var b = new Base64();
        //使用两遍base64加密
        var password_base64 = b.encode(b.encode(password));
        //存储本次登录的信息，该信息将用于之后的自动登录
        var loginInfo={
            'phone': $rootScope.userInfo.phone,
            'date':  currDate,
            'password': password_base64
        };
        console.log(loginInfo);
        //存储登录信息
        LocalStorage.setObject(LAST_LOGIN,loginInfo);
    };

    //使用上一次的登录信息登录，该功能用于用户平时的自动登录
    var loginWithLastInfo=function(){
        var loginInfo=LocalStorage.getObject(LAST_LOGIN);
        if(loginInfo)
        {
            //有上一次的登录信息，判断上一次登录和本次登录之间的时间间隔，超过一周则需要重新登录
            $old_date=loginInfo.date;
            $currDate=new Date().toLocaleDateString();

            $diff=dateDiff($old_date,$currDate);
            if($diff<MAX_AUTOLOGIN_DAY)
            {
                //密码错误处理与常规登录稍有不同，因而无法复用常规登录
                var b = new Base64();
                var password= b.decode(b.decode(loginInfo.password));
                var $url='https://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/Loginout/login';
                $data={
                    'phone': loginInfo.phone,
                    'password': password
                };
                angular.toJson($data);
                $http({
                    method: 'POST',
                    url: $url,
                    data: $data
                }).
                    success(function(data, status, headers, config)
                    {
                        switch (status)
                        {
                            case 204:
                                $cordovaToast.showShortCenter("您的账号信息近期发生变动，请重新登录");
                                break;
                            case 200:
                                angular.fromJson(data);
                                console.log(data);
                                $rootScope.userInfo=data;
                                //服务器端已经自动登录，所以这边只要设置本地的登录状态
                                $rootScope.isLogin=true;
                                $cordovaToast.showShortCenter("自动登录成功");
                                setBankData(data);
                                saveLoginInfo(password);
                                break;
                        }
                    }).
                    error(function(data, status, headers, config)
                    {
                        switch(status){
                            case 403:
                                $cordovaToast.showShortCenter("您的账号信息近期发生变动，请重新登录");
                                break;
                            default:
                                $cordovaToast.showShortCenter("自动登录失败，请检查您的网络状态");
                                break;
                        }
                    });
            }
            else
            {
                $cordovaToast.showShortCenter("您的账号太久没有使用，请重新登录");
            }
        }
        //没有上一次的登录信息
    };
    //获取两个日期之间的天数差
    var dateDiff=function(DateOne,DateTwo)
    {
        var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('/'));
        var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('/')+1);
        var OneYear = DateOne.substring(0,DateOne.indexOf ('/'));


        var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('/'));
        var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('/')+1);
        var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('/'));


        var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);
        return Math.abs(cha);
    };

    var isPasswordRecord=function(){
        //将返回值直接强行创建bool值，这样可以避免字符串形式的'true'带来的问题
        var password_record=LocalStorage.get(PASSWORD_RECORD,false);
        return password_record==='true';
    };

    var isAutoLogin=function(){
        var auto_login=LocalStorage.get(AUTO_LOGIN,false);
        return auto_login==='true';
    };

    var getRecordedPassword=function(){
        //判断是否记录了密码
        if(isPasswordRecord())
        {
            $lastLoginInfo=LocalStorage.getObject(LAST_LOGIN);
            if($lastLoginInfo)
            {
                var b = new Base64();
                return b.decode(b.decode($lastLoginInfo.password));
            }
            else
            {
                return null;
            }
        }
        else
        {
            return null;
        }
    };

    var getLastLoginPhone=function(){
        $lastLoginInfo=LocalStorage.getObject(LAST_LOGIN);
        console.log($lastLoginInfo);
        if($lastLoginInfo==null)
        {
            return null;
        }
        else
        {
            return parseInt($lastLoginInfo.phone);
        }

    };
    //该函数用于清空记住密码和自动登录
    var clearLoginConfig=function(){
        LocalStorage.set(PASSWORD_RECORD,false);
        LocalStorage.set(AUTO_LOGIN,false);
    };

    var setBankData=function($data)
    {
        if(typeof($data.bank_card_info)!='undefined')
        {
            Bank.readDataFromLogin($data.bank_card_info);
        }
    };

    //用于检测用户时候已经登录，对于未登录的跳转到登录页面
    var hasLogin=function(){
        if($rootScope.isLogin==false)
        {
            $state.go('login');
            return false;
        }
        return true;
    };

    return{
        loginWithoutConnect: loginWithoutConnect,
        loginWithPassword: loginWithPassword,
        loginWithLastInfo: loginWithLastInfo,
        isPasswordRecord: isPasswordRecord,
        isAutoLogin: isAutoLogin,
        getRecordedPassword: getRecordedPassword,
        getLastLoginPhone: getLastLoginPhone,
        clearLoginConfig: clearLoginConfig,
        hasLogin: hasLogin
    }

});
