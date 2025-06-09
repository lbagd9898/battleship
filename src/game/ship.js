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
    this.isSunk();
    return this.hits;
  }

  //once ship is hit the same number of times as length, it is sunk
  isSunk() {
    this.sunk = this.hits >= this.length;
    return this.sunk;
  }
}

module.exports = Ship;
