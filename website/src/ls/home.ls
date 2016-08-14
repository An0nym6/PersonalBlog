angular.module 'home' ['ngMaterial']

.controller 'homeController' ($http, $interval, dataService) !->
  # 实时刷新大小
  $interval !->
    gameContainer = document.getElementById 'gameContainer'
    gameFrame = document.getElementById 'gameFrame'
    if gameContainer != null && gameFrame != null
      gameContainer.style.height = gameContainer.offsetWidth + 'px'
      gameFrame.style.width = gameContainer.offsetWidth + 'px'
      gameFrame.style.height = gameContainer.offsetWidth + 'px'
  , 100