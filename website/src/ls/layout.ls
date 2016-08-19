angular.module 'Ren-s-Blog' ['ngMaterial', 'ui.router', 'blog', 'show', 'timeline', 'home', 'aboutMe', 'essay']

.config ($mdThemingProvider, $stateProvider, $urlRouterProvider) !->
  # 定义主题
  $mdThemingProvider.theme 'default'
  .primaryPalette 'blue'
  .accentPalette 'pink'

  # 设置路由
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state 'home', { url: '/home', templateUrl: 'html/home.html' }
    .state 'blog', { url: '/blog', templateUrl: 'html/blog.html' }
    .state 'show', { url: '/show', templateUrl: 'html/show.html' }
    .state 'timeline', { url: '/timeline', templateUrl: 'html/timeline.html' }
    .state 'aboutMe', { url: '/about-me', templateUrl: 'html/aboutMe.html' }

.controller 'websiteController' ($mdSidenav, $state, $location, $interval, $http) !->
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
      that.likes = response.data
    , (response) !->
      console.log response
    # 访问量
    $http { method: 'GET', url: '/visits' }
    .then (response) !->
      that.visits = response.data
    , (response) !->
      console.log response
  , 1000
