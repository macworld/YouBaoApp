/**
 * Created by wujin on 2015/10/29.
 * 用于实名验证的功能实现
 */
rootModule.controller('CertificationCtrl', function($scope,$http,$rootScope,$state,Bank,
                                                    CameraService,$ionicActionSheet,$cordovaCamera,
                                                    $ionicScrollDelegate){
    //用于检测输入是否为中文
    $scope.isChinese=true;
    //将所有验证的输入信息绑定在成员变量中，从而可以关联到，如果直接用$scope.name，无法关联
    $scope.certInfo={
        name:"",
        idCardNo:"",
        sex: "男"
    };
    $scope.detectName=function(name){
        //中文的正则表达式
        var pattern=/^[\u4E00-\u9FA5]*$/;
        if(typeof(name)=='undefined'){
            $scope.isChinese=false;
            return false;
        }
        if(name.length<=1){
            $scope.isChinese=false;
            return false;
        }
        if(pattern.test(name)){
            $scope.isChinese=true;
            return true;
        }
        else{
            $scope.isChinese=false;
            return false;
        }
    };


    $scope.isValidIdCard=true;
    $scope.detectIdCard=function(idCard){
//        console.log(idCard);
        //身份证的正则表达式
        var pattern=/(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(typeof(idCard)=='undefined'){
            $scope.isValidIdCard=false;
            return false;
        }
        if(pattern.test(idCard)){
            $scope.isValidIdCard=true;
            return true;
        }
        else{
            $scope.isValidIdCard=false;
            return false;
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
//        console.log(num);
        if(pattern.test(num)){
            $scope.isCardIdValid[index]=true;
            return true;
        }
        else{
            $scope.isCardIdValid[index]=false;
            return false;
        }
    };

    //传入参数，type
    //一个string类型的输入参数，用于标记该响应的不同触发
    //使用一个map来存储临时的照片数据，key为type，value为照片URL
    //"ID_FRONT”  身份证正面照
    //"ID_BACK"   身份证反面照
    //"ID_PEOPLE"  身份证和人的合照
    //注意：拍摄的照片andoird会存储在externalCache中，一定要注意去清理,目前暂时还未清理
    $scope.imgUrls=[];
    $scope.ImgInfos=[{
            type:"ID_FRONT",
            name: "身份证正面照"
        },{
            type:"ID_BACK",
            name: "身份证反面照"
        },{
            type: "ID_PEOPLE",
            name: "手持身份证照"
        }
    ];
    //设置的图像的质量
    var img_quality=50;
    $scope.onAddImg = function(type) {
//        console.log(type);
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<b>拍照</b>' },
                { text: '<b>相册</b>' }
            ],
//            destructiveText: 'Delete',
            titleText: '<b>图片发送</b>',
            cancelText: '<b>取消</b>',
            cancel: function() {
            // add cancel code..
            },
            buttonClicked: function(index) {
                var options=CameraService.optionsGenerate(index,img_quality);
                $cordovaCamera.getPicture(options).then(function(imageUrl) {

                    $scope.imgUrls[type]=imageUrl;
//                    console.log($scope.imgUrls);
                });
                return true;
            }
        });

    };

    $scope.onCancelImg=function(type){
        $scope.imgUrls[type]=undefined;
    };

    $scope.bankCardInfos=Bank.getBankCardInfos();
    $scope.maxCardNum=$rootScope.maxCardNum;
    $scope.addCard=function(id){
        if(id>=$rootScope.maxCardNum){
            return;
        }
        Bank.addBankCard(id);
        $ionicScrollDelegate.scrollBottom();
    };

    $scope.minusCard= function () {
        if($scope.bankCardInfos.length==1){
            console.error("无效的删除操作");
            return;
        }
        $scope.bankCardInfos.pop();
        $ionicScrollDelegate.scrollBottom();
    };

    //提交功能注意点:
    //1.需要对所有的数据valid再进行一次检测，只有所有都通过时,才能正确提交
    //2.已实测过，先触发onclick，之后在触发其他元素的onblur,所以一定要全部再测试一次，因为无法确定用户在提交之前操作的是哪一个元素
    //3.这边银行卡所有的数据操作都是在bank服务的数据上直接操作的，这样存在一个问题，
    // 当用户退出本次注册时，残留的注册信息依然存在，那么是否应该清空，还是就这么保留，方便用户注册失败时重新注册
    //如果保留，那么一定要注意说明这些信息的有效性
    $scope.onSubmit=function(){
        //1.检测所有数据是否填写，并且是否有效
        //这边是使用页面的结构特性直接跳转顶部和底部，更复杂的应用可以给每个scroll元素加上标签，可跳转到对应元素，详见$ionicScrollDelegate的说明
        //检测姓名
//        console.log($scope.certInfo);
        if(!$scope.detectName($scope.certInfo.name)){
            $ionicScrollDelegate.scrollTop();
            return;
        }
        //检测身份证号
        if(!$scope.detectIdCard($scope.certInfo.idCardNo)){
            $ionicScrollDelegate.scrollTop();
            return;
        }
        //检测三张照片
        //length对于map类型的数组并不适用
        var countImg=0;
        for(var i in $scope.imgUrls){
            if($scope.imgUrls[i]!=undefined){
                countImg++;
            }

        }
        if(countImg!=3) {
            window.plugins.toast.showShortBottom("请完成所有身份证照片的添加");
            $ionicScrollDelegate.scrollTop();
            return;
        }
        //检测银行卡号
        for(var i=0;i<$scope.bankCardInfos.length;i++){
            var result=$scope.detectCardNum($scope.bankCardInfos[i].cardId,i);
            if(!result){
                $ionicScrollDelegate.scrollBottom();
                return;
            }
        }
        //所有检测通过
        window.plugins.toast.showShortBottom("提交成功");



    };


    //cacheFactory 可以用于不同的页面的之间的数据传递，每次进行实名验证初始化设置
//    var cache=$cacheFactory.get('BankCache');
//    if(typeof (cache)=='undefined'){
//        cache=$cacheFactory('BankCache');
//        cache.put('bankIds',[0,-1,-1]);
//    }
//    $scope.bankIds=cache.get('bankIds');



});