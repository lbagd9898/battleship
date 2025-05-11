class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits += 1;
    return this.hits;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}

class Gameboard {
  constructor() {
    this.spaces = [];
    for (let i = 0; i < 10; i++) {
      this.spaces[i] = [];
      for (let j = 0; j < 10; j++) {
        this.spaces[i][j] = new Space(i, j);
      }
    }
  }

  placeShip(ship, spaces) {
    for (let i = 0; i < spaces.length; i++) {
      spaces[i].ship = ship;
    }
    return spaces;
  }
}

class Space {
  constructor(x, y) {
    this.coordinates = [x, y];
    this.ship = null;
    this.attacked = false;
  }
}

module.exports = { Ship, Gameboard, Space };
