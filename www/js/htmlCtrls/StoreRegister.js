/**
 * Created by Administrator on 2016/3/10.
 * 用于商铺的注册申请
 */


rootModule.controller('StoreRegisterCtrl', function($scope) {
    $scope.ImgInfos=[{
        id:  0,
        type:"STORE_COVER",
        name: "店铺门面照"
    },{
        id:  1,
        type: "STORE_LICENSE",
        name: "营业执照"

    },{
        id:  2,
        type:"STORE_DETAIL1",
        name: "店铺细节照1"

    },{
        id:  3,
        type: "STORE_DETAIL2",
        name: "店铺细节照2"
    }
    ];
});
