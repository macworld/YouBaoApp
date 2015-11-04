/**
 * Created by wujin on 2015/11/2.
 * 关于图片数据的本地文件存储，如用户聊天记录中的图片缓存、用户实名认证时的图片数据存储
 *
 *
 * 关于存储系统的思考，对于本软件本地存储将分为三个部分
 * 1.sqlite数据库，主要进行用户聊天记录的数据缓存，用户的聊天记录将保存在sql数据库中，
 * 用户聊天好友的数据缓存，ngCorova中有对应功能
 * 2.localStore,利用web自带的缓存功能，主要用于一些较为小型化、便捷化的数据存储，如用户的配置信息，用户的登录信息等
 *
 * 3.cordova.file.dataDirectory 该目录下不容易被系统清除，
 * 在该目录下进行一些不便于存储数据库的文件存储，如用户发送的图片等等,(图片的将以URL的形式关联到sq数据库中的聊天记录中)
 *
 * 注意:所有本地存储的数据必须考虑本地数据被清空后从服务器端的重新获取，对于一些配置信息，必须考虑从服务器端进行数据更新
 * 同时必须自行进行数据大小的判断，超过设定的阈值之后将按照时间顺序，删除部分数据
 *
 * 对于ios和android这两个系统，两者的存储目录并不相同，系统的清除机制也不尽相同，因而一定要做好了解与规划。
 * http://ngcordova.com/docs/plugins/file/
 */

//图片相关的数据存储，数据将以json格式存储在本地文件中
rootService.factory('ImgFileService', function() {
    //聊天的用户数据中的图片对应的目录列表,一个数组，结构如下:
    // id : 本地图片id
    // userid: 发送该图片的用户id
    // url:  图片在本地对应的路径
    // time: 图片发送的时间点
    var chatImages=[];


    var CHAT_IMAGE_KEY = 'chatImages';

//    //每次使用都重新初始化
//    window.localStorage.setItem(CHAT_IMAGE_KEY, JSON.stringify(chatImages));

    //获取本地存储的聊天图片记录
    function getChatImages() {
        var img = window.localStorage.getItem(CHAT_IMAGE_KEY);
        if (img) {
            chatImages = JSON.parse(img);
            console.log(chatImages);
        } else {
            chatImages = [];
        }
        return chatImages;
    }

    //推送进来的数据必须满足数据格式，存储后更新本地文件存储
    function addChatImage(img) {
        chatImages.push(img);
        window.localStorage.setItem(CHAT_IMAGE_KEY, JSON.stringify(chatImages));
    }

    return {
        storeImage: addChatImage,
        images: getChatImages
    }
})

//摄像头相关的图像文件操作，并且基于上面的ImgFileService将图像目录存储在本地
.factory('ImageService', function($cordovaCamera, ImgFileService, $q, $cordovaFile) {

    //随机生成文件名，使得图片存储尽量不存在文件名冲突
    function makeid() {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    //根据输入type生成option，根据quality确定图片的质量
    function optionsGenerate(type,quality) {
        var source;
        switch (type) {
            case 0:
                source = Camera.PictureSourceType.CAMERA;
                break;
            case 1:
                source = Camera.PictureSourceType.PHOTOLIBRARY;
                break;
        }
        return {
            quality: quality,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: source,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
    }




    //获取文件，并将其存储到本app对应的文件夹内
    function saveMedia(type,quality) {
        return $q(function(resolve, reject) {
            var options = optionsGenerate(type,quality);

            $cordovaCamera.getPicture(options).then(function(imageUrl) {
//                console.log(imageUrl);
                var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
//                console.log(name);
                var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
//                console.log(namePath);
                var newName = makeid() + name;
//                console.log(newName);
                $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
                    .then(function(info) {
                        var imageItem={
                            id: 0,
                            userid: 0,
                            url:  newName,
                            time: 0
                        };
                        ImgFileService.storeImage(imageItem);
                        console.log(cordova.file.dataDirectory);
                        console.log(imageUrl);
                        resolve();
                    }, function(e) {
                        console.error(e);
//                        console.error("无法进行数据拷贝");
                        reject();
                    });
            });
        })
    }
    return {
        gitImage: saveMedia
    }
});

