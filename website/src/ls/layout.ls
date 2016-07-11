angular.module 'Ren-s-Blog' ['ngMaterial']
.config ($mdThemingProvider) !->
  $mdThemingProvider.theme 'default'
  .primaryPalette 'blue'
  .accentPalette 'pink'
.controller 'blogController' ($mdSidenav) !->
  @toggleList = !->
    $mdSidenav 'left' .toggle()
