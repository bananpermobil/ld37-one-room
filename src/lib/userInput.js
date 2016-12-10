const buttonValues = {
  0: {
    buttons: {
      0: {pressed: false},
      1: {pressed: false},
      2: {pressed: false},
      3: {pressed: false},
      4: {pressed: false},
      5: {pressed: false},
      6: {pressed: false},
      7: {pressed: false},
      8: {pressed: false},
      9: {pressed: false},
      10: {pressed: false},
      11: {pressed: false},
      12: {pressed: false},
      13: {pressed: false},
      14: {pressed: false},
      15: {pressed: false},
    }
  }
}

window.addEventListener('keydown', function (e) {
  switch(e.keyCode) {
    case 37: // left
      buttonValues[0].buttons[14].pressed = true
      e.preventDefault();
    break
    case 38: // up
      buttonValues[0].buttons[0].pressed = true
      e.preventDefault();
    break
    case 39: // right
      buttonValues[0].buttons[15].pressed = true
      e.preventDefault();
    break
    case 40: // down
      buttonValues[0].buttons[13].pressed = true
      e.preventDefault();
    break
    case 90: // z (pad button A)
      buttonValues[0].buttons[2].pressed = true
      e.preventDefault();
    break
    case 32: // space
      buttonValues[0].buttons[2].pressed = true
      e.preventDefault();
    break
    // case 88: // x (pad button X)
    //   buttonValues[0].buttons[4].pressed = true
    // break
    // case 67: // c (pad button Y)
    //   buttonValues[0].buttons[4].pressed = true
    // break
  }
})
window.addEventListener('keyup', function(e) {
  switch(e.keyCode) {
      case 37: // left
        buttonValues[0].buttons[14].pressed = false
        e.preventDefault();
      break
      case 38: // up
        buttonValues[0].buttons[0].pressed = false
        e.preventDefault();
      break
      case 39: // right
        buttonValues[0].buttons[15].pressed = false
        e.preventDefault();
      break
      case 40: // down
        buttonValues[0].buttons[13].pressed = false
        e.preventDefault();
      break
      case 90: // z (pad button A)
        buttonValues[0].buttons[2].pressed = false
        e.preventDefault();
      break
      case 32: // space
        buttonValues[0].buttons[2].pressed = false
        e.preventDefault();
      break
      // case 88: // x (pad button X)
      //   buttonValues[0].buttons[4].pressed = false
      // break
      // case 67: // c (pad button Y)
      //   buttonValues[0].buttons[4].pressed = false
      // break
  }
})
window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
  e.gamepad.index, e.gamepad.id,
  e.gamepad.buttons.length, e.gamepad.axes.length)
})

module.exports = {
  getInput: function(playerIndex) {
    return navigator &&
      navigator.getGamepads &&
      navigator.getGamepads()[0] ||
      buttonValues[playerIndex]
  }
}