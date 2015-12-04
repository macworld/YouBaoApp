/*
 * Created by wujin on 2015/11/2.
 * 用于localStorage的相关操作
 * localStorage用于持久性地存储数据对象，
 * 如配置文件、用户默认的账号密码等等
 * 详见：
 * http://learn.ionicframework.com/formulas/localstorage/
 */

rootService.factory('LocalStorage', ['$window', function($window) {
//    注意：此处的缓存会将各种值都转换为string类型，尤其是bool值，一定要记住类型转换，不然坑死
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || null);
        }
    }
}]);