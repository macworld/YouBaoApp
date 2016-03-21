// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('ZhangYouBao', ['ionic', 'ZhangYouBao.controllers', 'ZhangYouBao.services',
    'ZhangYouBao.directives','ngCordova','imageCacheFactory','autoFocus'])

.run(function($ionicPlatform,$rootScope,$ionicHistory,$state,LoginoutService,NetworkStateService,TradeTypeService) {
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
  $rootScope.maxCardNum=2;//最大支持的银行卡数
  //用于标记是否进行了强制登录，如果强制登录了，那么登录成功后需要跳转回来
  $rootScope.forceLogin=false;

//  $rootScope.SERVER_ADDRESS="169.254.123.63/html"; //服务器地址，目前使用IP，之后可能会换成域名
  $rootScope.SERVER_ADDRESS="115.28.95.58";
  $rootScope.ENTER_FILE="zhangyoubao.php";//入口函数

  //关于审核状态的常量
  $rootScope.VERIFY_STATE={
      UNCOMMIT: 0,  //未提交
      COMMITED: 1,  //待审核
      PASSED_VERIFY: 2  //审核通过
  };

  //關於店鋪狀態的常量
  $rootScope.STORE_STATE={
        NORMAL: 0,  //正常
        TEMP_OFF: 1,  //暂时停运
        FORBIDDEN: 2  //封号
    };
  //定义一个全局函数，该函数用于部分页面左上角的返回按钮
  $rootScope.goBack=function(){
      $ionicHistory.goBack();
  };
  //清空history
  $rootScope.clearHistory=function(){
      $ionicHistory.clearHistory();
  };
  //检测是否登录，没有登录则强制跳转到登录页面
  $rootScope.checkLogin=function(){
      if(!$rootScope.isLogin)
      {
          //强制登录
          $rootScope.forceLogin=true;
          $state.go("login");
      }
  };
  //用于创建一个固定大小的数组
  $rootScope.range=function(num){
      return new Array(num);
  };

   //用于设置android返回键
    $ionicPlatform.registerBackButtonAction(function (event) {

        switch ($ionicHistory.currentStateName())
        {
            case "login":
                $state.go("tab.home");
                break;
            case "tab.home":
                //在主页面按返回键，直接退出
                ionic.Platform.exitApp();
                break;
            case "certification":
                //在实名认证页面，返回account页面
                $state.go("tab.account");
                break;
            default :
                $ionicHistory.goBack();
                break;
        }
    }, 100);

    //应用开启时候的一些功能调用
    //测试网络状态和自动登录
    $ionicPlatform.ready(function() {
        if(NetworkStateService.checkConnection())
        {
            if(LoginoutService.isAutoLogin())
            {
                //自动登录
                LoginoutService.loginWithLastInfo();
            }
            //获取服务器分区列表信息
            TradeTypeService.getItemSubtypesFromServer();
        }
    });




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

  .state('commodity-detail',{
          url: '/commodity/:commodityId',
          templateUrl: 'templates/commodity-detail.html',
          controller: 'CommodityDetailCtrl'
      }
  )

  .state('shop-detail',{
      url: '/shop/:shopId',
      templateUrl: 'templates/shop-detail.html',
      controller: 'ShopDetailCtrl'
  })

  .state('vip-state',{
          url: '/vipState',
          templateUrl: 'templates/vip-state.html',
          controller: 'VipStateCtrl'
  })

  .state('card-manage',{
      url: '/CardManage',
      templateUrl: 'templates/card-manage.html',
      controller: 'CardManageCtrl'
  })

  .state('add-trade',{
      url: '/AddTrade',
      templateUrl: 'templates/add-trade.html',
      controller: 'AddTradeCtrl'
  })

  .state('store-manage',{
      url: '/StoreManage',
      templateUrl: 'templates/store-manage.html',
      controller: 'StoreManageCtrl'
  })

  .state('store-register',{
      url: '/StoreRegister',
      templateUrl: 'templates/store-register.html',
      controller: 'StoreRegisterCtrl'
  })


  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
