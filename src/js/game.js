var userInput = require('../lib/userInput')
var SpriteSheet = require('../lib/SpriteSheet')
var images = require('./images')

var canvasWidth = 1024
var canvasHeight = 768

var isWakingUp = false
var wakingUpTime = 60 * 2
var wakingUpCount = wakingUpTime

var isFallingAsleep = false
var winningAnimationPlaying = false

var guardCount = 1

var player = {
  x: 0,
  y: 0,
  w: 64,
  h: 64,
  baseSpeed: 3,
  speed: 2,
  distress: 0,
  direction: 'left',
  isWalking: false,
}

var guardFactory = function () {
  return JSON.parse(JSON.stringify({
    isOnIt: false,
    isAtDoor: false,
    shotCooldownStart: 67,
    shotCooldown: 67,
    x: 128 + 44,
    y: 32,
    speed: 1.2,
    isWalking: false,
    direction: 'right',
  }))
}

var guard1 = guardFactory()

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
  player.isWalking = false

  guard1 = guardFactory()

  shots = []

  images.door_sprite.currentFrame = 0

  images.gubbe_putdown_sprite.pause()
  images.gubbe_putdown_sprite.currentFrame = 0

  images.freedom_sprite.pause()
  images.freedom_sprite.currentFrame = 0

  isFallingAsleep = false
  winningAnimationPlaying = false

  wakingUpCount = wakingUpTime
}

module.exports = {
  name: 'game',
  create: function () {
    console.log('game create', this.sharedObject)
    isWakingUp = true
    reset()
  },
  destroy: function () {
    console.log('game destroy')

  },
  update: function () {

    if (isWakingUp) {
      wakingUpCount--
      if (wakingUpCount < 0) {
        isWakingUp = false
      }
      return
    } else if (isFallingAsleep) {
      images.gubbe_putdown_sprite.tick(1000 / 60)
      return
    } else if (winningAnimationPlaying) {
      images.freedom_sprite.tick(1000 / 60)
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
      player.direction = 'left'
    } else if (pad.buttons[15].pressed) {
      player.x += player.speed
      player.direction = 'right'
    }

    if (pad.buttons[0].pressed) {
      player.y += -player.speed
    } else if (pad.buttons[13].pressed) {
      player.y += player.speed
    }

    // keep inside
    if (player.x < 48) {
      player.x = 48
    } else if (player.x + player.w > canvasWidth - 48) {
      player.x = canvasWidth - player.w - 48
    }

    if (player.y < 64) {
      player.y = 64
    } else if (player.y + player.h > canvasHeight) {
      player.y = canvasHeight - player.h
    }

    // heighten distress if moving
    if (pad.buttons[14].pressed ||
        pad.buttons[15].pressed ||
        pad.buttons[13].pressed ||
        pad.buttons[0].pressed) {
      player.distress++
      player.isWalking = true
    } else if (player.distress > 0) {
      player.distress -= 6
      player.isWalking = false
    }

    // trigger guard
    if (player.distress > 520 && !guard1.isOnIt) {
      guard1.isOnIt = true

      guard1.isAtDoor = true
      images.door_sprite.currentFrame = 1

    }

    // shoot tranquilizer
    if (guard1.isAtDoor) {
      guard1.isWalking = false
      if (guard1.shotCooldown < 0) {
        shots.push(shotFactory(guard1.x, guard1.y, player.x, player.y))
        guard1.shotCooldown = guard1.shotCooldownStart
      } else if (guard1.shotCooldown > guard1.shotCooldownStart / 2) {
        var dx = player.x - guard1.x
        var dy = player.y - guard1.y
        var angle = Math.atan2(dy, dx)
        guard1.x += Math.cos(angle) * guard1.speed
        guard1.y += Math.sin(angle) * guard1.speed

        images.guard_walking_sprite.tick(1000/60)
        guard1.isWalking = true

        if (dx > 0) {
          guard1.direction = 'right'
        } else {
          guard1.direction = 'left'
        }
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

        images.gubbe_putdown_sprite.play()

        setTimeout(function () {
          isWakingUp = true
          reset()
        }, 4000)
      }
    }

    // update sprites
    images.gubbe_stand_sprite.tick((1000 / 60) * Math.random())
    images.gubbe_walking_sprite.tick((1000 / 60) * player.speed / 1.8)

    images.emotions2_sprite.tick(1000 / 60 * player.distress / 100)
    images.emotions_sprite.tick((1000 / 60) * player.distress / 100)
    images.emotions3_sprite.tick((1000 / 60) * player.distress / 100)

    // is player at win trigger
    if (isPointInsideRect(player.x, player.y, 128 + 44, 32, 72, 64)) {
      winningAnimationPlaying = true
      images.freedom_sprite.play()
      setTimeout(function () {
        isWakingUp = true
        reset()
      }, 6000)
    }

  },
  draw: function (renderingContext) {
    renderingContext.drawImage(images.bg, 0, 0)

    renderingContext.save()
    renderingContext.translate(128, 0)
    images.door_sprite.draw(renderingContext)
    renderingContext.restore()

    renderingContext.save()
    if (player.direction === 'left') {
      renderingContext.translate(player.x + 64, player.y - 64)
      renderingContext.scale(-1, 1)
    } else {
      renderingContext.translate(player.x, player.y - 64)
    }

    if (isFallingAsleep) {
      images.gubbe_putdown_sprite.draw(renderingContext)
    } else if (!winningAnimationPlaying) {
      if (player.isWalking) {
        images.gubbe_walking_sprite.draw(renderingContext)
      } else {
        images.gubbe_stand_sprite.draw(renderingContext)
      }
    }

    renderingContext.restore()

    if (!isFallingAsleep && !winningAnimationPlaying) {
      if (player.distress > 480) {
        renderingContext.save()
        renderingContext.translate(player.x, player.y - 76)
        images.emotions3_sprite.draw(renderingContext)
        renderingContext.restore()
      } else if (player.distress > 380) {
        renderingContext.save()
        renderingContext.translate(player.x + 16, player.y - 96)
        images.emotions_sprite.draw(renderingContext)
        renderingContext.restore()
      } else if (player.distress > 90) {
        renderingContext.save()
        renderingContext.translate(player.x + 16, player.y - 96)
        images.emotions2_sprite.draw(renderingContext)
        renderingContext.restore()
      }

      for (var i = 0; i < shots.length; i++) {
        var shot = shots[i]
        renderingContext.beginPath()
        renderingContext.arc(shot.x, shot.y, 3, 0, Math.PI * 2, false)
        renderingContext.fillStyle = '#FF0000'
        renderingContext.fill()
        renderingContext.closePath()

      }
    }

    if (guard1.isAtDoor) {

      // renderingContext.fillStyle = '#FFFF00'
      // renderingContext.fillRect(128 + 44, 32, 72, 64)

      renderingContext.save()
      if (guard1.direction === 'left') {
        renderingContext.translate(guard1.x + 64, guard1.y - 64)
        renderingContext.scale(-1, 1)
      } else {
        renderingContext.translate(guard1.x, guard1.y - 64)
      }

      if (guard1.isWalking) {
        images.guard_walking_sprite.draw(renderingContext)
        renderingContext.restore()
      } else {
        renderingContext.restore()
        renderingContext.drawImage(images.guard_stand, guard1.x, guard1.y - 64)
      }

    }


    if (isWakingUp) {
      var alpha = wakingUpCount / wakingUpTime
      renderingContext.fillStyle = 'rgba(0, 0, 0, ' + alpha + ')'
      renderingContext.fillRect(0, 0, canvasWidth, canvasHeight)
    }

    if (winningAnimationPlaying) {
      renderingContext.save()
      renderingContext.translate(0, 141)
      images.freedom_sprite.draw(renderingContext)
      renderingContext.restore()
    }

  },
}
