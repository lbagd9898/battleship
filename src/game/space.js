//class for each space on a players gameboard
class Space {
  constructor(x, y) {
    this.coordinates = [x, y];
    this.ship = null;
    this.attacked = false;
  }
}

module.exports = Space;
