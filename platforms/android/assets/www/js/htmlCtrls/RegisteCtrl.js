/**
 * Created by wujin on 2015/10/28.
 * 用于控制用户的注册信息
 */


rootModule.controller('RegisteCtrl', function($scope,$http,$rootScope,$ionicPopup,TelphoneNum,DetectNum,$interval,Password,$state) {
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
            }

        }
    };




    //part 2  验证码相关逻辑
    $scope.state2Submit=function(num){
        //进行手机数字的验证
        console.log(num);
        if(DetectNum.isDetectNum(num)){
            $scope.registeStateIndex=3;
        }
    };
    $scope.reSendMsg=function(){
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

    $scope.state3Submit=function(password,confrim){
        if(password!=confrim){
            $scope.isSame=false;
            return;
        }
        if(Password.isValid(password)){
            showSuccess();
        }
    };



    var showSuccess=function(){
        $ionicPopup.confirm({
            title: '快速注册成功',
            template: '恭喜您，注册成功！建议您继续进行实名认证，实名认证后方可进行挂单、交易等操作，并且免费获赠1个月VIP体验！！！',
            cancelText: '以后再说',
            okText: '实名认证'
        }).then(function(result){
            $rootScope.isLogin=true;
            if(result){//点击确认
               console.log("实名认证");
            }
            else{
               $state.go("tab.account");
            }
        });
    };

});