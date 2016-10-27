angular.module 'admin' ['ngMaterial']

.controller 'adminController' ($http, $mdDialog) !->
  # 弹窗函数
  alertMessage = (message, ev) !->
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#mainBody')))
        .clickOutsideToClose(true)
        .title('系统提示')
        .textContent(message)
        .ariaLabel('系统提示')
        .ok('知道了！')
        .targetEvent(ev)
    );

  # 博文管理
  # 请求博文的数据
  that = @
  $http { method: 'GET', url: '/blog' }
  .then (response) !->
    that.blog = response.data
  , (response) !->
    console.log response
  # 创建博文
  @submitEssay = (ev) !->
    $http { method: 'POST', url: '/addEssay', data: { title: addEssay.essayTitle.value, details: addEssay.essayDetails.value, content: addEssay.essayContent.value, date: addEssay.essayDate.value } }
    .then (response) !->
      if (response.data == 'success')
        alertMessage('博文已成功发布。', ev);
      else
        alertMessage('博文发布失败，需要查明原因。', ev);
    , (response) !->
      console.log response
  # 删除博文
  @deleteEssay = (title, ev) !->
    $http { method: 'POST', url: '/deleteEssay', data: { title: title } }
    .then (response) !->
      if (response.data == 'success')
        alertMessage('博文已被成功删除。', ev);
      else
        alertMessage('博文删除失败，需要查明原因。', ev);
    , (response) !->
      console.log response

  # 创意秀管理
  # 请求创意秀的数据
  $http { method: 'GET', url: '/show' }
  .then (response) !->
    that.shows = response.data
  , (response) !->
    console.log response
  # 创建创意秀
  @submitShow = (ev) !->
    $http { method: 'POST', url: '/addShow', data: { imgUrl: addShow.showImage.value, title: addShow.showTitle.value, details: addShow.showDetails.value } }
    .then (response) !->
      if (response.data == 'success')
        alertMessage('创意秀已成功发布。', ev);
      else
        alertMessage('创意秀发布失败，需要查明原因。', ev);
    , (response) !->
      console.log response
  # 删除创意秀
  @deleteShow = (title, ev) !->
    $http { method: 'POST', url: '/deleteShow', data: { title: title } }
    .then (response) !->
      if (response.data == 'success')
        alertMessage('创意秀已被成功删除。', ev);
      else
        alertMessage('创意秀删除失败，需要查明原因。', ev);
    , (response) !->
      console.log response

  # 时间轴管理
  # 请求时间轴数据
  $http { method: 'GET', url: '/timeline' }
  .then (response) !->
    that.timeline = response.data
  , (response) !->
    console.log response
  # 创建时间节点
  @submitTimePoint = (ev) !->
    $http { method: 'POST', url: '/addTimePoint', data: { icon: addTimePoint.timePointIcon.value, imgUrl: addTimePoint.timePointImage.value, title: addTimePoint.timePointTitle.value, details: addTimePoint.timePointDetails.value, time: addTimePoint.timePointTime.value } }
    .then (response) !->
      if (response.data == 'success')
        alertMessage('时间节点已成功发布。', ev);
      else
        alertMessage('时间节点发布失败，需要查明原因。', ev);
    , (response) !->
      console.log response
  # 删除时间节点
  @deleteTimePoint = (title, ev) !->
    $http { method: 'POST', url: '/deleteTimePoint', data: { title: title } }
    .then (response) !->
      if (response.data == 'success')
        alertMessage('时间节点已被成功删除。', ev);
      else
        alertMessage('时间节点删除失败，需要查明原因。', ev);
    , (response) !->
      console.log response
