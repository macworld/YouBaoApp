// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('ZhangYouBao', ['ionic', 'ZhangYouBao.controllers', 'ZhangYouBao.services',
    'ZhangYouBao.directives','ngCordova','imageCacheFactory','autoFocus'])

.run(function($ionicPlatform,$rootScope,$ionicHistory,$state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });

  //用于一些全局变量的初始化
  $rootScope.isLogin=false;  //记录当前用户是否登录
  $rootScope.msgResendSeconds=60; //60s才能重发验证码
  $rootScope.msgResendRemain=0;//剩余的重发秒数
  $rootScope.maxCardNum=3;//最大支持的银行卡数
   //用于设置android返回键
    $ionicPlatform.registerBackButtonAction(function (event) {
        //从登陆页面返回主页面
        if($ionicHistory.currentStateName() == "login"){
            $state.go("tab.home");
//            ionic.Platform.exitApp();
            // or do nothing
        }
        else if($ionicHistory.currentStateName() == "tab.home")
        {
            //在主页面按返回键，直接退出
            ionic.Platform.exitApp();
        }
        else {
            $ionicHistory.goBack();
        }
    }, 100);

})


.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  //设置tab栏在应用底部显示
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('left');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');
  //设置导航标题居中
  $ionicConfigProvider.navBar.alignTitle('center');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  //定义tab路由
  .state('tab.home', {
    url: '/home',
    views: {
       'tab-home': {
         templateUrl: 'templates/tab-home.html',
         controller: 'HomeCtrl'
       }
    }
  })

    .state('search', {
        url: '/search',
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
    })



    .state('tab.category', {
        url: '/category',
        views: {
            'tab-category': {
                templateUrl: 'templates/tab-category.html',
                controller: 'CategoryCtrl'
            }
        }
    })
    .state('tab.help', {
        url: '/help',
        views: {
            'tab-help': {
                templateUrl: 'templates/tab-help.html',
                controller: 'HelpCtrl'
            }
        }
    })

  .state('tab.help-detail', {
      url: '/help/:helpItemId',
      views: {
          'tab-help': {
              templateUrl: 'templates/help-detail.html',
              controller: 'HelpDetailCtrl'
          }
      }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })
  .state('registe', {
      url: '/registe',
      templateUrl: 'templates/registe.html',
      controller: 'RegisteCtrl'
  })

  .state('certification', {
      url: '/certification',
      templateUrl: 'templates/certification.html',
      controller: 'CertificationCtrl'
  })

  .state('bankChoose', {
      url: '/bankChoose/:bankCardId',
      templateUrl: 'templates/bank-choose.html',
      controller: 'BankChooseCtrl'
  })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
