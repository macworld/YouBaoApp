/**
 * Created by wujin on 2015/10/28.
 * 用于控制用户的注册信息
 */


rootModule.controller('RegisteCtrl', function($scope,$http,$rootScope,$ionicPopup,TelphoneNum,DetectNum,
                                              $interval,Password,$state,$cordovaToast,NetworkStateService,LoginoutService) {


    //对于已登录的账号不需要在进行注册了
    if($rootScope.login){
        $state.go("tab.account");
    }
    //将快速注册过程设置为三个阶段
    //1.填写手机号，点击按钮后发送手机验证码
    //2.填写验证码，点击按钮后进入下一步
    //3.设置密码
    $scope.registeStateIndex=1;

    //part 1  手机号相关逻辑
    $scope.state1Submit=function(tel){
        //进行手机数字的验证
        console.log(tel);
        if(TelphoneNum.isTelNum(tel)){
            //无法发送验证码
            if($rootScope.msgResendRemain!=0){
                $ionicPopup.alert({
                    title: '提示',
                    template:'请等待计时结束后重发验证码',
                    okText: '确认'
                });
            }
            else{
                requestSecurityCode(tel);
            }

        }
    };

    //向服务器端发送获取验证码的
    var requestSecurityCode=function(tel){
        //请求验证码
        var $url='http://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/Register/getSecurityCode';
        $http({
            method: 'GET',
            url: $url,
            params: {
                'phone': tel
            }
        }).
            success(function(data, status, headers, config)
            {
                $scope.registeStateIndex=2;
                $scope.telNum=tel;
                $rootScope.msgResendRemain=$rootScope.msgResendSeconds;
                secondCount=$interval(function(){
                    if($rootScope.msgResendRemain!=0) {
                        $rootScope.msgResendRemain--;
                    }
                    else{
                        $interval.cancel(secondCount);
                    }
                },1000);
                $cordovaToast.showShortCenter("验证码已发送到您的手机，请注意查收");

            }).
            error(function(data, status, headers, config)
            {
                console.log(status);
                console.log(data);
                switch(status){
                    case 403:
                        $ionicPopup.alert({
                            title: '提示',
                            template: '过于频繁的验证码请求，请稍等1分钟重新尝试'
                        });
                        break;
                    case 409:
                        $ionicPopup.alert({
                            title: '提示',
                            template: '该手机号已被注册'
                        });
                        break;
                    default:
                        NetworkStateService.defaultStatusProcess(status);
                        break;
                }
            });

    };



    //part 2  验证码相关逻辑
    $scope.state2Submit=function(num){
        console.log(num);
        if(DetectNum.isDetectNum(num)){
            verificationSecurityCode(num);

        }
    };

    //用于向服务器提交验证码
    var verificationSecurityCode=function(code){
        var $url='http://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/Register/verificationSecurityCode';
        $http({
            method: 'GET',
            url: $url,
            params: {
                'phone': $scope.telNum,
                'code': code
            }
        }).
            success(function(data, status, headers, config)
            {
                $scope.registeStateIndex=3;
                $cordovaToast.showShortCenter("验证通过，请设置登录密码");
            }).
            error(function(data, status, headers, config)
            {
                console.log(status);
                console.log(data);
                switch(status){
                    case 400:
                        $ionicPopup.alert({
                            title: '提示',
                            template: '验证码错误'
                        });
                        break;
                    case 406:
                        $ionicPopup.alert({
                            title: '提示',
                            template: '该验证码已过期，请尝试重新申请'
                        });
                        break;
                    default:
                        NetworkStateService.defaultStatusProcess(status);
                        break;
                }
            });
    };

    //重发验证码
    $scope.reSendMsg=function(){
        requestSecurityCode($scope.telNum);
        $rootScope.msgResendRemain=$rootScope.msgResendSeconds;
        secondCount=$interval(function(){
            if($rootScope.msgResendRemain!=0) {
                $rootScope.msgResendRemain--;
            }
            else{
                $interval.cancel(secondCount);
            }
        },1000);
    };



    //part 3  密码界面相关逻辑
    //用于检测密码输入是否过短
    $scope.pwTooShort=false;
    $scope.isSame=true;

    //因为ionic框架本身的问题，使用原始的变量监控会失败，只有使用这种类似于成员变量的形式监控才能生效
    $scope.pw={confrim: "",value: ""};
    //只做长度相等时候的比较，其他时候太明显，不比较了
    $scope.$watch('pw.confrim',function(newValue){

        if(newValue.length==$scope.pw.value.length){
            if(newValue!=$scope.pw.value){
                $scope.isSame=false;
            }
            else{
                $scope.isSame=true;
            }
        }
    });

    //丢失focus时检测密码长度
    $scope.checkPw=function(password){
        if(password.length<6){
            $scope.pwTooShort=true;
        }
    };
    //输入获得焦点后提示消失
    $scope.resetTip=function(){
        $scope.pwTooShort=false;
    };

    $scope.state3Submit=function(password,confirm){
        if(password!=confirm){
            $scope.isSame=false;
            return;
        }
        if(Password.isValid(password)){
            //密码有效，向服务器提交密码
            transferPassword(password)
        }
    };


    //用于向服务器提交密码
    var transferPassword=function(password){
        var $url='https://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/Register/processPassword';
        $data={
            'phone': $scope.telNum,
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
                angular.fromJson(data);
                $rootScope.userInfo=data;
                $rootScope.userInfo.phone=$scope.telNum;
                //新注册用户的权限等级为0
                $rootScope.userInfo.level=0;
                console.log($rootScope.userInfo);
                //触发登录操作
                LoginoutService.loginWithoutConnect(password);
                showSuccess();
            }).
            error(function(data, status, headers, config)
            {
                console.log(status);
                console.log(data);
                switch(status){
                    case 406:
                        $ionicPopup.alert({
                            title: '提示',
                            template: '该验证码已过期，请尝试重新申请'
                        });
                        break;
                    case 409:
                        $ionicPopup.alert({
                            title: '提示',
                            template: '该手机号已被注册'
                        });
                        break;
                    default:
                        NetworkStateService.defaultStatusProcess(status);
                        break;
                }
            });
    };



    var showSuccess=function(){
        $ionicPopup.confirm({
            title: '快速注册成功',
            template: '恭喜您，注册成功！建议您继续进行会员充值和实名认证，实名认证后方可进行挂单操作，新用户会员期限充一送一！！！（您也可以随时在"个人"页面中进行会员充值和实名认证）',
            cancelText: '以后再说',
            okText: '会员充值'
        }).then(function(result){
            $rootScope.isLogin=true;
            if(result){
                //点击确认后弹入会员状态页面
                $state.go("vip-state");
            }
            else{
               $state.go("tab.account");
            }
        });
    };

});