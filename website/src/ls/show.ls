angular.module 'show' ['ngMaterial']

.controller 'showController' ($http) !->
  # 请求创意秀的数据
  that = @
  $http { method: 'GET', url: '/show' }
  .then (response) !->
    that.show = response.data
  , (response) !->
    console.log response