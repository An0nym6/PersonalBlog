angular.module 'timeline' ['ngMaterial']

.controller 'timelineController' ($http, $interval, dataService) !->
  # 请求时间轴的数据
  that = @
  $http { method: 'GET', url: '/timeline' }
  .then (response) !->
    that.timeline = response.data
  , (response) !->
    console.log response

  # 初始化 dataService
  dataService.points = []
  dataService.cards = []
  dataService.counter = 0
  dataService.height = 44

  # 实时刷新大小
  $interval !->
    resize()
  , 100
  
  resize = !->
    dataService.counter = 0
    dataService.height = 44
    for i from 0 to dataService.cards.length - 1 by 1
      # 计算时间轴的长度
      if document.getElementById('placeholder') != null &&
         document.getElementById('line-of-timeline') != null &&
         document.getElementById('end-circle') != null
        placeholderHeight = document.getElementById 'placeholder' .offsetHeight
        document.getElementById 'line-of-timeline' .style.height = 72 + placeholderHeight + 'px'
        document.getElementById 'end-circle' .style.top = 128 + placeholderHeight + 'px'
        # 计算时间节点的位置
        top = dataService.height + dataService.cards[i][0].offsetHeight / 2
        dataService.points[i][0].style.top = top + 'px'
        dataService.counter++
        dataService.height += dataService.cards[i][0].offsetHeight

  # 为某个时间节点点赞
  @plusOneToLikes = (title) !->
    $http { method: 'POST', url: '/likeATimePoint', data: { title: title } }
    .then (response) !->
      that.timeline = response.data
    , (response) !->
      console.log response

# 用指令将对应的元素添加进 dataService
.directive 'repeatPointDirective' (dataService) ->
  (scope, element, attrs) !->
    dataService.points.push element

.directive 'repeatCardDirective' ($timeout, dataService) ->
  (scope, element, attrs) !->
    $timeout !->
      dataService.cards.push(element)

.factory 'dataService', [ ->
  points: [],
  cards: [],
  counter: 0,
  height: 44
]
