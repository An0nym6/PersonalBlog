angular.module 'aboutMe' ['ngMaterial', 'ngMessages']

.controller 'aboutMeController' ($http, $scope) !->
  # 请求留言板的数据
  that = @
  $http { method: 'GET', url: '/aboutMeComments' }
  .then (response) !->
    that.comments = response.data
  , (response) !->
    console.log response

  $scope.comment = {}

  # 发送新的留言
  @submit = !->
    that = @
    name = addComment.name.value
    addComment.name.value = ''
    text = addComment.text.value
    addComment.text.value = ''
    $http { method: 'POST', url: '/aboutMeComments', data: { name: name, text: text } }
    .then (response) !->
      that.comments = response.data
    , (response) !->
      console.log response
