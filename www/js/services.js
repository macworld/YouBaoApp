var rootService=angular.module('ZhangYouBao.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/touxiang0.jpg',
    unRead: 5
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/touxiang1.jpg',
    unRead: 3
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/touxiang2.jpg',
    unRead: 0
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/touxiang3.jpg',
    unRead: 0
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/touxiang4.jpg',
    unRead: 0
  }, {
    id: 5,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/touxiang5.jpg',
    unRead: 0
  }, {
    id: 6,
    name: '系统',
    lastText: '全新活动：双倍充值，充多少送多少',
    face: 'img/ionic.png',
    unRead: 1
  }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/touxiang1.jpg',
      unRead: 3
  }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/touxiang2.jpg',
      unRead: 0
  }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/touxiang3.jpg',
      unRead: 0
  }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/touxiang4.jpg',
      unRead: 0
  }, {
      id: 5,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/touxiang5.jpg',
      unRead: 0
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    },
    add: function(chat){
        chats.push(chat);
    }
  };
})

//帮助文件的内容是一个兼容ionic模式的html文档

.factory('Helps', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var helpItems = [{
        id: 0,
        classId: 0,
        title: '如何充值会员',
        html: "http://www.phonegap100.com/appapi.php?a=getPortalArticle&aid=338&callback=JSON_CALLBACK"
    }, {
        id: 1,
        classId: 0,
        title: '会员的权限设定',
        html: "http://www.phonegap100.com/appapi.php?a=getPortalArticle&aid=338&callback=JSON_CALLBACK"
    }, {
        id: 2,
        classId: 1,
        title: '如何挂单',
        html: "http://www.phonegap100.com/appapi.php?a=getPortalArticle&aid=338&callback=JSON_CALLBACK"
    }, {
        id: 3,
        classId: 1,
        title: '本平台的交易流程',
        html: "http://www.phonegap100.com/appapi.php?a=getPortalArticle&aid=338&callback=JSON_CALLBACK"
    }];
    var classes=[{
            id: 0,
            topic:  '会员',
            isOpen: false
        },{
            id: 1,
            topic:  '交易',
            isOpen: false
        }];

    return {
        getHelps: function() {
            return helpItems;
        },
        remove: function(help) {
            helpItems.splice(helpItems.indexOf(help), 1);
        },
        getItem: function(helpId) {
            for (var i = 0; i < helpItems.length; i++) {
                if (helpItems[i].id === parseInt(helpId)) {
                    return helpItems[i];
                }
            }
            return null;
        },
        add: function(item){
            helpItems.push(item);
        },
        getClasses: function(){
          return classes;
        }
    };
})

.factory('Camera', ['$q', function($q) {

    return {
        getPicture: function(options) {
            var q = $q.defer();

            navigator.camera.getPicture(function(result) {
                // Do any magic you need
                q.resolve(result);
            }, function(err) {
                q.reject(err);
            }, options);

            return q.promise;
        }   } }])

/*该服务用于手机号相关的操作*/
/*请注意服务商支持的手机号更新后，这边也要跟着更新*/
.factory('TelphoneNum',function($ionicPopup){
        var pattern=/^1[3|5|7|8|][0-9]{9}$/;
    return{
        //判断输入数据是否是正确的手机号
        isTelNum: function(num){
            if(typeof (num)!="number" || num.toString(10).length!=11 ||!pattern.test(num.toString()))
            {
                //alert("请输入数字");
                $ionicPopup.alert({
                    title: '输入提示',
                    template:'请输入11位数字构成的有效手机号',
                    okText: '确认'
                });
                return false;
            }
            return true;
        }
    }

})

/*该服务用于验证码相关的操作*/
.factory('DetectNum',function($ionicPopup){
    return{
        //判断输入数据是否是正确的手机号
        isDetectNum: function(num){
            if(typeof (num)!="number" || num.toString(10).length!=6 ||num.toString(10).indexOf('.')!=-1)
            {
                //alert("请输入数字");
                $ionicPopup.alert({
                    title: '输入提示',
                    template:'请输入6位数字验证码',
                    okText: '确认'
                });
                return false;
            }
            return true;
        }
    }

})

.factory('Password',function($ionicPopup){
        //6-20位 字母、数字、下划线、特殊字符组成
        //目前以ASC码表中支持的特殊字符作为基准
        var pattern=/^(\w|[!@#$%^&*.~-]|[:?/\\=+-\[\];()<>|{}'":`]){6,20}$/;
        return{
            //判断输入数据是否是合法的密码
            isValid: function(pw){
                var valid= pattern.test(pw);
                if(!valid){
                    if(pw.length<6||pw.length>20){
                        $ionicPopup.alert({
                            title: '输入提示',
                            template:'请输入6-20位密码',
                            okText: '确认'
                        });
                    }
                    else{
                        $ionicPopup.alert({
                            title: '输入提示',
                            template:'密码中包含不支持的中文或者特殊符号，请重新输入',
                            okText: '确认'
                        });
                    }

                }
                return valid;
            }
        }
    })
;
