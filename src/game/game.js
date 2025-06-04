const { Ship, Gameboard, Space } = require("../src/game/gameboard");
const Player = require("../src/game/player");

class Game {
  constructor(human, computer) {
    this.human = human;
    this.computer = computer;
    this.humanBoard = this.human.gameboard;
    this.computerBoard = this.computer.gameboard;
  }
}
