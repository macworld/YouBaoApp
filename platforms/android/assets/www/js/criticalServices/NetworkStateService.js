/**
 * Created by wujin on 2015/12/2.
 * 提供网络状态的查看
 */
rootService.factory('NetworkStateService',function($ionicPopup,$cordovaToast){

    //反馈当前的网络状态
    var checkConnection=function() {
        var networkState = navigator.connection.type;

//        var states = {};
//        states[Connection.UNKNOWN]  = 'Unknown connection';
//        states[Connection.ETHERNET] = 'Ethernet connection';
//        states[Connection.WIFI]     = 'WiFi connection';
//        states[Connection.CELL_2G]  = 'Cell 2G connection';
//        states[Connection.CELL_3G]  = 'Cell 3G connection';
//        states[Connection.CELL_4G]  = 'Cell 4G connection';
//        states[Connection.CELL]     = 'Cell generic connection';
//        states[Connection.NONE]     = 'No network connection';
        if(networkState==Connection.NONE)
        {
            $cordovaToast.showShortCenter("网络连接不可用");
            return false;
        }
        return true;
    };

    //对于常见的网络状态返回值进行处理
    var defaultStatusProcess=function(status)
    {
        switch (status)
        {
            case 400:
                $ionicPopup.alert({
                    title: '提示',
                    template: '传入参数错误'
                });
                break;
            case 500:
                $ionicPopup.alert({
                    title: '提示',
                    template: '服务器异常，请稍后重试，为给您带来的不便深表歉意'
                });
                break;
            default:
                $ionicPopup.alert({
                    title: '提示',
                    template: '连接服务器失败，请检查您的网络状态'
                });
        }
    };


    return {
        checkConnection: checkConnection,
        defaultStatusProcess: defaultStatusProcess
    }
});

