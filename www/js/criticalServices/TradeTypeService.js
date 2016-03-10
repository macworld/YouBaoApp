/**
 * Created by Administrator on 2016/3/2.
 * 用于处理交易中各种类型相关的信息
 */

rootService.factory('TradeTypeService',function($rootScope,$http,$cordovaToast) {

    //定义交易类型
    var trade_type=[{
        type_name: "出售",
        type_id: 0
    },{
        type_name: "收购",
        type_id: 1
    }];


    //定义商品类型
    var item_type=[{
        type_name: "邮票",
        type_id: 0
    },{
        type_name: "钱币",
        type_id: 1
    },{
        type_name: "卡片",
        type_id: 2
    }];
    //单纯数组形式
    var item_types=["邮票","钱币","卡片"];
    //商品的详细分区
    var item_subtypes=[];
    item_subtypes[0]=['版张专区','版票专区','小型张/小全张','小本票/大本册','纪特文编JT新票',
        '纪特文编JT销封','邮票片JP','JF封/其他封','邮资片TP/YP/FP','普封普片','贺年封片简卡',
        '港澳邮票','个性化原票','普区民清加改欠外','年册/集邮工具','产品票/礼品册'];
    item_subtypes[1]=['现代金银贵金属币','流通纪念币','一二三版纸币','古币/银元','联体钞/纪念钞','港澳台钱币','清朝/民国纸币','贵金属/纪念章'];
    item_subtypes[2]=['卡片测试1','卡片测试2'];

    var item_subtype=null;

    function getTradeType(){
        return trade_type;
    }

    function getItemType(){
        return item_type;
    }
    //获取单纯数组形式商品子分区
    function getItemSubtypeArray() {
        return item_subtypes;
    }

    //获取含id的商品子分区
    function getItemSubtype() {
        return item_subtype;
    }

    //从服务器获取分区信息，用户打开软件时触发
    function getItemSubtypesFromServer(){
        var $url='https://'+$rootScope.SERVER_ADDRESS+'/'+$rootScope.ENTER_FILE+'/User/Trade/getItemSubTypes';
        $http({
            method: 'get',
            url: $url
        }).
            success(function(data, status, headers, config)
            {
                switch (status)
                {
                    case 200:
                        angular.fromJson(data);
                        console.log(data);
                        item_subtype=data;
                        break;
                }
            }).
            error(function(data, status, headers, config)
            {
                switch(status){
                    default:
                        $cordovaToast.showShortCenter("获取服务器信息失败，请检查您的网络状态");
                        break;
                }
            });
    }


    return{
        getTradeType: getTradeType,
        getItemType: getItemType,
        getItemSubtypeArray: getItemSubtypeArray,
        getItemSubtype: getItemSubtype,
        getItemSubtypesFromServer: getItemSubtypesFromServer

    }







});
