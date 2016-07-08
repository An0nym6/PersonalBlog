angular.module 'Ren-s-Blog' ['ngMaterial']
.config ($mdThemingProvider) !->
  $mdThemingProvider.theme 'default'
  .primaryPalette 'blue'
  .accentPalette 'green'
.controller 'blogController' ($mdSidenav) !->
  # 左边栏的收放，有问题
  @toggleUsersList = !->
    $mdSidenav 'left' .toggle()
    console.log 1
