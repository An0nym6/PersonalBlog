angular.module 'home' ['ngMaterial']

.controller 'homeController' ($interval) !->
  # 实时刷新大小
  $interval !->
    gameContainer = document.getElementById 'gameContainer'
    gameFrame = document.getElementById 'gameFrame'
    waiting = document.getElementById 'waiting'
    if gameContainer != null && gameFrame != null && waiting != null && gameFrame.contentWindow.document.body != null
      gameContainer.style.height = gameContainer.offsetWidth + 'px'
      gameFrame.style.width = gameContainer.offsetWidth + 'px'
      gameFrame.style.height = gameContainer.offsetWidth + 'px'
      waiting.style.height = gameContainer.offsetWidth + 'px'
      waiting.style.paddingTop = (gameContainer.offsetWidth / 2 - 25) + 'px'
      gameFrame.contentWindow.document.body.style.width = gameContainer.offsetWidth + 'px'
  , 100

  window.gameOnLoad = !->
    waiting = document.getElementById 'waiting'
    if waiting != null
      waiting.style.opacity = '0'
      setTimeout('waiting.style.display = "none"', 600)
