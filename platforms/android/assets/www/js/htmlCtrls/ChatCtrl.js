/**
 * Created by wujin on 2015/10/21.
 * 私信内容的控制器
 */
rootModule.controller('ChatsCtrl', function($scope, Chats,$ImageCacheFactory) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
    //该部分代码用于图片缓存。当从服务器端获取用户图片后，将其缓存下来
    //在真正功能实现时，每次从服务器端获取用户头像时都调用该函数进行缓存，该功能只用于这种从列表到子目录的形式
    //对于商品页面的图像，不用缓存
    //记住要缓存用户自己的头像，这一点在用户登录时就可以实现
    $ImageCacheFactory.Cache(["img/touxiang4.jpg","img/touxiang5.jpg"])
        .then(function(){
            console.log("Images done loading!");
        },function(failed){
            console.log("An image filed: "+failed);
        });
});