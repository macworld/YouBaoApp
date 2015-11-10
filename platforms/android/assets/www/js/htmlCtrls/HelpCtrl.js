/**
 * Created by Administrator on 2015/10/23.
 */

rootModule.controller('HelpCtrl', function($scope,Helps,$sce,$http,$ionicScrollDelegate) {

    $scope.helpItems=Helps.getHelps();
    $scope.helpClasses=Helps.getClasses();
    $scope.changeOpen=function(classItem){
        classItem.isOpen=!classItem.isOpen;
        //重新计算页面大小并跳转到对应的handle
        $ionicScrollDelegate.resize();
    };

    $scope.goItem=function(item){
//        $http.jsonp(item.html).
//            success(function(data, status, headers, config) {
//                console.log("suceess");
//                $scope.detailContent = function() { return $sce.trustAsHtml(data.result[0].content); };
//            }).
//            error(function(data, status, headers, config) {
//                alert('shibai');
//            });

        $http.jsonp(item.html)
            .success( function(data)
            {
                $scope.detailContent = function()
                {
                    return $sce.trustAsHtml(data.result[0].content);
                };
            })
            .error(function()
            {
                alert('失败');
            }
        );
    }
});