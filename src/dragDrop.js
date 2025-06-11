export function dragAndDrop() {
  const ships = document.querySelectorAll(".ship");
  const p1cells = Array.from(
    document.querySelectorAll(".cell[data-board='p1']")
  );
  const board = document.querySelector("#p1board");
  let currentShipsID = null;
  const lastActiveCell = [];

  ships.forEach((ship) => {
    ship.addEventListener("dragstart", (e) => {
      currentShipsID = e.target.id;
      console.log(e);
    });
  });

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
    let highlightedCells = [];

    if (highlightedCells !== lastActiveCell) {
      //if lastactivecell list is empty, make sure all cells get unhighlighted
      if (lastActiveCell != []) {
        for (let i = 0; i < lastActiveCell.length; i++) {
          lastActiveCell[i].classList.remove("dragenter");
        }
      }
      if (activeCell) {
        //generate all highlighted cells in x-direction
        let activeCellX = activeCell.dataset.x;
        let activeCellY = activeCell.dataset.y;
        for (let i = 0; i < shipLength; i++) {
          let coordX = Number(activeCellX) - i;
          let adjCell = document.querySelector(
            `div[data-x="${coordX}"][data-y="${activeCellY}"]`
          );
          if (adjCell) {
            highlightedCells.push(adjCell);
          }
        }
        for (let i = 0; i < highlightedCells.length; i++)
          highlightedCells[i].classList.add("dragenter");
      }
      //replaces lastactivecell with highlightedcells for when curor moves
      lastActiveCell.length = 0;
      lastActiveCell.push(...highlightedCells);
    }
  });

  //when leaving board container, remove highlight
  board.addEventListener("dragleave", (e) => {
    if (lastActiveCell != []) {
      for (let i = 0; i < lastActiveCell.length; i++) {
        lastActiveCell[i].classList.remove("dragenter");
      }
      lastActiveCell.length = 0;
    }
  });
}
