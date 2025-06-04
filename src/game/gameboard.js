const Ship = require("./ship.js");
const Player = require("./player.js");
const Space = require("./space.js");

//class of each player's gameboard. each gameboard is 10x10
class Gameboard {
  constructor() {
    //keeps track of all spaces on board
    this.spaces = [];
    //keeps track of all unoccupied spaces that have been hit
    this.missedAttacks = [];
    //keeps track of all placed ships
    this.ships = [];
    //makes all spaces on board and adds to this.spaces
    for (let i = 0; i < 10; i++) {
      this.spaces[i] = [];
      for (let j = 0; j < 10; j++) {
        this.spaces[i][j] = new Space(i, j);
      }
    }
  }

  //Assigns ship to provided array of space instances, adds ship to this.ships
  placeShip(ship, spaces) {
    for (let i = 0; i < spaces.length; i++) {
      if (spaces[i].ship != null) {
        throw new Error("space taken");
      }
    }
    for (let i = 0; i < spaces.length; i++) {
      spaces[i].ship = ship;
    }
    this.ships.push(ship);
    return spaces;
  }
  //randomly places ships on board for computer player
  randomlyPlaceShips() {}

  receiveAttack(coordinates) {
    let [x, y] = coordinates;
    let space = this.spaces[x][y];
    space.attacked = true;
    if (space.ship != null) {
      return space.ship;
    } else {
      this.missedAttacks.push(space);
      return null;
    }
  }
}

module.exports = { Ship, Gameboard, Space };
