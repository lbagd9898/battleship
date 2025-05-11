const { Ship, Gameboard, Space } = require("./battleship");

describe.skip("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(2);
  });

  test("is sunk before sunk", () => {
    expect(ship.isSunk()).toBe(false);
  });

  test("is sunk should be false after 1 hit", () => {
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test("is sunk should be true after 2 hits", () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});

describe("Gameboard", () => {
  test("placeship assigns ship to a space", () => {
    let ship = new Ship(3);
    let gameboard = new Gameboard();

    const spaces = [
      gameboard.spaces[0][0],
      gameboard.spaces[1][0],
      gameboard.spaces[2][0],
    ];

    const result = gameboard.placeShip(ship, spaces);

    result.forEach((space) => {
      expect(space.ship).toBe(ship);
    });
  });
});
