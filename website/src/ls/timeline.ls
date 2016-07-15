angular.module 'timeline' ['ngMaterial']

.controller 'timelineController' ($http, dataService) !->
  # 请求时间轴的数据
  that = @
  $http { method: 'GET', url: '/timeline' }
  .then (response) !->
    that.timeline = response.data
  , (response) !->
    console.log response

  # 初始化 dataService
  dataService.points = []
  dataService.counter = 0
  dataService.height = 44

.directive 'repeatPointDirective' (dataService) ->
  (scope, element, attrs) !->
    dataService.points.push element

.directive 'repeatCardDirective' ($timeout, dataService) ->
  (scope, element, attrs) !->
    $timeout !->
      # 计算时间节点的位置
      top = dataService.height + element[0].offsetHeight / 2
      dataService.points[dataService.counter][0].style.top = top + 'px'
      dataService.counter++
      dataService.height += element[0].offsetHeight

      if scope.$last
        # 计算时间轴的长度
        placeholderHeight = document.getElementById 'placeholder' .offsetHeight
        document.getElementById 'line-of-timeline' .style.height = 72 + placeholderHeight + 'px'

.factory 'dataService', [ ->
  points: [],
  counter: 0,
  height: 44
]
