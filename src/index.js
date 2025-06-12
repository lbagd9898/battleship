require("./styles.css");
const Game = require("./game/game");
const { Gameboard } = require("./game/gameboard");
const Player = require("./game/player");
import { dragAndDrop } from "./dragDrop";

let humanBoard, compBoard, human, computer, game, takenSpaces;

// Moved everything before dragAndDrop into DOMContentLoaded

document.addEventListener("DOMContentLoaded", async () => {
  // Create human grid
  const p1board = document.querySelector("#p1board");
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.board = "p1";
      cell.dataset.x = j;
      cell.dataset.y = i;
      p1board.append(cell);
    }
  }

  // Create computer grid
  const p2board = document.querySelector("#p2board");
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell", "clickable");
      cell.dataset.board = "p2";
      cell.dataset.x = j;
      cell.dataset.y = i;
      p2board.append(cell);
    }
  }

  // Wait for drag-and-drop to finish before starting game
  try {
    const placedShips = await dragAndDrop();
    console.log(placedShips);
    startGame(placedShips);
  } catch {
    console.log("error during drag and drop", error);
  }
});

async function startGame(placedShips) {
  humanBoard = new Gameboard();
  compBoard = new Gameboard();
  human = new Player("human", humanBoard);
  computer = new Player("computer", compBoard);
  game = new Game(human, computer);
  takenSpaces = game.startGame(placedShips);

  //paints computerboard spaces purple to ensure accuracy
  let compSpaces = takenSpaces.computer;
  for (let i = 0; i < compSpaces.length; i++) {
    let [x, y] = compSpaces[i];
    let selector = `[data-board="p2"][data-x="${x}"][data-y="${y}"]`;
    let occupiedSpace = document.querySelector(selector);
    occupiedSpace.style.backgroundColor = "purple";
  }

  const button = document.querySelector("#start-over");
  button.addEventListener("click", resetGame);

  const clickableCells = document.querySelectorAll(".clickable");
  const h3 = document.querySelector("h3");
  const h2 = document.querySelector("#turn");

  clickableCells.forEach((cell) => {
    cell.addEventListener("click", async () => {
      clickableCells.forEach((c) => (c.style.pointerEvents = "none"));
      button.disabled = true;

      let x = Number(cell.dataset.x);
      let y = Number(cell.dataset.y);
      let coord = [x, y];
      let roundOutcome = game.playRound(coord);

      if (!roundOutcome) {
        console.log("error");
        return;
      }

      let result = roundOutcome.result;
      let message;
      let bgColor;

      if (result === true) {
        message = "You sunk a Ship!";
        bgColor = "red";
        let win = game.didTheyWin(compBoard);
        if (win) {
          alert("You won!");
          resetGame();
        }
      } else if (result === false) {
        message = "Hit!";
        bgColor = "red";
      } else if (result === null) {
        message = "Miss!";
        bgColor = "gray";
      }

      h3.classList.remove("color-change-animation");
      void h3.offsetWidth;
      h3.textContent = message;
      h3.classList.add("color-change-animation");
      cell.style.backgroundColor = bgColor;

      cell.classList.add("clicked");

      await delay(2000);

      h2.classList.remove("pop-in-animation");
      void h2.offsetWidth;
      h2.textContent = "Computer's turn!";
      h2.classList.add("pop-in-animation");

      await delay(2000);

      let compRound = game.playRound();
      let compResult = compRound.result;
      coord = compRound.coordinates;

      let [i, j] = coord;
      let selector = `[data-board="p1"][data-x="${i}"][data-y="${j}"]`;
      let cell2 = document.querySelector(selector);

      if (cell2) {
        if (compResult === true) {
          message = "Computer sunk a Ship!";
          bgColor = "red";
          let win = game.didTheyWin(humanBoard);
          if (win) {
            alert("Computer won!");
            resetGame();
          }
        } else if (compResult === false) {
          message = "Hit!";
          bgColor = "red";
        } else if (compResult === null) {
          message = "Miss!";
          bgColor = "gray";
        }
      }

      h3.classList.remove("color-change-animation");
      void h3.offsetWidth;
      h3.textContent = message;
      h3.classList.add("color-change-animation");
      cell2.style.backgroundColor = bgColor;

      await delay(2000);
      h2.classList.remove("pop-in-animation");
      void h2.offsetWidth;
      h2.textContent = "Your turn!";
      h2.classList.add("pop-in-animation");

      clickableCells.forEach((c) => {
        if (!c.classList.contains("clicked")) {
          c.style.pointerEvents = "auto";
          c.style.cursor = "pointer";
        }
      });
      button.disabled = false;
    });
  });

  function resetGame() {
    humanBoard = new Gameboard();
    compBoard = new Gameboard();
    human = new Player("human", humanBoard);
    computer = new Player("computer", compBoard);
    game = new Game(human, computer);
    takenSpaces = game.startGame();

    const clickableCells = document.querySelectorAll(".clickable");
    clickableCells.forEach((cell) => {
      cell.classList.remove("clicked");
      cell.style.pointerEvents = "auto";
      cell.style.cursor = "pointer";
    });

    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.style.backgroundColor = "";
    });

    const h2 = document.querySelector("#turn");
    const h3 = document.querySelector("h3");
    h2.textContent = "Your turn!";
    h3.textContent = "Click a cell to begin.";

    let humanSpaces = takenSpaces.human;
    for (let i = 0; i < humanSpaces.length; i++) {
      let [x, y] = humanSpaces[i];
      let selector = `[data-board="p1"][data-x="${x}"][data-y="${y}"]`;
      let occupiedSpace = document.querySelector(selector);
      occupiedSpace.style.backgroundColor = "purple";
    }

    let compSpaces = takenSpaces.computer;
    for (let i = 0; i < compSpaces.length; i++) {
      let [x, y] = compSpaces[i];
      let selector = `[data-board="p2"][data-x="${x}"][data-y="${y}"]`;
      let occupiedSpace = document.querySelector(selector);
      occupiedSpace.style.backgroundColor = "purple";
    }
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
