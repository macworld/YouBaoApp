/**
 * Created by wujin on 2015/11/9.】
 * 用于实体店铺的展示
 */


rootModule.controller('ShopDetailCtrl',function($scope,$stateParams,$ionicScrollDelegate,$location, $anchorScroll){
    $scope.shopId=$stateParams.shopId;
    $scope.classes=[{
        name: '版张专区',
        isOpen: false
    },{
        name: '版票专区',
        isOpen: false
    }];

    $scope.changeOpen=function(changedClass){
        changedClass.isOpen=!changedClass.isOpen;

        //重新计算页面大小
        $ionicScrollDelegate.resize();
        if(changedClass.isOpen){
            $ionicScrollDelegate.scrollBy(0, 100,true);
        }
        //anchorScroll这套方案被否决，当多次跳跃时会出现各种问题，现在索性在展开时向下跳100个像素点

        //计算后跳转到刚刚点击的元素
//        var hashName=changedClass.name+changedClass.isOpen.toString();
//        console.log(hashName);
//        $location.hash(hashName);
//        // call $anchorScroll()
//        $ionicScrollDelegate.anchorScroll(true);
    };

    $scope.classItems=new Array();

    $scope.classItems['版票专区']=[{

        title: '收购2011辛亥革命小版',
        tradeType: 0,   //交易类型 0是收购，1 是出售
        price: 38,
        unit: '版'
    },{
        title: '出售船舶。包公。鸳鸯小版。',
        tradeType: 1,   //交易类型 0是收购，1 是出售
        price: 50,
        unit: '版'
    }];

    $scope.classItems['版张专区']=[{
        title: '收购2011辛亥革命小版',
        tradeType: 0,   //交易类型 0是收购，1 是出售
        price: 38,
        unit: '版'
    },{
        title: '出售船舶。包公。鸳鸯小版。',
        tradeType: 1,   //交易类型 0是收购，1 是出售
        price: 50,
        unit: '版'
    }];


    $scope.isCollected=false;
    $scope.changeCollect=function(){
        $scope.isCollected=!$scope.isCollected;
        if($scope.isCollected){
          window.plugins.toast.showShortBottom("完成收藏");
        }else{
          window.plugins.toast.showShortBottom("取消收藏");
        }
    };


});
