var userInput = require('../lib/userInput')
var SpriteSheet = require('../lib/SpriteSheet')
var images = require('./images')

var canvasWidth = 1024
var canvasHeight = 768

var isWakingUp = false
var isFallingAsleep = false

var player = {
  x: 0,
  y: 0,
  w: 64,
  h: 64,
  baseSpeed: 2,
  speed: 2,
  distress: 0,
}

var guard1 = {
  isOnIt: false,
  isAtDoor: false,
  shotCooldownStart: 67,
  shotCooldown: 67,
  x: 64,
  y: 0,
  speed: 1.2,
}

var shotFactory = function (x, y, targetX, targetY) {
  var dx = targetX - x
  var dy = targetY - y
  var angle = Math.atan2(dy, dx)
  return {
    x: x,
    y: y,
    angle: angle,
    speed: 50,
  }
}

var isPointInsideRect = function (x, y, rx, ry, rw, rh) {
  return x > rx && x < rx + rw &&
      y > ry && y < ry + rh
}

var shots = []

var reset = function () {
  player.x = 900
  player.y = 400
  player.distress = 0
  player.speed = player.baseSpeed

  guard1.isOnIt = false
  guard1.isAtDoor = false
  guard1.shotCooldown = guard1.shotCooldownStart
  guard1.x = 64
  guard1.y = 0

  shots = []
}

module.exports = {
  name: 'game',
  create: function () {
    console.log('game create', this.sharedObject)
    reset()
  },
  destroy: function () {
    console.log('game destroy')

  },
  update: function () {

    if (isWakingUp) {
      return
    } else if (isFallingAsleep) {
      return
    }

    var pad = userInput.getInput(0)

    // distress heightens speed
    if (player.distress > 90) {
      player.speed = player.baseSpeed + (player.distress - 90) * 0.04
    }

    // d-pad
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

    // keep inside screen
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

    // heighten distress if moving
    if (pad.buttons[14].pressed ||
        pad.buttons[15].pressed ||
        pad.buttons[13].pressed ||
        pad.buttons[0].pressed) {
      player.distress++
    } else if (player.distress > 0) {
      player.distress -= 6
    }

    // trigger guard
    if (player.distress > 450 && !guard1.isOnIt) {
      guard1.isOnIt = true
      guard1.isAtDoor = true
    }

    // shoot tranquilizer
    if (guard1.isAtDoor) {
      if (guard1.shotCooldown < 0) {
        shots.push(shotFactory(guard1.x, guard1.y, player.x, player.y))
        guard1.shotCooldown = guard1.shotCooldownStart
      } else if (guard1.shotCooldown > guard1.shotCooldownStart / 2) {
        var dx = player.x - guard1.x
        var dy = player.y - guard1.y
        var angle = Math.atan2(dy, dx)
        guard1.x += Math.cos(angle) * guard1.speed
        guard1.y += Math.sin(angle) * guard1.speed
      }

      guard1.shotCooldown--
    }

    // update shots
    for (var i = 0; i < shots.length; i++) {
      var shot = shots[i]
      shot.x += Math.cos(shot.angle) * shot.speed
      shot.y += Math.sin(shot.angle) * shot.speed

      if (isPointInsideRect(shot.x, shot.y, player.x, player.y, player.w, player.h)) {
        isFallingAsleep = true
      }
    }

    // update sprites
    images.gubbe_stand_sprite.pause()
    if (Math.random() < 0.1) {
      images.gubbe_stand_sprite.play()
    }
    images.gubbe_stand_sprite.tick()

    
  },
  draw: function (renderingContext) {
    renderingContext.fillStyle = '#B0B4BA'
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

    renderingContext.save()
    renderingContext.translate(player.x, player.y - 64)
    images.gubbe_stand_sprite.draw(renderingContext)
    renderingContext.restore()


    if (guard1.isAtDoor) {
      renderingContext.fillStyle = '#0044AA'
      renderingContext.fillRect(guard1.x, guard1.y, 64, 64)
    }

    for (var i = 0; i < shots.length; i++) {
      var shot = shots[i]
      renderingContext.beginPath()
      renderingContext.arc(shot.x, shot.y, 10, 0, Math.PI * 2, false)
      renderingContext.fillStyle = '#FF0000'
      renderingContext.fill()
      renderingContext.closePath()

    }

  },
}
