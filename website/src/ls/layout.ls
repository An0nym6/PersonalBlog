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
  @navigateTo = (pageName) !->
    $mdSidenav 'left' .toggle()
    $state.go(pageName);
