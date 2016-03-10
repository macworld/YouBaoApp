/**
 * Created by wujin on 2015/10/29.
 * 该服务用于银行相关的所有数据及操作
 */

//对于已登录的用户，其银行卡信息保存两份，本地一份，服务器一份，默认从本地读取，本地读取失败后从服务器获取并存储到本地
rootService.factory('Bank',function($ionicPopup){
    //6-20位 字母、数字、下划线、特殊字符组成
    //目前以ASC码表中支持的特殊字符作为基准
    //涉及到查询
    var bankInfo=[{
        id: 0,
        name: '中国建设银行'
    },{
        id: 1,
        name: '中国工商银行'
    },{
        id: 2,
        name: '中国农业银行'
    },{
        id: 3,
        name: '中国银行'
    },{
        id: 4,
        name: '招商银行'
    },{
        id: 5,
        name: '交通银行'
    },{
        id: 6,
        name: '中国民生银行'
    }
    ];
    //最多支持两张银行卡，该数组用于存储这三张银行卡的信息，初始只有一张默认bankID为0的卡片(建行卡)
    var bankCardInfos=[{
        id: 0,//这张银行卡在三张卡中的id
        bank_id: 0,//这张卡对应的银行的ID,与上面的bankInfo相对应
        bank_name: '中国建设银行',//为了便于显示，这里将银行名字也包含进来
        card_id: "" //银行卡的卡号，如果为“”，表示刚刚初始化，该卡的卡号还没有录入，采用字符串来存储

    }];



//    function addBankCard(id) {
//        if(id!=bankCardInfosCopy.length){
//            return false;
//        }
//        var info={
//            id: id,//这张银行卡在三张卡中的id
//            bank_id: 0,//这张卡对应的银行的ID,与上面的bankInfo相对应
//            bank_name: '中国建设银行',//为了便于显示，这里将银行名字也包含进来
//            card_id: "" //银行卡的卡号，如果为“”，表示刚刚初始化，该卡的卡号还没有录入，采用字符串来存储
//        };
//        bankCardInfosCopy.push(info);
//        return true;
//    }

    //在输入的BankCardInfo中添加新的数据项
    function addInputBankCard(id,input_Infos) {
        if(id!=input_Infos.length){
            return false;
        }
        var info={
            id: id,//这张银行卡在三张卡中的id
            bank_id: 0,//这张卡对应的银行的ID,与上面的bankInfo相对应
            bank_name: '中国建设银行',//为了便于显示，这里将银行名字也包含进来
            card_id: "" //银行卡的卡号，如果为“”，表示刚刚初始化，该卡的卡号还没有录入，采用字符串来存储
        };
        input_Infos.push(info);
        return true;
    }

    function minusInputBankCard(input_Infos) {
        if(input_Infos.length==1){
            console.error("无效的删除操作");
            return;
        }
        input_Infos.pop();
        return true;
    }

    //在副本上进行数据修改
//    function addBankCardCopy(id,$bank_card_info) {
//        if(id!=$bank_card_info.length){
//            return false;
//        }
//        var info={
//            id: id,//这张银行卡在三张卡中的id
//            bank_id: 0,//这张卡对应的银行的ID,与上面的bankInfo相对应
//            bank_name: '中国建设银行',//为了便于显示，这里将银行名字也包含进来
//            card_id: "" //银行卡的卡号，如果为“”，表示刚刚初始化，该卡的卡号还没有录入，采用字符串来存储
//        };
//        $bank_card_info.push(info);
//        return true;
//    }

//    function minusBankCard() {
//        if(bankCardInfosCopy.length==1){
//           console.error("错误的银行卡号删除操作");
//           return;
//        }
//        bankCardInfosCopy.pop();
//        return true;
//
//    }

    //从登陆信息中读取用户的银行卡信息，直接存储到保存的实体中去
    function readDataFromLogin($bank_card_info) {
        bankCardInfos=$bank_card_info;
        //增加id项
        for($i=0;$i<bankCardInfos.length;++$i)
        {
            bankCardInfos[$i].id=$i;
        }
//        //刷新其副本
//        bankCardInfosCopy=angular.copy(bankCardInfos);
    }


    function updateCardInfo(InputInfos){
        //将修改后的信息保存到真实实体数据中
        bankCardInfos=angular.copy(InputInfos);
    }

    var bankChooseInfo=null;
    function onChangeBank(id,InputBankInfo) {
        if(id>=InputBankInfo.length)
        {
            return false;
        }
        else
        {
            bankChooseInfo=InputBankInfo[id];
            return true;
        }
    }

    function getBankChooseInfo(){
        return  bankChooseInfo;
    }

    //该变量用于引用关联用户当前修改的数据信息
    var bankCardInfosChange=null;
    function saveChangeInfo(InputInfo){
        bankCardInfosChange=saveChangeInfo;
    }



    return{
        //判断输入数据是否是合法的密码
        getBanksSupoorted: function(){
            return bankInfo;
        },
        getBankNameById: function(id){
            for (var i = 0; i < bankInfo.length; i++) {
                if (bankInfo[i].id === parseInt(id)) {
                    return bankInfo[i].name;
                }
            }
            return null;
        },
        getBankCardInfos: function(){
            return bankCardInfos;
        },
//        getBankCardInfosCopy: function(){
//            return bankCardInfosCopy;
//        },
//        getBankCardInfoById: function(id){
//            for(var i=0;i<bankCardInfosCopy.length;i++){
//                if(bankCardInfosCopy[i].id==parseInt(id)){
//                    return bankCardInfosCopy[i];
//                }
//            }
//            return null;
//        },
//        addBankCard:addBankCard,
        addInputBankCard: addInputBankCard,
        minusInputBankCard: minusInputBankCard,
        readDataFromLogin: readDataFromLogin,
        updateCardInfo: updateCardInfo,
        saveChangeInfo: saveChangeInfo,
        onChangeBank: onChangeBank,
        getBankChooseInfo: getBankChooseInfo
    }
});