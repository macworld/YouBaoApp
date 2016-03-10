/**
 * Created by Administrator on 2016/2/25.
 * 用于增加用户的挂单
 */


rootModule.controller('AddTradeCtrl', function($scope,$state,$rootScope,LoginoutService,$ionicActionSheet,$ionicScrollDelegate,$ionicLoading,$http,
                                               $ionicPopup,$cordovaToast,TradeTypeService,$timeout,CameraService,$cordovaCamera,$cordovaFileTransfer) {

    //检测是否已经登录，未登录的跳转到登录页面
    LoginoutService.hasLogin();

    //用于保存该订单的信息
//    $scope.tradeInfo={
//        trade_type: 0, //交易类型
//        item_type: 0,  //商品类型
//        item_subtype: 0, //商品详细分区
//        trade_title: null, //商品标题
//        trade_detail: null, //商品描述
//        img_urls: [] //商品的图片展示
//    };

    //初始化参数
    var paramsIntial=function(){
        $scope.tradeInfo={
            trade_type: 0, //交易类型
            item_type: 0,  //商品类型
            item_subtype: 0, //商品详细分区
            trade_title: null, //商品标题
            trade_detail: null, //商品描述
            img_urls: [] //商品的图片展示
        };
    };

    paramsIntial();//初始化参数

    //读取类型资源
    $scope.trade_types=TradeTypeService.getTradeType();
    $scope.item_types=TradeTypeService.getItemType();
    $scope.item_subtypes=TradeTypeService.getItemSubtype();

    //检测是否已经获得分区信息
    if($scope.item_subtypes==null)
    {
        //还未获取分区信息
        console.log("1");
        //表明获取数据失败，显示刷新的页面
        $scope.getting_data=false;
        $scope.error_occur=true;
//        //监控是否获取成功
//        $scope.$watch(function() {
//            return TradeTypeService.getItemSubtype();
//        }, function(value) {
//            //用于监控用户手动左划关闭侧边栏的情况
//            if(value!=null)
//            {
//                $scope.getting_data=false;
//            }
//        });
    }

    //用户点击刷新，获取数据
    //实验验证了该点击刷新系统的有效性
    $scope.onRetry=function()
    {
        $scope.getting_data=true;
        $scope.error_occur=false;
        TradeTypeService.getItemSubtypesFromServer();
        //监控是否获取成功
        $scope.$watch(function() {
            return TradeTypeService.getItemSubtype();
        }, function(value) {
            //用于监控用户手动左划关闭侧边栏的情况
            if(value!=null)
            {
                //获取成功
                $scope.getting_data=false;
                $scope.error_occur=false;
                $scope.item_subtypes=TradeTypeService.getItemSubtype();
            }
        });
        //数据获取计时，3s后任务数据获取失败
        $timeout(function(){
                if(TradeTypeService.getItemSubtype()==null)
                {
                    $scope.getting_data=false;
                    $scope.error_occur=true;
                }
            },2000
        );
    };

    //当商品类型变化时触发
    $scope.onItemTypeChange=function()
    {
        //将分区置为0，防止原本选择的分区id超过当前分区的id的最大值时造成的空白
        $scope.tradeInfo.item_subtype=0;
    };

    //传入参数，type
    //一个string类型的输入参数，用于标记该响应的不同触发
    //使用一个map来存储临时的照片数据，key为type，value为照片URL
    //"ID_FRONT”  身份证正面照
    //"ID_BACK"   身份证反面照
    //"ID_PEOPLE"  身份证和人的合照
    //注意：拍摄的照片andoird会存储在externalCache中，一定要注意去清理,目前暂时还未清理
    $scope.ImgInfos=[{
        id:  0,
        type:"ITEM_COVER",
        name: "封面照"
    },{
        id:  1,
        type:"ITEM_DETAIL1",
        name: "细节照1"
    },{
        id:  2,
        type: "ITEM_DETAIL2",
        name: "细节照2"
    }
    ];
    //设置的图像的质量0-100
    var img_quality=100;
    var img_size=600;

    //之前使用最新的版本的cordova-plugin-camera 出错，改为了org.apache.cordova.camera 反而好了，该版本的图像截取在各android和ios系统中有待测试
    $scope.onAddImg = function(id) {
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
                var options=CameraService.optionGenerateWithEdit(index,img_quality,img_size);
                //var options=CameraService.optionsGenerate(index,img_quality);
                //图像的裁剪
                $cordovaCamera.getPicture(options).then(function(imageUrl) {
                    $scope.tradeInfo.img_urls[id]=imageUrl;
                    console.log(id);
                    console.log(imageUrl);
                },function(err){
                    console.log(err);
                });

            //不通过ngCrodava的实现方式
//                var new_options={
//                    quality: img_quality,
//                    destinationType: Camera.DestinationType.FILE_URI,
//                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
//                    allowEdit: true,
//                    targetWidth: img_size,
//                    targetHeight: img_size,
//                    encodingType: Camera.EncodingType.JPEG,
//                    popoverOptions: CameraPopoverOptions,
//                    saveToPhotoAlbum: false
//                };
//                navigator.camera.getPicture(function (imageData){
//                    console.log(imageData);
//                    $scope.tradeInfo.img_urls[id]=imageData;
//                }, function(message){
//                    console.log(message);
//                }, new_options);

                return true;
            }
        });


    };

    $scope.onCancelImg=function(id){
        delete $scope.tradeInfo.img_urls[id];
    };




    $scope.onSubmit=function()
    {
        console.log($scope.tradeInfo);
        //1.检测所有数据是否填写，并且是否有效
        if(!detectInput())
        {
            return;
        }
        //所有检测通过
        //1.先上传图片，以后要改成进度条
        $ionicLoading.show({
            template: '数据上传中，图片文件较大，请耐心等候...'
        });
        uploadImages();//2.等待图片提交成功，提交参数

    };



    //检测用户的输入是否有效
    var detectInput=function(){
        if($scope.tradeInfo.trade_title==null || $scope.tradeInfo.trade_title.length<3)
        {
            //跳回顶部
            $ionicScrollDelegate.scrollTop();
            $ionicPopup.alert({
                title: '提交失败',
                template: '商品标题不得少于3个字'
            });
            return false;
        }
        if($scope.tradeInfo.trade_detail==null || $scope.tradeInfo.trade_detail.length<5)
        {
            //跳回顶部
            $ionicScrollDelegate.scrollTop();
            $ionicPopup.alert({
                title: '提交失败',
                template: '商品详情不得少于5个字'
            });
            return false;
        }
        return true;
    };

    //上传照片，需要加上进度条
    var uploadImages=function(){
        //处理$scope.tradeInfo.img_urls，去掉空闲项
        var validUrls=[];
        for($i=0;$i<$scope.tradeInfo.img_urls.length;$i++){
            if(typeof($scope.tradeInfo.img_urls[$i])=='undefined')
            {
                continue;
            }
            validUrls[validUrls.length]=$scope.tradeInfo.img_urls[$i];
        }
        if(validUrls.length==0)
        {
            //直接上传参数
            uploadParams();
        }
        console.log(validUrls);
        $server='https://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/Upload/uploadTradeImages';
        $scope.imageNames=[];
        var isError=false;//记录当前是否发生错误
        for($i=0;$i<validUrls.length;$i++)
        {
            var options = {};
            $cordovaFileTransfer.upload($server, validUrls[$i], options,true)
                .then(function(result) {
                    console.log(result);
                    $scope.imageNames[$scope.imageNames.length]=result.response;
                    if($scope.imageNames.length==validUrls.length)
                    {
                        //所有图像传递结束
                        console.log($scope.imageNames);
                        onImgUploadSuccess();
                    }
                    // Success!
                }, function(err) {
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

    var onImgUploadSuccess=function(){
        //数据提交成功
        $ionicLoading.hide();
        $ionicLoading.show({
            template: '图片上传成功，正在上传用户信息...'
        });
        uploadParams();
    };
    //上传挂单数据
    var uploadParams=function(){
        var $url='https://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/Trade/addTradeInfo';

        $data=angular.copy($scope.tradeInfo);
        delete $data.img_urls;

        $data.img_names=$scope.imageNames;


        $data.user_id=$rootScope.userInfo.user_id;
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
                        $cordovaToast.showShortCenter("提交成功");
                        //还原参数
                        paramsIntial();
                        $state.go("tab.home");
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




});
