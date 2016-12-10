var SpriteSheet = require('../lib/SpriteSheet')

var bg = new Image();
bg.src = "../../assets/images/bg.png";

var gubbe_stand = new Image();
gubbe_stand.src = "../../assets/images/gubbe_stand.png";

var gubbe_stand_sprite = SpriteSheet.new(gubbe_stand, {
  frames: [1000, 50],
  x: 0,
  y: 0,
  width: 64,
  height: 128,
  restart: true,
  autoPlay: true,
})

var gubbe_walking = new Image();
gubbe_walking.src = "../../assets/images/gubbe_walk.png";

var gubbe_walking_sprite = SpriteSheet.new(gubbe_walking, {
  frames: [200, 200, 200],
  x: 0,
  y: 0,
  width: 64,
  height: 128,
  restart: true,
  autoPlay: true,
})

module.exports = {
  bg: bg,
  gubbe_stand_sprite: gubbe_stand_sprite,
  gubbe_walking_sprite: gubbe_walking_sprite,
}
