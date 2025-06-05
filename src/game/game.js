const { Ship, Gameboard, Space } = require("./gameboard");
const Player = require("./player");

class Game {
  constructor(human, computer) {
    this.human = human;
    this.computer = computer;
    this.humanBoard = this.human.gameboard;
    this.computerBoard = this.computer.gameboard;
  }

  startGame() {
    const shipLocations = {};
    const humanShipSpaces = this.humanBoard.randomlyPlaceShips();
    const computerShipSpaces = this.computerBoard.randomlyPlaceShips();
    const humanShipCoords = Object.values(humanShipSpaces)
      .flat()
      .map((space) => space.coordinates);
    const computerShipCoords = Object.values(computerShipSpaces)
      .flat()
      .map((space) => space.coordinates);
    shipLocations.human = humanShipCoords;
    shipLocations.computer = computerShipCoords;
    console.log(shipLocations);
    return shipLocations;
  }
}

const humanBoard = new Gameboard();
const compBoard = new Gameboard();

const human = new Player("human", humanBoard);
const computer = new Player("computer", compBoard);

const game = new Game(human, computer);

game.startGame();
