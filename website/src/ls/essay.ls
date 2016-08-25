angular.module 'essay' ['ngMaterial', 'hc.marked']

.controller 'essayController' ($http, $location, $scope, $cookies) !->
  # 请求博文的数据
  $http { method: 'POST', url: '/essay', data: { title: $location.$$path.split('/')[2] } }
  .then (response) !->
    $scope.essay = response.data
  , (response) !->
    console.log response

  # 请求博文评论的数据
  that = @
  $http { method: 'POST', url: '/essayComments', data: { title: $location.$$path.split('/')[2] } }
  .then (response) !->
    that.comments = response.data
  , (response) !->
    console.log response
  # 请求博文的点赞
  $http { method: 'POST', url: '/essayLikes', data: { title: $location.$$path.split('/')[2] } }
  .then (response) !->
    that.likes = response.data
  , (response) !->
    console.log response

  # 设置 cookies
  $scope.comment = {}

  $scope.isKeepName = false
  $scope.comment.name = ''
  isKeepName = $cookies.get 'isKeepName'
  keepName = $cookies.get 'keepName'
  if isKeepName == 'true' && keepName != undefined
    $scope.isKeepName = true
    $scope.comment.name = keepName

  # 发送新的留言
  @submit = !->
    # 设置 cookies
    $cookies.put('isKeepName', $scope.isKeepName)
    $cookies.put('keepName', $scope.comment.name)

    that = @
    name = addComment.name.value
    if ($scope.isKeepName == false)
      addComment.name.value = ''
    text = addComment.text.value
    addComment.text.value = ''
    $http { method: 'POST', url: '/addEssayComments', data: { title: $location.$$path.split('/')[2], name: name, text: text } }
    .then (response) !->
      that.comments = response.data
    , (response) !->
      console.log response

  # 给博文点赞
  @plusOneToLikes = !->
    $http { method: 'POST', url: '/likeAnEssay', data: { title: $location.$$path.split('/')[2] } }
    .then (response) !->
      that.likes = response.data
    , (response) !->
      console.log response

  # 回退
  @back = !->
    window.history.back()