export function dragAndDrop() {
  return new Promise((resolve) => {
    //keeps track of ships and their places when placed
    const placedShips = {};

    function checkifAllShipsArePlaced() {
      if (Object.keys(placedShips).length === 5) {
        shipyard.removeChild(rotate);
        let message = document.createElement("p");
        message.textContent = "Ready for Battle";
        message.style.fontSize = "2.5rem";
        message.style.color = "#a9ba9d";
        shipyard.appendChild(message);
        dragAndDropCleanup();
        resolve(placedShips);
      }
    }

    //DOM elements
    const ships = document.querySelectorAll(".ship");
    const p1cells = Array.from(
      document.querySelectorAll(".cell[data-board='p1']")
    );
    const board = document.querySelector("#p1board");
    const rotate = document.querySelector("#rotate");
    const shipyard = document.querySelector("#shipyard");

    function dragAndDropCleanup() {
      rotate.removeEventListener("click", rotateShips);
      //each ship listens for dragstart
      ships.forEach((ship) => {
        ship.removeEventListener("dragstart", dragStart);
      });
      board.removeEventListener("dragover", dragOver);
      board.removeEventListener("dragleave", dragLeave);
      board.removeEventListener("drop", handleDrop);
    }

    //global variable for rotate button
    let horizontal = true;
    let currentShipsID = null;
    const lastActiveCell = [];

    //rotate button functionality
    function rotateShips() {
      horizontal = !horizontal;
      console.log(horizontal);
      ships.forEach((ship) => {
        ship.classList.toggle("vertical", !horizontal);
      });
    }

    //function called on ship to be able to drag it to board
    function dragStart(e) {
      // Sets current ship's ID so we know how long it is
      currentShipsID = e.target.id;
      console.log(e);

      // Makes drag ghost invisible
      const img = new Image();
      img.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      e.dataTransfer.setDragImage(img, 0, 0);
    }

    //global variable for dragOver function
    let highlightedCells = [];

    //drag over function to highlight board cells when ship is dragged over it
    function dragOver(e) {
      e.preventDefault();

      // Variable stores length of ship / how many spaces to highlight
      let shipLength = Number(currentShipsID.slice(-1));
      console.log(shipLength);

      // Gets current coordinates of the mouse
      const x = e.clientX;
      const y = e.clientY;

      // Figures out which cell the mouse is currently over
      const activeCell = p1cells.find((cell) => {
        const rect = cell.getBoundingClientRect();
        return (
          x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
        );
      });

      // List that will contain cell nodes we need to highlight
      highlightedCells = [];

      // If lastActiveCell list is not empty, remove highlight from previous cells
      if (lastActiveCell.length !== 0) {
        for (let i = 0; i < lastActiveCell.length; i++) {
          lastActiveCell[i].classList.remove("dragenter");
        }
      }

      if (activeCell) {
        // Generate all highlighted cells in x- or y-direction
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

        for (let i = 0; i < highlightedCells.length; i++) {
          highlightedCells[i].classList.add("dragenter");
        }
      }

      // Replace lastActiveCell with highlightedCells for the next dragover
      lastActiveCell.length = 0;
      lastActiveCell.push(...highlightedCells);
    }

    //un-highlights grid cells when cursor leaves them in dragOver
    function dragLeave(e) {
      if (lastActiveCell.length !== 0) {
        for (let i = 0; i < lastActiveCell.length; i++) {
          lastActiveCell[i].classList.remove("dragenter");
        }
        lastActiveCell.length = 0;
      }
    }

    //determines whether ship can be dropped on hovered board spaces.
    //if not, ship returns and highlighted cells are unhighlighted
    //if yes, ship is dropped and cell coordinate information is saved in placedShips
    function handleDrop(e) {
      e.preventDefault();

      let shipLength = Number(currentShipsID.slice(-1));
      let takenSpaces = Object.values(placedShips).flat();
      let i = 0;
      let overLap = false;

      let coordinates = highlightedCells.map((cell) => [
        Number(cell.dataset.x),
        Number(cell.dataset.y),
      ]);

      // Iterate through coordinates of highlighted cells to check for overlap
      while (!overLap && i < coordinates.length) {
        let coordinate = coordinates[i];
        overLap = takenSpaces.some(
          (coord) => coord[0] === coordinate[0] && coord[1] === coordinate[1]
        );
        console.log(overLap);
        i++;
      }

      // If ship is placed off the board or overlaps an existing ship
      if (shipLength !== highlightedCells.length || overLap) {
        for (let i = 0; i < highlightedCells.length; i++) {
          console.log(highlightedCells[i]);
          highlightedCells[i].classList.remove("dragenter");
        }
        highlightedCells.length = 0;
      } else {
        // Save ship placement
        for (let i = 0; i < highlightedCells.length; i++) {
          highlightedCells[i].style.backgroundColor = "purple";
        }
        placedShips[currentShipsID] = coordinates;

        console.log(placedShips);

        let ship = document.getElementById(currentShipsID);
        shipyard.removeChild(ship);

        checkifAllShipsArePlaced();
      }
    }

    //Eventlisteners for rotate and drag and drop functions
    rotate.addEventListener("click", rotateShips);
    //each ship listens for dragstart
    ships.forEach((ship) => {
      ship.addEventListener("dragstart", dragStart);
    });
    board.addEventListener("dragover", dragOver);
    board.addEventListener("dragleave", dragLeave);
    board.addEventListener("drop", handleDrop);
  });
}
