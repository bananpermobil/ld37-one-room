var buzz = require('buzz')

var music1 = new buzz.sound('/assets/music/music1.ogg', {
  loop: true,
})

var music2 = new buzz.sound('/assets/music/music2.ogg', {
  loop: true,
})

var music3 = new buzz.sound('/assets/music/music3.ogg', {
  loop: true,
})

var music4 = new buzz.sound('/assets/music/music4.ogg', {
  loop: true,
})

var taser = new buzz.sound('/assets/sounds/sound_taser.ogg', {
  loop: true,
})

var putdown = new buzz.sound('/assets/sounds/sound_putdown.ogg', {
})

module.exports = {
  music1: music1,
  music2: music2,
  music3: music3,
  music4: music4,
  taser: taser,
  putdown: putdown,
}
