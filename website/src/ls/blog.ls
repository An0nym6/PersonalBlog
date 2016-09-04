cardCount = 0

angular.module 'blog' ['ngMaterial']

.config ($stateProvider) !->
  $stateProvider
    .state 'essay', { url: '/essay/{title}', templateUrl: 'html/essay.html' }

.controller 'blogController' ($http, $state) !->
  # 加载博文的最大数量
  @numberOfEssays = 10
  @isDisabled = false
  @content = '加载更多'

  that = @

  nomore = !->
    that.isDisabled = true
    that.content = '没有更多了'

  # 请求博文的数据
  $http { method: 'GET', url: '/blog' }
  .then (response) !->
    that.blog = response.data
    if (that.blog.length <= 10)
      nomore()
  , (response) !->
    console.log response

  # 跳转到具体博文的页面
  @jumpToEssay = (title) !->
    $state.go('essay', {title: title})

  # 加载更多的博文
  @loadMoreEssays = !->
    if (@numberOfEssays < @blog.length)
      @numberOfEssays += 10
      if (@numberOfEssays >= @blog.length)
        @isDisabled = true
        @content = '没有更多了'

# 给日期添加颜色
.directive 'repeatDateDirective' ($timeout) ->
  (scope, element, attrs) !->
    $timeout !->
      switch cardCount % 4
      | 0 => element[0].style.color = '#0095F5'
      | 1 => element[0].style.color = '#F12923'
      | 2 => element[0].style.color = '#FF8600'
      | 3 => element[0].style.color = '#4D6A79'
      cardCount++