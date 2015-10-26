//该文件用于存储各种自定义的 directive

var module = angular.module('ZhangYouBao.directives', [])

//该自定义标签用于部分页面隐藏输入框
// 详见 http://stackoverflow.com/questions/23991852/how-do-i-hide-the-tabs-in-ionic-framework
// Alex Pavia的回答
.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            //此处包含事件的监听
            scope.$on('$ionicView.beforeEnter', function() {
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = value;
                });
            });

            scope.$on('$ionicView.beforeLeave', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
});