require("./styles.css");
const Game = require("./game/game");
const { Gameboard } = require("./game/gameboard");
const Player = require("./game/player");

let humanBoard, compBoard, human, computer, game, takenSpaces;

document.addEventListener("DOMContentLoaded", () => {
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

  console.log(humanSpaces);

  for (let i = 0; i < humanSpaces.length; i++) {
    let [x, y] = humanSpaces[i];
    let selector = `[data-board="p1"][data-x="${x}"][data-y="${y}"]`;
    let occupiedSpace = document.querySelector(selector);
    occupiedSpace.style.backgroundColor = "red";
  }
});
