var userInput = require('../lib/userInput')
var SpriteSheet = require('../lib/SpriteSheet')
var images = require('./images')

var canvasWidth = 1024
var canvasHeight = 768

var isWakingUp = false
var wakingUpTime = 60 * 4.6
var wakingUpCount = wakingUpTime

var winningAnimationPlaying = false

var guardCount = 3

var isOnIt = false
var isAtDoor = false

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
  caughtBy: null,
}

var guardFactory = function () {
  var guard = JSON.parse(JSON.stringify({
    shotCooldownStart: 60 + 20 * Math.random(),
    shotCooldown: 67,
    x: 128 + 44 + (64 * Math.random()),
    y: 64 * Math.random(),
    angle: 0,
    speed: 1 + Math.random() * 0.5,
    isWalking: false,
    direction: 'right',
    isTasering: false,
  }))

  guard.guard_walking_sprite = SpriteSheet.new(images.guard_walking, images.guard_walking_sprite_template)

  return guard
}

var guards = []

var shotFactory = function (x, y, targetX, targetY) {
  var dx = targetX - x
  var dy = targetY - y
  var angle = Math.atan2(dy, dx)
  return {
    x: x,
    y: y,
    angle: angle,
    speed: 40,
  }
}

var getClosestGuard = function (_guard) {
  var dist = Math.sqrt(1024 * 1024 + 768 * 768)
  var closestGuard = guards[0]
  for (var i = 0; i < guards.length; i++) {
    var guard = guards[i]
    var dx = guard.x - _guard.x
    var dy = guard.y - _guard.y
    var distToGuard = Math.sqrt(dx * dx + dy * dy)
    if (_guard !== guard && distToGuard < dist) {
      dist = distToGuard
      closestGuard = guard
    }
  }
  if (closestGuard === _guard) {
    return null
  }
  return {
    dist: dist,
    guard: closestGuard,
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
  player.direction = 'left'
  player.caughtBy = null

  guards = []
  guards.push(guardFactory()) // add the first guard

  shots = []

  images.door_sprite.currentFrame = 0

  images.gubbe_putdown_sprite.pause()
  images.gubbe_putdown_sprite.currentFrame = 0

  images.freedom_sprite.pause()
  images.freedom_sprite.currentFrame = 0

  images.gubbe_standup_sprite.currentFrame = 0
  images.gubbe_standup_sprite.play()

  isOnIt = false
  isAtDoor = false
  isWakingUp = true

  winningAnimationPlaying = false

  wakingUpCount = wakingUpTime
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
      images.gubbe_standup_sprite.tick(1000/60)
      wakingUpCount--
      if (wakingUpCount < 0) {
        isWakingUp = false
      }
      return
    } else if (player.caughtBy !== null) {
      images.gubbe_putdown_sprite.tick(1000 / 60)
      images.gubbe_taserd_sprite.tick(1000 / 60)
      images.guard_tasering_sprite.tick(1000 / 60)
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
    if (player.distress > 520 && !isOnIt) {
      isOnIt = true

      isAtDoor = true
      images.door_sprite.currentFrame = 1

    }

    // shoot tranquilizer and walk guards
    if (isAtDoor) {

      var playerMiddleX = player.x - player.w / 2
      var playerMiddleY = player.y - player.h / 2

      for (var i = 0; i < guards.length; i++) {
        var guard = guards[i]
        guard.isWalking = false
        if (guard.shotCooldown < 0) {
          shots.push(shotFactory(guard.x, guard.y, player.x, player.y))
          guard.shotCooldown = guard.shotCooldownStart

          // calc next walk angle
          var dx = player.x - guard.x
          var dy = player.y - guard.y
          var angle = Math.atan2(dy, dx)

          var closestObj = getClosestGuard(guard)

          if (closestObj !== null && closestObj.dist < 100 + 200 * Math.random()) {
            dx = closestObj.guard.x - guard.x
            dy = closestObj.guard.y - guard.y
            angle = Math.atan2(dy, dx) + Math.PI
          }

          guard.angle = angle

        } else if (guard.shotCooldown > guard.shotCooldownStart / 2) {
          
          var dx = Math.cos(guard.angle) * guard.speed
          guard.x += dx
          guard.y += Math.sin(guard.angle) * guard.speed

          // keep inside
          if (guard.x < 64) {
            guard.x = 64
          } else if (guard.x + 32 > canvasWidth - 64) {
            guard.x = canvasWidth - 64
          }

          if (guard.y < 96) {
            guard.y = 96
          } else if (guard.y + 64 > canvasHeight) {
            guard.y = canvasHeight - 64
          }

          guard.guard_walking_sprite.tick(1000/60)
          guard.isWalking = true

          if (dx > 0) {
            guard.direction = 'right'
          } else {
            guard.direction = 'left'
          }

        }

        if (!guard.isWalking) {
          var dx = player.x - guard.x
          var dy = player.y - guard.y
          var angle = Math.atan2(dy, dx)
          angle = Math.abs(angle)
          if (angle > Math.PI * 0.5 && angle < Math.PI * 1.5) {
            guard.direction = 'left'
          } else {
            guard.direction = 'right'
          }
        }

        var a = guard.x - playerMiddleX
        var b = guard.y - playerMiddleY
        var deltaDistance = Math.sqrt(a * a + b * b)

        if (deltaDistance < 100) {
          player.caughtBy = 'taser'

          guard.isTasering = true
          images.guard_tasering_sprite.play()

          setTimeout(function () {
            reset()
          }, 2800)

          return
        }

        guard.shotCooldown--
      }

      if (guards.length < guardCount && Math.random() < 0.05) {
        guards.push(guardFactory())
      }
    }

    // update shots
    for (var i = 0; i < shots.length; i++) {
      var shot = shots[i]
      shot.x += Math.cos(shot.angle) * shot.speed
      shot.y += Math.sin(shot.angle) * shot.speed

      if (isPointInsideRect(shot.x, shot.y, player.x, player.y, player.w, player.h)) {
        player.caughtBy = 'shot'

        images.gubbe_putdown_sprite.play()

        setTimeout(function () {
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
    if (isAtDoor && isPointInsideRect(player.x, player.y, 128 + 44, 32, 72, 64)) {
      winningAnimationPlaying = true
      images.freedom_sprite.play()
      setTimeout(function () {
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

    if (player.caughtBy === 'shot') {
      images.gubbe_putdown_sprite.draw(renderingContext)
    } else if (player.caughtBy === 'taser') {
      images.gubbe_taserd_sprite.draw(renderingContext)
    } else if (!winningAnimationPlaying && !isWakingUp) {
      if (player.isWalking) {
        images.gubbe_walking_sprite.draw(renderingContext)
      } else {
        images.gubbe_stand_sprite.draw(renderingContext)
      }
    }

    renderingContext.restore()

    if (player.caughtBy === null && !winningAnimationPlaying && !isWakingUp) {
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
        renderingContext.arc(shot.x, shot.y, 5, 0, Math.PI * 2, false)
        renderingContext.fillStyle = '#FF0000'
        renderingContext.fill()
        renderingContext.closePath()

      }
    }

    if (isAtDoor) {

      guards = guards.sort(function (a, b) {
        return a.y > b.y
      })

      for (var i = 0; i < guards.length; i++) {
        var guard = guards[i]
        renderingContext.save()
        if (guard.direction === 'left') {
          renderingContext.translate(guard.x + 64, guard.y - 64)
          renderingContext.scale(-1, 1)
        } else {
          renderingContext.translate(guard.x, guard.y - 64)
        }

        if (guard.isTasering) {
          images.guard_tasering_sprite.draw(renderingContext)
          renderingContext.restore()
        } else if (guard.isWalking) {
          guard.guard_walking_sprite.draw(renderingContext)
          renderingContext.restore()
        } else {
          renderingContext.drawImage(images.guard_stand, 0, 0)
          renderingContext.restore()
        }
      }

    }


    if (isWakingUp) {

      renderingContext.save()
      renderingContext.translate(player.x, player.y - 64)
      images.gubbe_standup_sprite.draw(renderingContext)
      renderingContext.restore()

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
