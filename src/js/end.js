var images = require('./images')
var sounds = require('./sounds')

module.exports = {
  name: 'end',
  create: function () {
    sounds.music1.setSpeed(0.5).setVolume(15)
  },
  destroy: function () {

  },
  update: function () {
  },
  draw: function (renderingContext) {
    renderingContext.drawImage(images.endbg, 0, 0)
  },
}
