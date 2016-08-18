cardCount = 0

angular.module 'blog' ['ngMaterial']

.config ($stateProvider) !->
  $stateProvider
    .state 'essay', { url: '/essay/{title}', templateUrl: 'html/essay.html' }

.controller 'blogController' ($http, $state) !->
  # 请求博文的数据
  that = @
  $http { method: 'GET', url: '/blog' }
  .then (response) !->
    that.blog = response.data
  , (response) !->
    console.log response

  # 跳转到具体博文的页面
  @jumpToEssay = (title) !->
    $state.go('essay', {title: title})

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