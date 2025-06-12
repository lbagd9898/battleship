export function dragAndDrop() {
  return new Promise((resolve) => {
    //keeps track of ships and their places when placed
    const placedShips = {};

    function checkifAllShipsArePlaced() {
      if (Object.keys(placedShips) === 5) {
        resolve(placedShips);
      }
    }

    function dragAndDropCleanUp() {}

    function arraysEqual(a, b) {
      if (a.length !== b.length) return false;
      return a.every((el, i) => el === b[i]);
    }

    //DOM elements
    const ships = document.querySelectorAll(".ship");
    const p1cells = Array.from(
      document.querySelectorAll(".cell[data-board='p1']")
    );
    const board = document.querySelector("#p1board");
    const rotate = document.querySelector("#rotate");
    const shipyard = document.querySelector("#shipyard");

    //global variable for rotate button
    let horizontal = true;
    let currentShipsID = null;
    const lastActiveCell = [];

    //rotate button functionality
    rotate.addEventListener("click", () => {
      horizontal = !horizontal;
      console.log(horizontal);
      ships.forEach((ship) => {
        ship.classList.toggle("vertical", !horizontal);
      });
    });

    //eventlistener for dragability of each ship
    ships.forEach((ship) => {
      ship.addEventListener("dragstart", (e) => {
        //sets current ship's id so we know how long it is
        currentShipsID = e.target.id;
        console.log(e);

        //makes drag ghose invisible
        const img = new Image();
        img.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

        e.dataTransfer.setDragImage(img, 0, 0);
      });
    });

    let highlightedCells = [];

    //board listens for when ship is dragged over it
    board.addEventListener("dragover", (e) => {
      e.preventDefault();

      //Variable stores length of ship / how many spaces to higlight
      let shipLength = Number(currentShipsID.slice(-1));
      console.log(shipLength);

      //gets current coordinates of the mouse
      const x = e.clientX;
      const y = e.clientY;

      //figurees out which cell the mouse is currently over
      const activeCell = p1cells.find((cell) => {
        const rect = cell.getBoundingClientRect();
        return (
          x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
        );
      });

      //list that will contain cell nodes we need to highlight
      highlightedCells = [];

      if (!arraysEqual(highlightedCells, lastActiveCell)) {
        //if lastactivecell list is empty, make sure all cells get unhighlighted
        if (lastActiveCell.length != 0) {
          for (let i = 0; i < lastActiveCell.length; i++) {
            lastActiveCell[i].classList.remove("dragenter");
          }
        }
        if (activeCell) {
          //generate all highlighted cells in x-direction
          let activeCellX = activeCell.dataset.x;
          let activeCellY = activeCell.dataset.y;
          let adjCell;
          for (let i = 0; i < shipLength; i++) {
            if (horizontal) {
              let coordX = Number(activeCellX) - i;
              adjCell = document.querySelector(
                `div[data-x="${coordX}"][data-y="${activeCellY}"]`
              );
            } else {
              let coordY = Number(activeCellY) + i;
              adjCell = document.querySelector(
                `div[data-x="${activeCellX}"][data-y="${coordY}"]`
              );
            }
            if (adjCell) {
              highlightedCells.push(adjCell);
            }
          }
          for (let i = 0; i < highlightedCells.length; i++)
            highlightedCells[i].classList.add("dragenter");
        }
        //replaces lastactivecell with highlightedcells for when cursor moves
        lastActiveCell.length = 0;
        lastActiveCell.push(...highlightedCells);
      }
    });

    //when leaving board container, remove highlight
    board.addEventListener("dragleave", (e) => {
      if (lastActiveCell.length != 0) {
        for (let i = 0; i < lastActiveCell.length; i++) {
          lastActiveCell[i].classList.remove("dragenter");
        }
        lastActiveCell.length = 0;
      }
    });

    board.addEventListener("drop", (e) => {
      e.preventDefault();
      let shipLength = Number(currentShipsID.slice(-1));
      let takenSpaces = Object.values(placedShips).flat();
      let i = 0;
      let overLap = false;
      let coordinates = highlightedCells.map((cell) => [
        Number(cell.dataset.x),
        Number(cell.dataset.y),
      ]);
      //iterate through coordinates of highlighted cells to make sure the space isn't already taken
      while (overLap === false && i < coordinates.length) {
        let coordinate = coordinates[i];
        overLap = takenSpaces.some(
          (coord) => coord[0] === coordinate[0] && coord[1] === coordinate[1]
        );
        console.log(overLap);
        i++;
      }
      //if ship is placed off the board or if it's placed over a taken space
      if (shipLength != highlightedCells.length || overLap) {
        for (let i = 0; i < highlightedCells.length; i++) {
          console.log(highlightedCells[i]);
          highlightedCells[i].classList.remove("dragenter");
        }
        highlightedCells.length = 0;
      } else {
        //save ship to ship object with it's respective spaces
        for (let i = 0; i < highlightedCells.length; i++) {
          highlightedCells[i].style.backgroundColor = "purple";
        }
        placedShips[currentShipsID] = coordinates;
        let ship = document.getElementById(currentShipsID);
        shipyard.removeChild(ship);
        checkifAllShipsArePlaced();
      }
    });
  });
}
