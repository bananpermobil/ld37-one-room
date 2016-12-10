module.exports = {
  name: 'splash',
  create: function () {
    console.log('splash create', this.sharedObject)
    this.sharedObject.hej = 'hejjj'
  },
  destroy: function () {
    console.log('splash destroy')
  },
  update: function () {
    console.log('splash update')
  },
  draw: function () {
    console.log('splash draw')
  },
}
