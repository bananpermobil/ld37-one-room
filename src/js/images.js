var SpriteSheet = require('../lib/SpriteSheet')

var bg = new Image();
bg.src = "../../assets/images/bg.png";

var guard_stand = new Image();
guard_stand.src = "../../assets/images/guard_stand.png";

var gubbe_stand = new Image();
gubbe_stand.src = "../../assets/images/gubbe_stand.png";

var gubbe_stand_sprite = SpriteSheet.new(gubbe_stand, {
  frames: [1000, 50, 900, 70, 110],
  x: 0,
  y: 0,
  width: 64,
  height: 128,
  restart: true,
  autoPlay: true,
})

var gubbe_standup = new Image();
gubbe_standup.src = "../../assets/images/gubbe_standup.png";

var gubbe_standup_sprite = SpriteSheet.new(gubbe_standup, {
  frames: [2000, 500, 1000, 500, 200, 200, 200],
  x: 0,
  y: 0,
  width: 64,
  height: 128,
  restart: false,
  autoPlay: false,
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

var guard_walking = new Image();
guard_walking.src = "../../assets/images/guard_walk.png";

var guard_walking_sprite_template = {
  frames: [200, 200, 200],
  x: 0,
  y: 0,
  width: 64,
  height: 128,
  restart: true,
  autoPlay: true,
}

var guard_tasering = new Image();
guard_tasering.src = "../../assets/images/guard_taser.png";

var guard_tasering_sprite = SpriteSheet.new(guard_tasering, {
  frames: [40, 40],
  x: 0,
  y: 0,
  width: 64,
  height: 128,
  restart: true,
  autoPlay: true,
})

var door = new Image();
door.src = "../../assets/images/door.png";

var door_sprite = SpriteSheet.new(door, {
  frames: [1, 1],
  x: 0,
  y: 0,
  width: 128,
  height: 128,
  restart: false,
  autoPlay: false,
})

var emotions = new Image();
emotions.src = "../../assets/images/emotions.png";

var emotions_sprite = SpriteSheet.new(emotions, {
  frames: [50, 50, 50, 50],
  x: 0,
  y: 0,
  width: 32,
  height: 32,
  restart: true,
  autoPlay: true,
})

var emotions2 = new Image();
emotions2.src = "../../assets/images/emotions2.png";

var emotions2_sprite = SpriteSheet.new(emotions2, {
  frames: [300, 300],
  x: 0,
  y: 0,
  width: 32,
  height: 32,
  restart: true,
  autoPlay: true,
})

var emotions3 = new Image();
emotions3.src = "../../assets/images/emotions3.png";

var emotions3_sprite = SpriteSheet.new(emotions3, {
  frames: [50, 50, 50],
  x: 0,
  y: 0,
  width: 64,
  height: 64,
  restart: true,
  autoPlay: true,
})

var gubbe_putdown = new Image();
gubbe_putdown.src = "../../assets/images/gubbe_putdown.png";

var gubbe_putdown_sprite = SpriteSheet.new(gubbe_putdown, {
  frames: [500, 500, 500, 500, 500, 500, 500],
  x: 0,
  y: 0,
  width: 128,
  height: 128,
  restart: false,
  autoPlay: false,
})

var gubbe_taserd = new Image();
gubbe_taserd.src = "../../assets/images/gubbe_taserd.png";

var gubbe_taserd_sprite = SpriteSheet.new(gubbe_taserd, {
  frames: [50, 50],
  x: 0,
  y: 0,
  width: 128,
  height: 128,
  restart: true,
  autoPlay: true,
})

var freedom = new Image();
freedom.src = "../../assets/images/freedom.png";

var freedom_sprite = SpriteSheet.new(freedom, {
  frames: [2000, 1],
  x: 0,
  y: 0,
  width: 1024,
  height: 278,
  restart: false,
  autoPlay: false,
})

module.exports = {
  bg: bg,
  gubbe_stand_sprite: gubbe_stand_sprite,
  gubbe_standup_sprite: gubbe_standup_sprite,
  gubbe_walking_sprite: gubbe_walking_sprite,
  door_sprite: door_sprite,
  guard_walking: guard_walking,
  guard_walking_sprite_template: guard_walking_sprite_template,
  guard_stand: guard_stand,
  guard_tasering_sprite: guard_tasering_sprite,
  emotions_sprite: emotions_sprite,
  emotions2_sprite: emotions2_sprite,
  emotions3_sprite: emotions3_sprite,
  gubbe_putdown_sprite: gubbe_putdown_sprite,
  gubbe_taserd_sprite: gubbe_taserd_sprite,
  freedom_sprite: freedom_sprite,
}
