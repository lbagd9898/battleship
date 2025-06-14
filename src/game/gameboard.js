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
        this.spaces[i][j] = new Space(j, i);
      }
    }
  }

  printBoard() {
    for (let y = 0; y < 10; y++) {
      let rowStr = "";
      for (let x = 0; x < 10; x++) {
        const space = this.spaces[y][x];
        if (space.attacked) {
          if (space.ship) {
            rowStr += "X "; // hit ship
          } else {
            rowStr += "O "; // missed attack
          }
        } else {
          if (space.ship) {
            rowStr += "S "; // ship not attacked
          } else {
            rowStr += ". "; // empty space
          }
        }
      }
      console.log(rowStr);
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
  randomlyPlaceShips() {
    const ships = [
      new Ship(5),
      new Ship(4),
      new Ship(3),
      new Ship(3),
      new Ship(2),
    ];
    let shipPlaces = new Object();
    for (let j = 0; j < ships.length; ) {
      try {
        //random boolean selected to determine if ship is horizontal or vertical
        let isVertical = Math.random() < 0.5;
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        let coordinates = [];
        let deltaX = 0;
        let deltaY = 0;
        if (isVertical) {
          deltaY = y < 5 ? 1 : -1;
        } else {
          deltaX = x < 5 ? 1 : -1;
        }
        for (let i = 0; i < ships[j].length; i++) {
          coordinates.push([x + i * deltaX, y + i * deltaY]);
        }
        let selectedSpaces = this.getSpacesFromCoordinates(coordinates);
        let newSpaces = this.placeShip(ships[j], selectedSpaces);
        shipPlaces[j] = newSpaces;
        this.ships.push(ships[j]);
        j++;
      } catch (error) {
        console.log(error.message, j);
      }
    }
    return shipPlaces;
  }

  getSpacesFromCoordinates(coordinates) {
    return coordinates.map(([x, y]) => this.spaces[y][x]);
  }

  receiveAttack(coordinates) {
    let [x, y] = coordinates;
    let space = this.spaces[y][x];
    space.attacked = true;
    if (space.ship != null) {
      let ship = space.ship;
      ship.hits += 1;
      return ship.isSunk();
    } else {
      this.missedAttacks.push(space);
      return null;
    }
  }
}

const board = new Gameboard();
board.printBoard();
let test = board.getSpacesFromCoordinates([[2, 3]]);
console.log(test);

module.exports = { Ship, Gameboard, Space };
