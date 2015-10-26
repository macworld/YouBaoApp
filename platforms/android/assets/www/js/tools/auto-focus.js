/**
 * Created by Wujin on 2015/9/8.
 */
angular.module('autoFocus', [])

//.directive('focusMe', function($timeout, $parse) {
//    return {
//        //scope: true,   // optionally create a child scope
//        link: function(scope, element, attrs) {
//            var model = $parse(attrs.focusMe);
//            scope.$watch(model, function(value) {
//                console.log('value=',value);
//                if(value === true) {
//                    $timeout(function() {
//                        element[0].focus();
//                    });
//                }
//            });
//            // to address @blesh's comment, set attribute value to 'false'
//            // on blur event:
//            element.bind('blur', function() {
//                console.log('blur');
//                scope.$apply(model.assign(scope, false));
//            });
//        }
//    };
//})
//用于自动获取焦点的标签，eg <label class="item-input-wrapper light-bg"  focus-me>
.directive('focusMe', function($timeout) {
    return {
        link: function(scope, element, attrs) {
            $timeout(function() {
                if(ionic.Platform.isAndroid()){
                    cordova.plugins.Keyboard.show();
                }
                element[0].focus();
            }, 150);
        }
    };
});