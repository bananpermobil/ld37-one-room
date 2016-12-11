var Ob = require('obscen')
var gameScene = require('./game')
var endScene = require('./end')

window.onload = function () {
  var game = new Ob.Scene(gameScene)
  var end = new Ob.Scene(endScene)

  var sceneManager = new Ob.SceneManager()

  sceneManager.setScenes([
    game,
    end,
  ])

  sceneManager.changeScene('game')

  var canvas = document.getElementById('canvas')
  var renderingContext = canvas.getContext('2d')

  setInterval(function() {
    sceneManager.update()
    sceneManager.draw(renderingContext)
  }, 1000 / 60)
}
