
class Game {
  constructor () {
    const canvas = document.getElementById('canvas')
    const screen = canvas.getContext('2d')
    const gameSize = { x: canvas.width, y: canvas.height }

    this.bodies = []
    // CONCAT PLAYER TO BODIES
    this.bodies = this.bodies.concat(new Player(this, gameSize))
    // CONCAT INVADERS TO BODIES
    this.bodies = this.bodies.concat(createInvaders(this))

    const tick = () => {
      this.update()
      this.draw(screen, gameSize)
      requestAnimationFrame(tick)
    }
    tick()
  }

  // TELL EVERY BODY IN THE GAME TO UPDATE:
  update () {
    for (let i = 0; i < this.bodies.length; i++) {
      this.bodies[i].update()
    }
  }

  // CYCLE THROUGH BODIES ARRAY AND DRAW EACH MEMBER
  draw (screen, gameSize) {
    screen.clearRect(0, 0, gameSize.x, gameSize.y)

    for (let i = 0; i < this.bodies.length; i++) {
      drawRect(screen, this.bodies[i])
    }
  }

  invadersBelow (invader) {
    return this.bodies.filter(function (bodyTest) {
      return bodyTest instanceof Invader && Math.abs(invader.center.x - bodyTest.center.x) < bodyTest.size.x && bodyTest.center.y > invader.center.y
    }).length > 0
  } // filters the bodies array into an array of bodies in the way. If the length is greater than zero, there are invaders in the way. It will return True or False.

  addBody (body) {
    this.bodies.push(body)
  }
}

class Player {
  constructor (game, gameSize) {
    this.game = game
    this.size = { x: 15, y: 15 }
    this.center = { x: (gameSize.x / 2), y: (gameSize.y - this.size.y * 2) }
    this.keyboarder = new Keyboarder()
  }

  update () {
    if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
      this.center.x -= 2
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
      this.center.x += 2
    }

    if (this.keyboarder.isDown(this.keyboarder.KEYS.S)) {
      const bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.y - 10 }, { x: 0, y: -7 })

      this.game.addBody(bullet)
    }
  }
}

class Bullet {
  constructor (center, velocity) {
    this.center = center
    this.size = { x: 3, y: 3 }
    this.velocity = velocity
  }

  update () {
    this.center.x += this.velocity.x
    this.center.y += this.velocity.y
  }
}

class Invader {
  constructor (game, center) {
    this.game = game
    this.center = center
    this.size = { x: 15, y: 15 }
    this.patrolX = 0
    this.speedX = 0.3
  }

  update () {
    if (this.patrolX < 0 || this.patrolX > 30) {
      this.speedX = -this.speedX
    }
    if (Math.random() > 0.995 && !this.game.invadersBelow(this)) {
      const bullet = new Bullet({ x: this.center.x, y: this.center.y + this.size.y / 2 }, { x: Math.random() - 0.5, y: 2 })

      this.game.addBody(bullet)
    }
    this.center.x += this.speedX
    this.patrolX += this.speedX
  }
}

function createInvaders (game) {
  // SETS HOW MANY TO RENDER AND IN WHAT ROWS. GET'S CALLED IN THE GAME OBJECT
  const invaders = []
  for (let i = 0; i < 24; i++) {
    const x = 30 + (i % 8) * 30
    const y = 30 + (i % 3) * 30
    invaders.push(new Invader(game, { x: x, y: y }))
  }
  return invaders
}

// HELPER FUNCTIONS:

function drawRect (screen, body) {
  screen.fillRect(
    body.center.x - body.size.x / 2,
    body.center.y - body.size.y / 2,
    body.size.x, body.size.y)
}

// function colliding (body1, body2) {
//   // LOGICAL TEST TO SEE IF ANY OF THE OBJECTS IN THE CURRENT TICK UPDATE ARE COLLIDING
// }

class Keyboarder {
  constructor () {
    const keyState = {}
    window.addEventListener('keydown', function (e) {
      keyState[e.keyCode] = true
    })

    window.addEventListener('keyup', function (e) {
      keyState[e.keyCode] = false
    })
    this.isDown = function (keyCode) {
      return keyState[keyCode] === true
    }
    this.KEYS = { LEFT: 37, RIGHT: 39, S: 83 }
  }
}

new Game()
