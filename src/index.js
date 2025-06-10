require("./styles.css");
const Game = require("./game/game");
const { Gameboard } = require("./game/gameboard");
const Player = require("./game/player");
import { dragAndDrop } from "./dragDrop";

let humanBoard, compBoard, human, computer, game, takenSpaces;

document.addEventListener("DOMContentLoaded", () => {
  //dragability implementation
  const ship5 = document.querySelector("#ship5");
  ship5.addEventListener("dragstart", dragAndDrop(event));

  //create grid to represent humans's board
  const p1board = document.querySelector("#p1board");
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.board = "p1";
      cell.dataset.x = j;
      cell.dataset.y = i;
      cell.textContent = `${j}, ${i}`;
      p1board.append(cell);
    }
  }
  //create grid to represent computers's board
  const p2board = document.querySelector("#p2board");
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add("clickable");
      cell.dataset.board = "p2";
      cell.dataset.x = j;
      cell.dataset.y = i;
      cell.textContent = `${j}, ${i}`;
      p2board.append(cell);
    }
  }

  //game logic pieces instantiated
  humanBoard = new Gameboard();
  compBoard = new Gameboard();

  human = new Player("human", humanBoard);
  computer = new Player("computer", compBoard);

  game = new Game(human, computer);

  takenSpaces = game.startGame();

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

  //functionality for reset button
  const button = document.querySelector("button");
  button.addEventListener("click", resetGame);

  const clickableCells = document.querySelectorAll(".clickable");
  const h3 = document.querySelector("h3");
  const h2 = document.querySelector("#turn");

  // triggers human turn, and then computer's turn when a computer board cell is clicked
  clickableCells.forEach((cell) => {
    cell.addEventListener("click", async () => {
      //disables clickability of cells while function runs
      clickableCells.forEach((c) => (c.style.pointerEvents = "none"));

      button.disabled = true;
      //extracts coordinate data form clicked celll
      let x = Number(cell.dataset.x);
      let y = Number(cell.dataset.y);
      let coord = [x, y];
      //updates UI on outcome's of human's turn. Animation of h3 text included.
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

      //disable clicked cell's clicking forever
      cell.classList.add("clicked");

      //delay before computer's turn, gives tells user it's computers turn with animation
      await delay(2000);

      h2.classList.remove("pop-in-animation");
      void h2.offsetWidth;
      h2.textContent = "Computer's turn!";
      h2.classList.add("pop-in-animation");

      await delay(2000);

      //triggers game logic for computer's turn (randomly selected coordinate)
      let compRound = game.playRound();
      let compResult = compRound.result;
      coord = compRound.coordinates;

      let [i, j] = coord;
      let selector = `[data-board="p1"][data-x="${i}"][data-y="${j}"]`;
      let cell2 = document.querySelector(selector);

      //updates UI on the outcome of computer's turn
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

      //resets UI for human's turn again
      await delay(2000);
      h2.classList.remove("pop-in-animation");
      void h2.offsetWidth;
      h2.textContent = "Your turn!";
      h2.classList.add("pop-in-animation");

      //re enables clickability of cells (aside from cell already clicked by human)
      clickableCells.forEach((c) => {
        if (!c.classList.contains("clicked")) {
          c.style.pointerEvents = "auto";
          c.style.cursor = "pointer";
        }
      });
      button.disabled = false;
    });
  });

  //resets game if button is clicked or if someone wins
  function resetGame() {
    //game logic pieces instantiated
    humanBoard = new Gameboard();
    compBoard = new Gameboard();

    human = new Player("human", humanBoard);
    computer = new Player("computer", compBoard);

    game = new Game(human, computer);

    takenSpaces = game.startGame();

    let humanSpaces = takenSpaces.human;

    //all grid cells reset to white color and text content updated
    clickableCells.forEach((cell) => {
      cell.classList.remove("clicked");
      cell.style.pointerEvents = "auto";
      cell.style.cursor = "pointer";
    });

    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      cell.style.backgroundColor = "";
    });

    h2.textContent = "Your turn!";
    h3.textContent = "Click a cell to begin.";

    //regenerate ship spaces and place them on the board
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
});
