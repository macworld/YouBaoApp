/**
 * Created by wujin on 2015/10/29.
 * 用于实名验证的功能实现
 */
rootModule.controller('CertificationCtrl', function($scope,$http,$rootScope,$state,Bank){
    //用于检测输入是否为中文
    $scope.isChinese=true;
    $scope.detectName=function(name){
        //中文的正则表达式
        var pattern=/^[\u4E00-\u9FA5]*$/;
        if(typeof(name)=='undefined'){
            $scope.isChinese=false;
            return;
        }
        if(pattern.test(name)){
            $scope.isChinese=true;
        }
        else{
            $scope.isChinese=false;
        }
    };

    $scope.isValidIdCard=true;
    $scope.detectIdCard=function(idCard){
        console.log(idCard);
        //身份证的正则表达式
        var pattern=/(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(typeof(idCard)=='undefined'){
            $scope.isValidIdCard=false;
            return;
        }
        if(pattern.test(idCard)){
            $scope.isValidIdCard=true;
            console.log('true');
        }
        else{
            $scope.isValidIdCard=false;
            console.log('false');
        }
    };

    //用于输入失去焦点时判断用户的输入是否
    $scope.isCardIdValid=new Array($rootScope.maxCardNum);
    for(var i=0;i<$rootScope.maxCardNum;++i){{
        $scope.isCardIdValid[i]=true;
    }}

    $scope.detectCardNum=function(num,index){
        //银行卡号目前认定为16或19位，以后具体银行具体分析
        var pattern = /(^\d{16}$)|(^\d{19}$)/;
        console.log(num);
        if(pattern.test(num)){
            $scope.isCardIdValid[index]=true;
        }
        else{
            $scope.isCardIdValid[index]=false;
        }
    };

    $scope.bankCardInfos=Bank.getBankCardInfos();

    //提交功能注意点:
    //1.需要对所有的数据valid再进行一次检测，只有所有都通过时,才能正确提交
    //2.已实测过，先触发onclick，之后在触发其他元素的onblur,所以一定要全部再测试一次，因为无法确定用户在提交之前操作的是哪一个元素
    //3.这边银行卡所有的数据操作都是在bank服务的数据上直接操作的，这样存在一个问题，
    // 当用户退出本次注册时，残留的注册信息依然存在，那么是否应该清空，还是就这么保留，方便用户注册失败时重新注册
    //如果保留，那么一定要注意说明这些信息的有效性
    $scope.onSubmit=function(){
    };


    //cacheFactory 可以用于不同的页面的之间的数据传递，每次进行实名验证初始化设置
//    var cache=$cacheFactory.get('BankCache');
//    if(typeof (cache)=='undefined'){
//        cache=$cacheFactory('BankCache');
//        cache.put('bankIds',[0,-1,-1]);
//    }
//    $scope.bankIds=cache.get('bankIds');



});