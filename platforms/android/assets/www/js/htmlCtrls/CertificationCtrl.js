/**
 * Created by wujin on 2015/10/29.
 * 用于实名验证的功能实现
 */
rootModule.controller('CertificationCtrl', function($scope,$http,$rootScope,$state,Bank,$ionicPopup,
                                                    CameraService,$ionicActionSheet,$cordovaCamera,
                                                    $ionicScrollDelegate,$cordovaFileTransfer,$ionicLoading,$cordovaToast){
    //用于检测输入是否为中文
    $scope.isChinese=true;
    //将所有验证的输入信息绑定在成员变量中，从而可以关联到，如果直接用$scope.name，无法关联
    $scope.certInfo={
        user_id: $rootScope.userInfo.user_id,
        name:"",
        idCardNo:"",
        sex: "男",
        address: null
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

    $scope.detectAddress=function(){
        if($scope.certInfo.address==null || $scope.certInfo.address.length<5)
        {
            $ionicScrollDelegate.scrollTop();
            $ionicPopup.alert({
                title: '提交失败',
                template: '请输入合法的通信地址，不得少于5个字'
            });
            return false;
        }
        return true;
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
            type: "ID_PEOPLE",
            name: "手持身份证照"
        }
    ];
    $scope.onAddImg = function(type) {
//        console.log(type);
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<b>拍照</b>' },
                { text: '<b>相册</b>' }
            ],
//            destructiveText: 'Delete',
            titleText: '<b>图片选择</b>',
            cancelText: '<b>取消</b>',
            cancel: function() {
            // add cancel code..
            },
            buttonClicked: function(index) {
                var options=CameraService.optionsGenerate(index);
                $cordovaCamera.getPicture(options).then(function(imageUrl) {

                    $scope.imgUrls[type]=imageUrl;
                    //console.log($scope.imgUrls);
                });
                return true;
            }
        });


    };

    $scope.onCancelImg=function(type){
        $scope.imgUrls[type]=undefined;
    };

    $scope.bankCardInfos=angular.copy(Bank.getBankCardInfos());
    $scope.maxCardNum=$rootScope.maxCardNum;
    $scope.addCard=function(id){
        if(id>=$rootScope.maxCardNum){
            return;
        }
        Bank.addInputBankCard(id,$scope.bankCardInfos);
        $ionicScrollDelegate.scrollBottom();
    };

    $scope.minusCard= function () {
        Bank.minusInputBankCard($scope.bankCardInfos);
        $ionicScrollDelegate.scrollBottom();
    };

    $scope.onChangeBank=function(id){
        //保存即将更改的银行卡信息
        Bank.onChangeBank(id,$scope.bankCardInfos);
        $state.go("bankChoose");
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
        if(countImg!=$scope.ImgInfos.length) {
            window.plugins.toast.showShortBottom("请完成所有身份证照片的添加");
            $ionicScrollDelegate.scrollTop();
            return;
        }
        //检测银行卡号
        for(var i=0;i<$scope.bankCardInfos.length;i++){
            var result=$scope.detectCardNum($scope.bankCardInfos[i].card_id,i);
            if(!result){
                $ionicScrollDelegate.scrollBottom();
                return;
            }
        }

        //检测通信地址
        if(!$scope.detectAddress())
        {
            return;
        }
        //所有检测通过
        //1.先上传图片

        $ionicLoading.show({
            template: '数据上传中，图片文件较大，请耐心等候...'
        });
        uploadImages();//2.等待图片提交成功，提交参数



    };

    //上传实名认证的图片
    var uploadImages=function(){
        $server='https://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/Upload/uploadVerificationImages';
        $scope.imageNames=[];
        var isError=false;//记录当前是否发生错误
        $scope.upload_success_num=0;
        for($i=0;$i<$scope.ImgInfos.length;$i++)
        {
            var options = {
                params: {id: $i}
            };
            $cordovaFileTransfer.upload($server, $scope.imgUrls[$scope.ImgInfos[$i].type], options,true)
                .then(function(result) {
                    console.log(result);
                    //返回信息采取id+，+filename的形式编码
                    var return_data=result.response.split(',');

                    $scope.imageNames[Number(return_data[0])]=return_data[1];
                    $scope.upload_success_num++;
                    if($scope.upload_success_num==$scope.ImgInfos.length)
                    {
                        onImgUploadSuccess();
                    }
                    // Success!
                }, function(err) {
                    console.log("图片上传失败");
                    console.log(err);
                    if(!isError)
                    {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: '图片上传失败',
                            template: '目前仅支持手机拍照和相册中jpg格式的文件上传，请检查网络连接后重新拍照上传'
                        });
                        isError=true;
                    }
                    // Error
                }, function (progress) {
                    //在此可以加入实名认证的进度条，后期工作
                    // constant progress updates
                    //console.log(progress);
                });
        }
    };

    //上传实名认证的数据
    var uploadParams=function(){
        //上传参数
        var $url='https://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/Verification/uploadVerifyInfo';
        $data=angular.copy($scope.certInfo);
        $data.bankInfo=$scope.bankCardInfos;
        $data.img_names=$scope.imageNames;
        console.log($data);
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
                    case 200:
                        console.log(data);
                        $ionicLoading.hide();
                        //$cordovaToast.showShortCenter("提交成功");
                        //将用户实名认证状态改为待审核
                        $rootScope.userInfo.certify_state=$rootScope.VERIFY_STATE.COMMITED;
                        //保存银行卡信息
                        Bank.updateCardInfo($scope.bankCardInfos);
                        //提交成功后的提示信息
                        showSuccess();
                        //$state.go("tab.account");
                        break;
                    default:
                        break;
                }
            }).
            error(function(data, status, headers, config)
            {
                switch(status){
                    default:
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: '用户信息上传失败',
                            template: '请检查您填写的信息后重试'
                        });
                        break;
                }
            });
    };

    var onImgUploadSuccess=function(){
        //数据提交成功
        $ionicLoading.hide();
        $ionicLoading.show({
            template: '图片上传成功，正在上传用户信息...'
        });
        uploadParams();
    };


    var showSuccess=function(){
        $ionicPopup.confirm({
            title: '实名认证提交成功',
            template: '您已成功提交实名认证信息，如果您是实体店主，建议继续实体店认证，管理自己的线上商铺',
            cancelText: '以后再说',
            okText: '实体店认证'
        }).then(function(result){
            $rootScope.isLogin=true;
            if(result){
                $state.go("store-register");
            }
            else{
                $state.go("tab.account");
            }
        });
    };


    //cacheFactory 可以用于不同的页面的之间的数据传递，每次进行实名验证初始化设置
//    var cache=$cacheFactory.get('BankCache');
//    if(typeof (cache)=='undefined'){
//        cache=$cacheFactory('BankCache');
//        cache.put('bankIds',[0,-1,-1]);
//    }
//    $scope.bankIds=cache.get('bankIds');



});