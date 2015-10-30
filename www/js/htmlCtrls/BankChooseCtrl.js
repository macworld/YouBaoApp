/**
 * Created by wujin on 2015/10/29.
 */

rootModule
    //银行选择页面的控制器
    .controller('BankChooseCtrl', function($scope,$state,Bank,$cacheFactory,$stateParams,$ionicHistory) {
        //服务当中的数据相当于是共享的全局对象，且为引用传递
        $scope.banks=Bank.getBanksSupoorted();
        $scope.bankCardInfo=Bank.getBankCardInfoById($stateParams.bankCardId);
        console.log($scope.bankCardInfo);

        $scope.onBankConfrim=function(){
            $scope.bankCardInfo.bankName=Bank.getBankNameById($scope.bankCardInfo.bankId);
            $ionicHistory.goBack();
        };

    });