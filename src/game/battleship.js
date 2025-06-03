//Represents a ship placed on battleship board
class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  //Increments when ship is hit
  hit() {
    this.hits += 1;
    return this.hits;
  }

  //once ship is hit the same number of times as length, it is sunk
  isSunk() {
    return this.hits >= this.length;
  }
}

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
      spaces[i].ship = ship;
    }
    this.ships.push(ship);
    return spaces;
  }

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

//class for each player. player's have a name and a gameboard
class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
  }
}

//class for each space on a players gameboard
class Space {
  constructor(x, y) {
    this.coordinates = [x, y];
    this.ship = null;
    this.attacked = false;
  }
}

module.exports = { Ship, Gameboard, Space };
