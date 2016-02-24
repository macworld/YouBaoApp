/**
 * Created by wujin on 2016/2/24.
 * 用于管理用户的银行卡信息
 */

rootModule.controller('CardManageCtrl', function($scope,$http,$rootScope,$state,Bank,$ionicPopup,$cordovaToast) {


    $scope.isCardIdValid=new Array($rootScope.maxCardNum);
    for(var i=0;i<$rootScope.maxCardNum;++i){{
        $scope.isCardIdValid[i]=true;
    }}

    $scope.detectCardNum=function(num,index){
        //银行卡号目前认定为16或19位，以后具体银行具体分析
        var pattern = /(^\d{16}$)|(^\d{19}$)/;
//        console.log(num);
        if(pattern.test(num)){
            $scope.isCardIdValid[index]=true;
            return true;
        }
        else{
            $scope.isCardIdValid[index]=false;
            return false;
        }
    };

    $scope.bankCardInfos=Bank.getBankCardInfos();
    console.log($scope.bankCardInfos);
    $scope.maxCardNum=$rootScope.maxCardNum;
    $scope.addCard=function(id){
        if(id>=$rootScope.maxCardNum){
            return;
        }
        Bank.addBankCard(id);
        $ionicScrollDelegate.scrollBottom();
    };

    $scope.minusCard= function () {
        if($scope.bankCardInfos.length==1){
            console.error("无效的删除操作");
            return;
        }
        $scope.bankCardInfos.pop();
        $ionicScrollDelegate.scrollBottom();
    };


    $scope.onSubmit=function() {
        for(var i=0;i<$scope.bankCardInfos.length;i++){
            var result=$scope.detectCardNum($scope.bankCardInfos[i].card_id,i);
            if(!result){
                $ionicScrollDelegate.scrollBottom();
                return;
            }
        }
    }

});
