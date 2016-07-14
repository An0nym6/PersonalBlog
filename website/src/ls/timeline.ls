angular.module 'timeline' ['ngMaterial']

.controller 'timelineController' ($http) !->
  @timelineHeight = 2048
  that = @

  # 请求时间轴的数据
  $http { method: 'GET', url: '/timeline' }
  .then (response) !->
    that.timeline = response.data
  , (response) !->
    console.log response
