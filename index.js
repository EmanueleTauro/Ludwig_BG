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

//Create 2D array of collisions
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 32) {
  collisionsMap.push(collisions.slice(i, i + 32));
}

const interactionsMap = [];
for (let i = 0; i < interactions.length; i += 32) {
  interactionsMap.push(interactions.slice(i, i + 32));
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
          type: "Carattere",
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
          type: "Eventi",
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
console.log(interactibles);

// Define image object and assign source
const backgroundimage = new Image();
backgroundimage.src = "./assets/Village_200.png";

// Foreground image definition
const foregroundImage = new Image();
foregroundImage.src = "./assets/foregroundObjects.png";

// Player imageS definition
const playerDownImage = new Image();
playerDownImage.src = "./assets/playerDown_26.png";

const playerUpImage = new Image();
playerUpImage.src = "./assets/playerUp_26.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./assets/playerLeft_26.png";

const playerRightImage = new Image();
playerRightImage.src = "./assets/playerRight_26.png";

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

// Define keys for movement
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

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

  let moving = true;
  player.moving = false;

  // WHAT HAPPENS WHEN YOU PRESS KEYS

  // DOWN (S)
  if (keys.s.pressed && lastKey == "s") {
    player.moving = true;
    player.image = player.sprites.down;
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
        console.log("colliding");
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

    console.log(player.interactionAsset);

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
        console.log("colliding");
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

    interactionAsset = checkForInteractionCollision({
      interactibles,
      player,
      interactibleOffset: { x: player.speed, y: 0 },
    });

    console.log(interactionAsset);

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
        console.log("colliding");
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

    interactionAsset = checkForInteractionCollision({
      interactibles,
      player,
      interactibleOffset: { x: -player.speed, y: 0 },
    });

    console.log(interactionAsset);

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
        console.log("colliding");
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

// MOVEMENT CHARACTERISTICS
let lastKey = "";
// Key pressed
window.addEventListener("keydown", (e) => {
    // Interaction Switch-Case
    if (e.key === ' '){
        switch (player.interactionAsset){
            case "ID_Card":
                console.log('Interacting with ID_Card')
                break
            case "Storia":
                console.log('Interacting with Storia')
                break
        }
    }


    // Movement Switch-Case
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

// Key
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
