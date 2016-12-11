var images = require('./images')

module.exports = {
  name: 'end',
  create: function () {
    
  },
  destroy: function () {
    
  },
  update: function () {
    
  },
  draw: function (renderingContext) {
    renderingContext.drawImage(images.endbg, 0, 0)
  },
}
