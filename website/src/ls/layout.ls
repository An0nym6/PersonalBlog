angular.module 'Ren-s-Blog' ['ngMaterial', 'ui.router']

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

.controller 'blogController' ($mdSidenav, $state) !->
  @toggleList = !->
    $mdSidenav 'left' .toggle()
  
  @pageSelected =
    blog: ''
    show: ''
    timeline: ''
    home: ''
    aboutMe: ''
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
