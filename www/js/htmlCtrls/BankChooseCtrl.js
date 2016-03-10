/**
 * Created by wujin on 2015/10/29.
 */

rootModule
    //银行选择页面的控制器
    .controller('BankChooseCtrl', function($scope,$state,Bank,$cacheFactory,$stateParams,$ionicHistory) {
        //服务当中的数据相当于是共享的全局对象，且为引用传递

//        console.log($stateParams.bankCardId);
        $scope.banks=Bank.getBanksSupoorted();
//        $scope.bankCardInfo=Bank.getBankCardInfoById($stateParams.bankCardId);
        //获取需要更改的银行卡信息
        $scope.bankCardInfo=Bank.getBankChooseInfo();
        if($scope.bankCardInfo==null)
        {
            console.log("获取待更改的银行卡信息失败");
        }
        else
        {
            console.log("待更改的银行卡信息");
            console.log($scope.bankCardInfo);
        }


        $scope.onBankConfrim=function(){
            $scope.bankCardInfo.bank_name=Bank.getBankNameById($scope.bankCardInfo.bank_id);
            console.log($scope.bankCardInfo);
            $ionicHistory.goBack();
        };

    });