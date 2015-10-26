/*
 * Created by Administrator on 2015/10/19.
 * 用于图片的预先缓存，解决部分图片加载过慢的问题
*/


angular.module('imageCacheFactory', [])

.factory('$ImageCacheFactory', ['$q', '$timeout', function($q, $timeout) {
    return {
        Cache: function(urls) {
            var promises = [];
            for (var i = 0; i < urls.length; i++) {
                var deferred = $q.defer();
                var img = new Image();

                img.onload = (function(deferred) {
                    return function(){
                        deferred.resolve();
                    }
                })(deferred);

                img.onerror = (function(deferred,url) {
                    return function(){
                        deferred.reject(url);
                    }
                })(deferred,urls[i]);

                promises.push(deferred.promise);
                img.src = urls[i];
            }
            return $q.all(promises);
        }
    }
}]);
