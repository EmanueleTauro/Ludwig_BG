function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function checkForInteractionCollision({
  interactibles,
  player,
  interactibleOffset = { x: 0, y: 0 },
}) {
  player.interactionAsset = null;
  // monitor for character collision
  for (let i = 0; i < interactibles.length; i++) {
    const interactible = interactibles[i];

    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...interactible,
          position: {
            x: interactible.position.x + interactibleOffset.x +1 ,
            y: interactible.position.y + interactibleOffset.y +1,
          },
        },
      })
    ) {
      player.interactionAsset = interactions_dictionary[interactible.type];
      console.log(player.interactionAsset)
      break;
    }
  }
}

function performInteraction({ player }) {
  // Checks if the player is in the position for interacting and evokes the corresponding BG part.
  // If BG is hidden, it is shown. If it is already shown, it gets hidden.
  if (
    document.querySelector("#interactionDialogueBox").style.visibility ===
    "hidden"
  ) {
    document.querySelector("iframe").src = `./bg/${player.interactionAsset}.html`;
    document.querySelector("#interactionDialogueBox").style.visibility =
      "visible";
  } else {
    document.querySelector("#interactionDialogueBox").style.visibility =
      "hidden";
  }
}
