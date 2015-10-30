/**
 * Created by wujin on 2015/10/19.
 * 用于专区页面的控制器
 */
rootModule.controller('CategoryCtrl',function($scope,$window,$ionicScrollDelegate,$state) {
    $scope.isClicked=[true,false,false];
    $scope.subTitles=['邮票','钱币','卡片'];
    //各个标题对应的分区
    //注：关于分区是写死还是每次打开时查看是否有更新，无更新就按照当前存储的分区来，有新分区就获取新的分区资料，即分区是固定不变的还是需要按需变化的
    $scope.Topics=new Array();
    $scope.Topics[0]=['版张专区','版票专区','小型张/小全张','小本票/大本册','纪特文编JT新票','纪特文编JT销封','邮票片JP','JF封/其他封','邮资片TP/YP/FP','普封普片','贺年封片简卡','港澳邮票','个性化原票','普区民清加改欠外','年册/集邮工具','产品票/礼品册'];
    $scope.Topics[1]=['现代金银贵金属币','流通纪念币','一二三版纸币','古币/银元','联体钞/纪念钞','港澳台钱币','清朝/民国纸币','贵金属/纪念章'];
    $scope.Topics[2]=['卡片测试1','卡片测试2'];
    $scope.choosenTopic=0;
    //默认选择邮票区
    $scope.currTopics=$scope.Topics[0];
    //用于监控当前的页面的宽度，并且在宽度变化时重新刷新页面
    //注意： 必须通过function返回$window.innerWidth的方式进行监控，直接监控$window.innerWidth并没有用
    //在实际使用中并不一定有用
    $scope.$watch(function()
    {
        return $window.innerWidth;
    },function(newValue, oldValue)
    {
        if(newValue!=oldValue)
        {
            $window.location.reload(true);
        }
    });
    $scope.sideMenuWidth=$window.innerWidth/3;
    $scope.OnSubTitleClick=function(index)
    {
        for(var i=0;i<$scope.isClicked.length;i++)
        {
            if(i==index)
            {
                $scope.isClicked[i]=true;
                $scope.currTopics=$scope.Topics[i];
                $scope.choosenTopic=0;
                $ionicScrollDelegate.resize();
            }
            else
            {
                $scope.isClicked[i]=false;
            }

        }
    };

    $scope.OnTopicClick=function(index)
    {
        $scope.choosenTopic=index;
    };


});