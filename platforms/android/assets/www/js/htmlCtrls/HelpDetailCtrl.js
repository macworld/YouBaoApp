/**
 * Created by wujin
 * on 2015/10/23.
 * 展示帮助信息，从帮助的主页面传入帮助的id,然后根据该id 搜索help服务，获取其对应的html URL，然后获取并展示在页面上
 */
rootModule.controller('HelpDetailCtrl', function($scope, $stateParams,Helps,$sce,$http,$ionicLoading){

    var helpId=$stateParams.helpItemId;
    $scope.item=Helps.getItem(helpId);
    $ionicLoading.show({
        template: '页面获取中...'
    });
    $http.jsonp($scope.item.html)
        .success( function(data)
        {
            $scope.detailContent=$sce.trustAsHtml(data.result[0].content);
            $ionicLoading.hide();
        })
        .error(function()
        {
            alert('失败');
        }
    );

});