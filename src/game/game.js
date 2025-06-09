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

  //randomly places ships for both boards and returns coordinates to implement in UI
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
      space = this.humanBoard.spaces[x][y];
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
    for (let i = 0; i < gameboard.ships.length; i++) {
      console.log(gameboard.ships[i]);
      if (gameboard.ships[i].isSunk() === false) return false;
    }
    return true;
  }

  changePlayer() {
    this.currentPlayer =
      this.currentPlayer === this.human ? this.computer : this.human;
  }
}

module.exports = Game;
