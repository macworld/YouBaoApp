angular.module('ZhangYouBao.services', [])

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
;
