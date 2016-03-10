/**
 * Created by wujin on 2015/11/3.
 * 封装所有与摄像头相关的服务
 */


rootModule.factory('CameraService',function($cordovaCamera){
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

    //图像获取时进行图像的裁剪，长宽比控制为1:1
    function optionGenerateWithEdit(type,quality,targetSize) {
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
            allowEdit: true,
            targetWidth: targetSize,
            targetHeight: targetSize,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
    }


    return{
        optionsGenerate:optionsGenerate,
        optionGenerateWithEdit:optionGenerateWithEdit
    }



});