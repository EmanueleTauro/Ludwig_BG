// Fetch canvas element
const canvas = document.querySelector("canvas");
// Gets the context (basically the 2d api to draw things)
const c = canvas.getContext("2d");

// Change canvas properties
canvas.width = 512;
canvas.height = 512;

// Create white background
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

/*To change map:
- Create a new tiled map
- Export the .PNG file for background image
- Export the .PNG file for foreground objects
- Export the JSON file and fetch collisions and interactions
- Adjust mapSizeindex to the value presented in the json.height and json.width */
const mapSizeindex = 44

//Create 2D array of collisions
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += mapSizeindex) {
  collisionsMap.push(collisions.slice(i, i + mapSizeindex));
}

const interactionsMap = [];
for (let i = 0; i < interactions.length; i += mapSizeindex) {
  interactionsMap.push(interactions.slice(i, i + mapSizeindex));
}

const offset = {
  x: -400,
  y: -400,
};

const boundaries = [];
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 856)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const interactibles = [];
interactionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 858) {
      interactibles.push(
        new Interaction({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          type: "ID_Card",
        })
      );
    } else if (symbol === 859) {
      interactibles.push(
        new Interaction({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          type: "Storia",
        })
      );
    } else if (symbol === 862) {
      interactibles.push(
        new Interaction({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          type: "Eventi",
        })
      );
    } else if (symbol === 863) {
      interactibles.push(
        new Interaction({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          type: "Pokemon",
        })
      );
    } else if (symbol === 867) {
      interactibles.push(
        new Interaction({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          type: "Carattere",
        })
      );
    } else if (symbol === 864) {
      interactibles.push(
        new Interaction({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          type: "OffZone",
        })
      );
    }
  });
});

// Define image object and assign source
const backgroundimage = new Image();
backgroundimage.src = "./assets/Village_bigger.png";

// Foreground image definition
const foregroundImage = new Image();
foregroundImage.src = "./assets/foregroundObjects_bigger.png";

// Player imageS definition
const playerDownImage = new Image();
playerDownImage.src = "./assets/playerDown_TENGEN.png";

const playerUpImage = new Image();
playerUpImage.src = "./assets/playerUp_TENGEN.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./assets/playerLeft_TENGEN.png";

const playerRightImage = new Image();
playerRightImage.src = "./assets/playerRight_TENGEN.png";

// Movement Image
const movementGuideImage = new Image();
movementGuideImage.src = "./assets/movementGuide.png"

// InteractionGuide Image
const interactionGuideImage = new Image();
interactionGuideImage.src = "./assets/interactionGuide.png"

// Create player object
const player = new Sprite({
  position: {
    x: canvas.width / 2 - 104 / 4 / 2, // X spawn
    y: canvas.height / 2 - 32 / 2, // Y spawn
  },
  image: playerDownImage,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
  speed: 2,
});

// Create background object
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: backgroundimage,
});

// Create foreground object
const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

// Create movementGuide object
const movementGuide = new Sprite({
  position: {
    x: 410,
    y: 10
  },
  image: movementGuideImage,
})

// Create interactionGuide object
const interactionGuide = new Sprite({
  position: {
    x: 410,
    y: 36
  },
  image: interactionGuideImage,
})


const movables = [background, foreground, ...boundaries, ...interactibles];

// Basically the main function
function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  interactibles.forEach((interactible) => {
    interactible.draw();
  });
  player.draw();
  foreground.draw();
  movementGuide.draw();
  interactionGuide.draw();

  let moving = true;
  player.moving = false;

  // WHAT HAPPENS WHEN YOU PRESS KEYS

  // DOWN (S)
  if (keys.s.pressed && lastKey == "s") {
    player.moving = true;
    player.image = player.sprites.down;

    checkForInteractionCollision({
      interactibles,
      player,
      interactibleOffset: { x: 0, y: -player.speed },
    });

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              //creates a clone without overriding the original one
              x: boundary.position.x,
              y: boundary.position.y - player.speed,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= player.speed;
      });
  }
  // UP (W)
  else if (keys.w.pressed && lastKey == "w") {
    player.moving = true;
    player.image = player.sprites.up;

    checkForInteractionCollision({
      interactibles,
      player,
      interactibleOffset: { x: 0, y: player.speed },
    });

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              //creates a clone without overriding the original one
              x: boundary.position.x,
              y: boundary.position.y + player.speed,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y += player.speed;
      });
  }
  // LEFT (A)
  else if (keys.a.pressed && lastKey == "a") {
    player.moving = true;
    player.image = player.sprites.left;

    checkForInteractionCollision({
      interactibles,
      player,
      interactibleOffset: { x: player.speed, y: 0 },
    });

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              //creates a clone without overriding the original one
              x: boundary.position.x + player.speed,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += player.speed;
      });
  }
  // RIGHT (D)
  else if (keys.d.pressed && lastKey == "d") {
    player.moving = true;
    player.image = player.sprites.right;

    checkForInteractionCollision({
      interactibles,
      player,
      interactibleOffset: { x: -player.speed, y: 0 },
    });

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              //creates a clone without overriding the original one
              x: boundary.position.x - player.speed,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= player.speed;
      });
  }
}

animate();
