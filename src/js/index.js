var Ob = require('obscen')
var gameScene = require('./game')
// var splashScene = require('./splash')

localStorage.debug = 'obscen:*'

window.onload = function () {
  var game = new Ob.Scene(gameScene)
  // var splash = new Ob.Scene(splashScene)

  var sceneManager = new Ob.SceneManager()

  sceneManager.setScenes([
    // splash,
    game,
  ])

  sceneManager.changeScene('game')

  var canvas = document.getElementById('canvas')
  var renderingContext = canvas.getContext('2d')

  setInterval(function() {
    sceneManager.update()
    sceneManager.draw(renderingContext)
  }, 1000 / 60)
}
