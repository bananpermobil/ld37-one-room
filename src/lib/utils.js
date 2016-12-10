define('utils', [], function () {
  return {
    copy: function (obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    cap: function (value, min, max) {
      if (value < max) {
        return Math.max(value, min)
      }
      return max
    },
    interpolateLinear: function (steps, start, end) {
      const result = []
      const stepValue = (end - start) / (steps - 1)
      for (let i = 0; i < steps; i++) {
        result.push(start + stepValue * i)
      }
      return result
    },
    getNormalizedVector: function (angle) {
      return {
        x: Math.round(Math.cos(angle)),
        y: Math.round(Math.sin(angle)),
      }
    },
    normalizeVector(vector, magnitude) {
      var angle = this.getAngle({x: 0, y: 0}, vector)
      var normalized = this.getNormalizedVector(angle)
      normalized.x = normalized.x * magnitude;
      normalized.y = normalized.y * magnitude;
      return normalized;
    },
    getAngle: function (position1, position2) {
      const dx = position2.x - position1.x
      const dy = position2.y - position1.y
      return Math.atan2(dy, dx)
    },
    addVectors: function (vector1, vector2) {
      return {
        x: vector1.x + vector2.x,
        y: vector1.y + vector2.y,
      }
    },
    isXYInsideRect: function (x, y, rx, ry, rw, rh) {
      return (x > rx && x < rx + rw) &&
          (y > ry && y < ry + rh)
    },
    isAABBOverlappingPoint(aabb, point) {
      return point.x > aabb.x &&
          point.x < aabb.x + aabb.width &&
          point.y > aabb.y &&
          point.y < aabb.y + aabb.height
    },
    isAABBOverlappingAABB(comparator, comparee) {
      const topLeft = { x: comparator.x, y: comparator.y }
      const topCenter = { x: comparator.x + comparator.width / 2, y: comparator.y }
      const topRight = { x: comparator.x + comparator.width, y: comparator.y }
      const middleRight  = { x: comparator.x + comparator.width, y: comparator.y + comparator.height / 2 }
      const center  = { x: comparator.x + comparator.width / 2, y: comparator.y + comparator.height / 2 }
      const bottomLeft = { x: comparator.x, y: comparator.y + comparator.height }
      const bottomRight = { x: comparator.x + comparator.width, y: comparator.y + comparator.height }

      return this.isAABBOverlappingPoint(comparee, topLeft)    ||
             this.isAABBOverlappingPoint(comparee, topCenter)  ||
             this.isAABBOverlappingPoint(comparee, topRight)   ||
             this.isAABBOverlappingPoint(comparee, middleRight)||
             this.isAABBOverlappingPoint(comparee, center)||
             this.isAABBOverlappingPoint(comparee, bottomLeft) ||
             this.isAABBOverlappingPoint(comparee, bottomRight)
    },
    assert: function (value) {
      if (!value) {
        throw Error('utils.assert')
      }
    },
    assertKey: function (obj, key) {
      if (obj[key] === undefined) {
        throw Error(`utils.assertKey: key '${key}' not found`)
      }
    }
  }
})
