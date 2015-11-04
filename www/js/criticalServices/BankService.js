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
    //最多支持三张银行卡，该数组用于存储这三张银行卡的信息，初始只有一张默认bankID为0的卡片(建行卡)
    var bankCardInfos=[{
        id: 0,//这张银行卡在三张卡中的id
        bankId: 0,//这张卡对应的银行的ID,与上面的bankInfo相对应
        bankName: '中国建设银行',//为了便于显示，这里将银行名字也包含进来
        cardId: "" //银行卡的卡号，如果为“”，表示刚刚初始化，该卡的卡号还没有录入，采用字符串来存储

    }];

    function addBankCard(id) {
        if(id!=bankCardInfos.length){
            return false;
        }
        var info={
            id: id,//这张银行卡在三张卡中的id
            bankId: 0,//这张卡对应的银行的ID,与上面的bankInfo相对应
            bankName: '中国建设银行',//为了便于显示，这里将银行名字也包含进来
            cardId: "" //银行卡的卡号，如果为“”，表示刚刚初始化，该卡的卡号还没有录入，采用字符串来存储
        };
        bankCardInfos.push(info);
        return true;
    }

    function minusBankCard() {
        if(bankCardInfos.length==1){
           console.error("错误的银行卡号删除操作");
        }
        bankCardInfos.pop();
        return true;

    }
    //该变量用于说明服务中数据的有效性，在用户实名认证成功之前，这些数据都是无效的
    //当实名认证的人工审核通过时，该数据方才有效
    var isInfoValid=false;
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
        getBankCardInfoById: function(id){
            for(var i=0;i<bankCardInfos.length;i++){
                if(bankCardInfos[i].id==parseInt(id)){
                    return bankCardInfos[i];
                }
            }
            return null;
        },
        isValid: function(){
            return isInfoValid;
        },
        addBankCard:addBankCard
    }
});