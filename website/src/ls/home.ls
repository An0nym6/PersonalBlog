angular.module 'home' ['ngMaterial']

.controller 'homeController' ($interval) !->
  # 实时刷新大小
  $interval !->
    gameContainer = document.getElementById 'gameContainer'
    gameFrame = document.getElementById 'gameFrame'
    if gameContainer != null && gameFrame != null
      gameContainer.style.height = gameContainer.offsetWidth + 'px'
      gameFrame.style.width = gameContainer.offsetWidth + 'px'
      gameFrame.style.height = gameContainer.offsetWidth + 'px'
      gameFrame.contentWindow.document.body.style.width = gameContainer.offsetWidth + 'px'
  , 100