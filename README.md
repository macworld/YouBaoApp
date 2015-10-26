掌邮宝客户端

ionic开发平台搭建指南：
http://ionicframework.com/getting-started/    (官网搭建指南)

国内ionic开发视频教程，第一课中含开发平台搭建框架:
链接: http://pan.baidu.com/s/1sjlwRt7 密码: fy99




ionic开发基本文档资源:

http://docs.angularjs.cn/api    angularJs 官方API文档
http://ionicframework.com/docs/   ionic官方开发文档


项目Github上传须知:
目前本人是删去platforms/android/build   文件夹，该文件夹是android版本的生成文件
其他文件暂时没有确切知道如何精简，故当前工程略大==


项目当前bug:(有兴趣可以帮忙看下)
1. “专区” 页面中，由于ionic中没有找到两个select放在一个item中的案例，自己实现两连个选择框放在一个item中的方法，但是目前存在问题是，几乎无论点击该item任意点，"全部显示"(第一个选择框)几乎总是被响应，“综合排序”(第二个选择框)很难被选中，且即使选中点击选项后页面中的选项也不会对应切换。

2. "私信"聊天页面中，点击输入框的"加号"，摄像功能无法调用，几乎网上的方法都试过了，暂时还未解决===

3. 聊天页面输入框点击后，弹出键盘后，页面内容没有被顶上去，也就是说，键盘会覆盖当前的部分页面，导致用户很不方便看到自己需要的信息。

