angular.module 'Ren-s-Blog' ['ngMaterial', 'ui.router', 'angular-clipboard', 'blog', 'show', 'timeline', 'home', 'aboutMe', 'essay', 'admin']

.config ($mdThemingProvider, $stateProvider, $urlRouterProvider) !->
  # 定义主题
  $mdThemingProvider.theme 'default'
  .primaryPalette 'blue'
  .accentPalette 'pink'

  # 设置路由
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state 'home', {url: '/home', templateUrl: 'html/home.html'}
    .state 'blog', {url: '/blog', templateUrl: 'html/blog.html'}
    .state 'show', {url: '/show', templateUrl: 'html/show.html'}
    .state 'timeline', {url: '/timeline', templateUrl: 'html/timeline.html'}
    .state 'aboutMe', {url: '/about-me', templateUrl: 'html/aboutMe.html'}
    # 管理员页面
    .state 'admin', {url: '/the-very-important-page', templateUrl: 'html/admin.html'}

.controller 'websiteController' ($mdSidenav, $mdDialog, $state, $location, $interval, $http, $scope, clipboard) !->
  @toggleList = !->
    $mdSidenav 'left' .toggle()

  @pageSelected =
    blog: ''
    show: ''
    timeline: ''
    home: ''
    aboutMe: ''
  switch $location.$$path
  | '/blog' => @pageSelected.blog = 'active'
  | '/show' => @pageSelected.show = 'active'
  | '/timeline' => @pageSelected.timeline = 'active'
  | '/home' => @pageSelected.home = 'active'
  | '/aboutMe' => @pageSelected.aboutMe = 'active'
  @navigateTo = (pageName) !->
    @pageSelected.blog = ''
    @pageSelected.show = ''
    @pageSelected.timeline = ''
    @pageSelected.home = ''
    @pageSelected.aboutMe = ''
    $mdSidenav 'left' .toggle()
    switch pageName
    | 'blog' => @pageSelected.blog = 'active'
    | 'show' => @pageSelected.show = 'active'
    | 'timeline' => @pageSelected.timeline = 'active'
    | 'home' => @pageSelected.home = 'active'
    | 'aboutMe' => @pageSelected.aboutMe = 'active'
    $state.go pageName

  that = @

  # 实时刷新人数
  $interval !->
    # 点赞
    $http { method: 'GET', url: '/getLikes' }
    .then (response) !->
      temp = response.data + ''
      if temp.indexOf('万') != -1
        that.likes = temp.substring(0, temp.indexOf('万') + 1)
      else
        that.likes = response.data
    , (response) !->
      console.log response
    # 访问量
    $http { method: 'GET', url: '/visits' }
    .then (response) !->
      that.visits = response.data
    , (response) !->
      console.log response
  , 100

  # 点赞和分享 button 的动作
  @plusOneToLikes = !->
    $http { method: 'GET', url: '/likes' }
    .then (response) !->
      that.likes = response.data
    , (response) !->
      console.log response
  @share = (ev) !->
    if !clipboard.supported
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#mainBody')))
          .clickOutsideToClose(true)
          .title('分享失败')
          .textContent('抱歉，功能尚不兼容此浏览器。')
          .ariaLabel('分享网站链接')
          .ok('知道了！')
          .targetEvent(ev)
      );
    else
      clipboard.copyText $location.$$absUrl
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#mainBody')))
          .clickOutsideToClose(true)
          .title('分享成功')
          .textContent('正在浏览的网页链接已复制到剪贴板。')
          .ariaLabel('分享网站链接')
          .ok('知道了！')
          .targetEvent(ev)
      );
