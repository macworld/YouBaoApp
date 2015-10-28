/**
 * Created by wujin on 2015/10/21.
 * 聊天细节的控制器
 */
rootModule.controller('ChatDetailCtrl', function($scope, $stateParams, Chats,$rootScope,$ionicActionSheet,
                                                $cordovaCamera,$ionicScrollDelegate,$ionicPlatform) {
    $scope.chat = Chats.get($stateParams.chatId);
    $scope.chats= Chats.all();
    $rootScope.hideTabs=true;

    //关于生命周期中的事件的案例
//    $scope.$on('$ionicView.enter',function(){
//       console.log("enter");
//    });
//
//    $scope.$on('$ionicView.loaded',function(){
//        console.log("loaded");
//    });
//
//    $scope.$on('$ionicView.leave',function(){
//        console.log("leave");
//    });
//
//    $scope.$on('$ionicView.beforeEnter',function(){
//        console.log("beforeEnter");
//    });
//
//    $scope.$on('$ionicView.beforeLeave',function(){
//        console.log("beforeLeave");
//    });
//
//    $scope.$on('$ionicView.afterEnter',function(){
//        console.log("afterEnter");
//    });
//
//    $scope.$on('$ionicView.afterLeave',function(){
//        console.log("afterLeave");
//    });
//
//    $scope.$on('$ionicView.unloaded',function(){
//        console.log("unloaded");
//    });

    //用于存放拍摄的图像路径的数组
    $scope.images=[];

    //+号按钮的弹出菜单
    $scope.showActionSheet = function() {

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
                if(index==0)
                {
                    $scope.takePhoto();
//                    $scope.getPhoto();
                    return true;
                }
                else
                {
                    $scope.capturePhoto();
//                    $scope.getPhoto();
                    return true;
                }
            }
        });

    };

    //用于监控是否有输入内容，根据内容动态变幻按钮
    $scope.hasContent=false;
    $scope.$watch("chatStr",function(newValue){

            if(typeof(newValue)!="undefined")
            {
                if(newValue.length===0)
                {
                    $scope.hasContent=false;
                }
                else
                {
                    $scope.hasContent=true;
                }
            }
        }
    );

    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    window.addEventListener('native.keyboardhide', keyboardHideHandler);
    function keyboardShowHandler(e){
//        alert('Keyboard height is: ' + e.keyboardHeight);
        $scope.toBottom();
    }
    function keyboardHideHandler(e){
        $scope.toBottom();
    }


    $scope.send=function(Str){
        Chats.add({
            id: 5,
            name: 'Mike Harrington',
            lastText: Str,
            face: 'img/touxiang5.jpg',
            unRead: 0
        });
        //发送后输入框清空并跳转到底部
        $scope.chatStr="";
        $ionicScrollDelegate.scrollBottom();
    };
    //点击输入框后跳转到对话底部
    $scope.toBottom=function(){
        $ionicScrollDelegate.scrollBottom();
    };

//    document.addEventListener("deviceready", function () {
//
//        var options = {
//            quality: 50,
//            destinationType: Camera.DestinationType.DATA_URL,
//            sourceType: Camera.PictureSourceType.CAMERA,
//            allowEdit: true,
//            encodingType: Camera.EncodingType.JPEG,
//            targetWidth: 100,
//            targetHeight: 100,
//            popoverOptions: CameraPopoverOptions,
//            saveToPhotoAlbum: false,
//            correctOrientation:true
//        };
//
//        $cordovaCamera.getPicture(options).then(function(imageData) {
//            var image = document.getElementById('myImage');
//            image.src = "data:image/jpeg;base64," + imageData;
//        }, function(err) {
//            // error
//        });
//
//    }, false);
    //在尝试了一整天之后，摄像功能依然无法使用，目前已放弃，以后再看吧==无奈了
    //待实验方法，github上有ionic camera的demo，下载下来，看能否在手机上运行
    $scope.takePhoto = function () {
        if (typeof $cordovaCamera == 'undefined')
        {
            console.log('Camera not found');
        }

        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
        }, function (err) {
            // An error occured. Show a message to the user
        });

    };

    $scope.capturePhoto=function()
    {
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
            destinationType: destinationType.DATA_URL });
    };
//    $scope.addImage = function() {
//        // 2
//        var options = {
//            destinationType : Camera.DestinationType.FILE_URI,
//            sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
//            allowEdit : false,
//            encodingType: Camera.EncodingType.JPEG,
//            popoverOptions: CameraPopoverOptions
//        };
//
//        // 3
//        $cordovaCamera.getPicture(options).then(function(imageData) {
//
//            // 4
//            onImageSuccess(imageData);
//
//            function onImageSuccess(fileURI) {
//                createFileEntry(fileURI);
//            }
//
//            function createFileEntry(fileURI) {
//                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
//            }
//
//            // 5
//            function copyFile(fileEntry) {
//                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
//                var newName = makeid() + name;
//
//                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
//                        fileEntry.copyTo(
//                            fileSystem2,
//                            newName,
//                            onCopySuccess,
//                            fail
//                        );
//                    },
//                    fail);
//            }
//
//            // 6
//            function onCopySuccess(entry) {
//                $scope.$apply(function () {
//                    $scope.images.push(entry.nativeURL);
//                });
//            }
//
//            function fail(error) {
//                console.log("fail: " + error.code);
//            }
//
//            function makeid() {
//                var text = "";
//                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//
//                for (var i=0; i < 5; i++) {
//                    text += possible.charAt(Math.floor(Math.random() * possible.length));
//                }
//                return text;
//            }
//
//        }, function(err) {
//            console.log(err);
//        });
//    };
//
//    $scope.urlForImage = function(imageName) {
//        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
//        var trueOrigin = cordova.file.dataDirectory + name;
//        return trueOrigin;
//    };

});