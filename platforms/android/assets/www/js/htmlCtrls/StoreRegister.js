/**
 * Created by Administrator on 2016/3/10.
 * 用于商铺的注册申请
 */


rootModule.controller('StoreRegisterCtrl', function($scope,$ionicScrollDelegate,CameraService,$rootScope,$state,$cordovaToast,$ionicLoading,
                                                    $cordovaCamera,$ionicPopup,$ionicActionSheet,$cordovaFileTransfer,$http) {
    //先实名认证再实体店认证
    if($rootScope.userInfo.certify_state==$rootScope.VERIFY_STATE.UNCOMMIT)
    {
        $cordovaToast.showShortCenter("你需要先提交个人认证，再进行实体店认证");
        $state.go("certification");
    }


    //店铺认证信息
    $scope.StoreImgInfos=[{
        id:  0,
        type:"STORE_COVER",
        name: "店铺门面照"
    },{
        id:  1,
        type: "STORE_LICENSE",
        name: "营业执照"

    }];

//    //个人认证信息
//    $scope.PersonImgInfos=[{
//        id:  0,
//        type:"ID_FRONT",
//        name: "身份证正面照"
//    },{
//        id:  1,
//        type: "ID_PEOPLE",
//        name: "手持身份证照"
//
//    }];

    //存储照片uri
    $scope.store_img_uris=[];
//    $scope.person_img_uris=[];


    $scope.StoreInfo={
      user_id: $rootScope.userInfo.user_id, //店铺对应的用户id
      store_name: null,
      store_detail: null,
      store_address: null,
      store_img_cover: null,//店铺门面照
      store_img_license: null//营业许可证
//      store_img_id_front: null,//实体店主身份证正面照
//      store_img_id_people: null//实体店主手持身份证照
    };

    $scope.onSubmit=function(){

        console.log($scope.StoreInfo);
        if(!detectInput())
        {
            return;
        }
        $ionicLoading.show({
            template: '数据上传中，图片文件较大，请耐心等候...'
        });
        uploadImages();//2.等待图片提交成功，提交参数



    };

    //上传店铺认证的图片
    var uploadImages=function(){
        $server='https://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/Upload/uploadStoreRegisterImages';
        $scope.upload_success_num=0;
        var isError=false;//记录当前是否发生错误
        for($i=0;$i<$scope.store_img_uris.length;$i++)
        {
            var options = {
                params: {id: $i}
            };
            $cordovaFileTransfer.upload($server, $scope.store_img_uris[$i], options,true)
                .then(function(result) {
                    console.log(result);
                    //返回信息采取id+，+filename的形式编码
                    var return_data=result.response.split(',');
                    var id=Number(return_data[0]);
                    if(id==0)//店铺封面照
                    {
                        $scope.StoreInfo.store_img_cover=return_data[1];
                    }
                    else//店铺营业执照
                    {
                        $scope.StoreInfo.store_img_license=return_data[1];
                    }
                    $scope.upload_success_num++;
                    if($scope.upload_success_num==$scope.store_img_uris.length)
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
                    //在此可以加入图片上传的进度条，后期工作
                    // constant progress updates
                    //console.log(progress);
                });
        }
    };

    var onImgUploadSuccess=function(){
        //数据提交成功
        $ionicLoading.hide();
        $ionicLoading.show({
            template: '图片上传成功，正在上传商铺信息...'
        });
        uploadParams();
    };

    //商铺参数上传
    var uploadParams=function(){
        //上传参数
        var $url='https://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/StoreRegister/uploadStoreRegisterInfo';
        $data=angular.copy($scope.StoreInfo);
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
                        initialStoreInfo();
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
                            title: '商铺信息上传失败',
                            template: '请检查您填写的信息后重试'
                        });
                        break;
                }
            });
    };

    var showSuccess=function(){
        $ionicPopup.alert({
            title: '提交成功',
            template: '您已成功提交实体店认证信息，请耐心等待认证结果'

        });
        $state.go("tab.account");
    };

    //检测用户的输入是否有效
    var detectInput=function(){
        if($scope.StoreInfo.store_name==null || $scope.StoreInfo.store_name.length<2)
        {
            //跳回顶部
            $ionicScrollDelegate.scrollTop();
            $ionicPopup.alert({
                title: '提交失败',
                template: '店铺名称不得少于2个字'
            });
            return false;
        }
        if($scope.StoreInfo.store_detail==null || $scope.StoreInfo.store_detail.length<5)
        {
            //跳回顶部
            $ionicScrollDelegate.scrollTop();
            $ionicPopup.alert({
                title: '提交失败',
                template: '店铺简介不得少于5个字'
            });
            return false;
        }
        if($scope.StoreInfo.store_address==null || $scope.StoreInfo.store_address.length<5)
        {
            //跳回顶部
            $ionicScrollDelegate.scrollTop();
            $ionicPopup.alert({
                title: '提交失败',
                template: '请确保店铺地址真实有效，不得少于5个字'
            });
            return false;
        }
        return true;
    };


    $scope.onAddImg = function(id) {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<b>拍照</b>' },
                { text: '<b>相册</b>' }
            ],
            titleText: '<b>图片选择</b>',
            cancelText: '<b>取消</b>',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                var options={};
//                if(id==0 && type=='store')//只有店铺门照需要裁剪
//                {
//                    options=CameraService.optionGenerateWithEdit(index);
//                }
//                else
//                {
//                    options=CameraService.optionsGenerate(index);
//                }
//                //图像的裁剪
//                $cordovaCamera.getPicture(options).then(function(imageUrl) {
//                    if(type=='store')
//                    {
//                        $scope.store_img_uris[id]=imageUrl;
//                    }
//                    else //店主认证
//                    {
//                        $scope.person_img_uris[id]=imageUrl;
//                    }
//                    console.log(imageUrl);
//                },function(err){
//                    console.log(err);
//                });
                if(id==0)//只有店铺门照需要裁剪
                {
                    options=CameraService.optionGenerateWithEdit(index);
                }
                else
                {
                    options=CameraService.optionsGenerate(index);
                }
                //图像的裁剪
                $cordovaCamera.getPicture(options).then(function(imageUrl) {
                    $scope.store_img_uris[id]=imageUrl;
                    console.log(imageUrl);
                },function(err){
                    console.log(err);
                });
                return true;
            }
        });
    };


    $scope.onCancelImg=function(id){
//        if(type=='store')
//        {
//            delete $scope.store_img_uris[id];
//        }
//        else
//        {
//            delete $scope.person_img_uris[id]
//        }
        delete  $scope.store_img_uris[id];
    };

    //提交成功后保存并初始化商铺信息
    var initialStoreInfo=function()
    {
        //保存店铺信息

        $rootScope.storeInfo=$scope.StoreInfo;
        //将店铺认证的状态改为待审核
        $rootScope.storeInfo.certify_state=$rootScope.VERIFY_STATE.COMMITED;
        $rootScope.storeInfo.store_state=$rootScope.STORE_STATE.NORMAL;
        //店铺收藏人数初始化为0
        $rootScope.storeInfo.store_fcous_num=0;
    }

});
