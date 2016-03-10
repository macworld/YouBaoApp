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

    //直接获取银行卡信息，只有当用户点击修改时才会复制
    $scope.bankCardInfos=angular.copy(Bank.getBankCardInfos());
    $scope.maxCardNum=$rootScope.maxCardNum;
    $scope.addCard=function(id){
        if(id>=$rootScope.maxCardNum){
            return;
        }
        Bank.addInputBankCard(id,$scope.bankCardInfos);
    };

    $scope.minusCard= function () {
        Bank.minusInputBankCard($scope.bankCardInfos);
    };

    $scope.onChangeBank=function(id){
        //保存即将更改的银行卡信息
        Bank.onChangeBank(id,$scope.bankCardInfos);
        $state.go("bankChoose");
    };

    //标明当前是否正在修改
    $scope.isModifying=false;

    //用户点击修改信息
    $scope.onModify=function(){
        $scope.isModifying=true;
    };

    //用户点击取消修改
    $scope.onCancel=function(){
        $scope.bankCardInfos=angular.copy(Bank.getBankCardInfos());
        $scope.isModifying=false;
    };


    $scope.onSubmit=function() {
        for(var i=0;i<$scope.bankCardInfos.length;i++){
            var result=$scope.detectCardNum($scope.bankCardInfos[i].card_id,i);
            if(!result){
                return;
            }
        }

        //上传银行卡信息
        var $url='https://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/BankCard/updateBankCardInfo';
        $data={
            'user_id': $rootScope.userInfo.user_id,
            'bank_info': $scope.bankCardInfos
        };
        console.log($data);
        angular.toJson($data);
        $http({
            method: 'POST',
            url: $url,
            data: $data
        }).
            success(function(data, status, headers, config)
            {
                switch (status)
                {
                    case 200:
                        $cordovaToast.showShortCenter("修改成功");
                        //修改成功后更新数据
                        Bank.updateCardInfo($scope.bankCardInfos);
                        //修改页面状态
                        $scope.isModifying=false;
                        $state.go("tab.account");
                        break;
                }
            }).
            error(function(data, status, headers, config)
            {
                switch(status){
                    default:
                        $ionicPopup.alert({
                            title: '信息修改失败',
                            template: '请检测网络连接后重试'
                        });
                        break;
                }
            });
    };

});
