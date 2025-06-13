const { Ship, Gameboard, Space } = require("./gameboard");
const Player = require("./player");

class Game {
  constructor(human, computer) {
    this.human = human;
    this.computer = computer;
    this.humanBoard = this.human.gameboard;
    this.computerBoard = this.computer.gameboard;
    this.currentPlayer = this.human;
  }

  //randomly saves computer ship spaces and saves shipspaces from human's placed ships
  startGame(shipPlaces) {
    const shipLocations = {};
    const computerShipSpaces = this.computerBoard.randomlyPlaceShips();
    const computerShipCoords = Object.values(computerShipSpaces)
      .flat()
      .map((space) => space.coordinates);
    shipLocations.computer = computerShipCoords;
    for (const [shipID, coordinates] of Object.entries(shipPlaces)) {
      let shipLength = Number(shipID.slice(-1));
      console.log(shipLength);
      const ship = new Ship(shipLength);
      // console.log(ship);
      console.log(coordinates);
      let spaces = this.humanBoard.getSpacesFromCoordinates(coordinates);
      humanBoard.placeShip(ship, spaces);
      console.log(ship, spaces);
    }
    console.log(shipLocations);
    return shipLocations;
  }

  playTurn(coordinates = null) {
    let board;
    let space;
    if (this.currentPlayer === this.computer) {
      board = this.humanBoard;
      let row;
      let col;
      do {
        const computerSpaces = board.spaces;
        row = Math.floor(Math.random() * computerSpaces.length);
        col = Math.floor(Math.random() * computerSpaces[row].length);
        space = computerSpaces[row][col];
      } while (space.attacked === true);
      coordinates = space.coordinates;
    } else if (this.currentPlayer === this.human) {
      board = this.computerBoard;
      const [x, y] = coordinates;
      space = board.spaces[x][y];
      if (space.attacked === true) {
        return null;
      }
    }
    let result = board.receiveAttack(coordinates);
    return { result, coordinates };
  }

  playRound(coordinates = null) {
    let result;
    if (this.currentPlayer == this.human) {
      result = this.playTurn(coordinates);
    } else {
      result = this.playTurn();
    }
    this.changePlayer();
    return result;
  }

  didTheyWin(gameboard) {
    console.log("Checking win state:");
    for (let i = 0; i < gameboard.ships.length; i++) {
      const ship = gameboard.ships[i];
      console.log(`Ship ${i}:`, ship);

      if (!ship) {
        console.warn(`Skipping null or undefined ship at index ${i}`);
        continue; // prevents .isSunk() call on a null/undefined value
      }

      if (!ship.isSunk()) {
        return false;
      }
    }
    return true;
  }

  changePlayer() {
    this.currentPlayer =
      this.currentPlayer === this.human ? this.computer : this.human;
  }
}

let humanBoard, compBoard, human, computer, game;

const obj = {
  ship5: [
    [6, 3],
    [5, 3],
    [4, 3],
    [3, 3],
    [2, 3],
  ],
  ship4: [
    [7, 8],
    [6, 8],
    [5, 8],
    [4, 8],
  ],
  "ship1-3": [
    [7, 5],
    [6, 5],
    [5, 5],
  ],
  "ship2-3": [
    [7, 0],
    [6, 0],
    [5, 0],
  ],
  ship2: [
    [2, 5],
    [1, 5],
  ],
};
humanBoard = new Gameboard();
compBoard = new Gameboard();
human = new Player("human", humanBoard);
computer = new Player("computer", compBoard);
game = new Game(human, computer);
game.startGame(obj);

module.exports = Game;
