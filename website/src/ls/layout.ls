angular.module 'Ren-s-Blog' ['ngMaterial']
.config ($mdThemingProvider) !->
  $mdThemingProvider.theme 'toolBar'
  .primaryPalette 'blue'
  .accentPalette 'pink'
.controller 'blogController' ($mdSidenav) !->
  @toggleList = !->
    $mdSidenav 'left' .toggle()
