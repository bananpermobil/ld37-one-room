var SpriteSheet = require('../lib/SpriteSheet')

var gubbe_stand = new Image();
gubbe_stand.src = "../../assets/images/gubbe_stand.png";

var gubbe_stand_sprite = SpriteSheet.new(gubbe_stand, {
  frames: [200, 5],
  x: 0,
  y: 0,
  width: 64,
  height: 128,
  restart: true,
  autoPlay: true,
})

module.exports = {
  gubbe_stand_sprite: gubbe_stand_sprite,
}
