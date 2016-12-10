var userInput = require('../lib/userInput')
var SpriteSheet = require('../lib/SpriteSheet')

var canvasWidth = 1024
var canvasHeight = 768

var player = {
  x: 0,
  y: 0,
  w: 64,
  h: 64,
  baseSpeed: 2,
  speed: 2,
  distress: 0,
}

module.exports = {
  name: 'game',
  create: function () {
    console.log('game create', this.sharedObject)

  },
  destroy: function () {
    console.log('game destroy')

  },
  update: function () {
    var pad = userInput.getInput(0)

    player.speed = player.baseSpeed + player.distress * 0.04

    if (pad.buttons[14].pressed) {
      player.x += -player.speed
    } else if (pad.buttons[15].pressed) {
      player.x += player.speed
    }

    if (pad.buttons[0].pressed) {
      player.y += -player.speed
    } else if (pad.buttons[13].pressed) {
      player.y += player.speed
    }

    if (player.x < 0) {
      player.x = 0
    } else if (player.x + player.w > canvasWidth) {
      player.x = canvasWidth - player.w
    }

    if (player.y < 0) {
      player.y = 0
    } else if (player.y + player.h > canvasHeight) {
      player.y = canvasHeight - player.h
    }

    if (pad.buttons[14].pressed ||
        pad.buttons[15].pressed ||
        pad.buttons[13].pressed ||
        pad.buttons[0].pressed) {
      player.distress++
    } else if (player.distress > 0) {
      player.distress -= 4
    }
    
  },
  draw: function (renderingContext) {
    renderingContext.fillStyle = '#000000'
    renderingContext.fillRect(0, 0, canvasWidth, canvasHeight)

    if (player.distress > 450) {
      renderingContext.fillStyle = '#DD0000'
    } else if (player.distress > 320) {
      renderingContext.fillStyle = '#DD4444'
    } else if (player.distress > 200) {
      renderingContext.fillStyle = '#DD9999'
    } else if (player.distress > 90) {
      renderingContext.fillStyle = '#DDBBBB'
    } else {
      renderingContext.fillStyle = '#DDDDDD'
    }
    renderingContext.fillRect(player.x, player.y, player.w, player.h)

  },
}
