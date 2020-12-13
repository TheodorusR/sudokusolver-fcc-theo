class SudokuSolver {

  validate(puzzleString) {
    //returns boolean
    let splitString = puzzleString.split("");
    let puzzle = []
    for (let i=0; i<splitString.length; i+=9) {
      puzzle.push(splitString.slice(i, i+9));
    }
    
    let puzzleRegex = /[^\d\.]/;

    if (!puzzleString) {
      return false;
    } else if (puzzleRegex.test(puzzleString)) {
      return false;
    } else if (puzzleString.length != 81) {
      return false;
    }

    function findDuplicates (someArray) {
      let dupes = someArray.filter((item, index) => item=="." ? false : someArray.indexOf(item) != index);
      if (dupes.length == 0) {
        return false;
      } else {
        return true;
      }
    }
    
    let row = puzzle.length;
    let column = puzzle.length;
    //each row has unique value
    for (let i=0; i<row; i++) {
      if (findDuplicates(puzzle[i])) {
        return false;
      }
    }
    //each column has unique value
    for (let i=0; i<column; i++) {
      let arr = [];
      for (let j=0; j<row; j++) {
        arr.push(puzzle[j][i]);
      }
      if (findDuplicates(arr)) {
        return false;
      }
    }

    //each region has unique value
    let boxLength = 3;
    for (let i=0; i<row; i+=boxLength) {
      for (let j=0; j<column; j+=boxLength) {
        let arr = [];
        for (let k=i; k<i+boxLength; k++) {
          for (let l=j; l<j+boxLength; l++) {
            arr.push(puzzle[k][l]);
          }
        }
        if (findDuplicates(arr)) {
          return false;
        }
      }
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    //returns true if row is good, false otherwise
    let convertRow = {
      "A": 1,
      "B": 2,
      "C": 3,
      "D": 4,
      "E": 5,
      "F": 6,
      "G": 7,
      "H": 8,
      "I": 9
    }
    row = convertRow[row] - 1;
    column = Number(column) - 1;

    let splitString = puzzleString.split("");
    let puzzle = [];
    for (let i=0; i<splitString.length; i+=9) {
      puzzle.push(splitString.slice(i, i+9));
    }

    for (let i=0; i<puzzle.length; i++) {
      if(puzzle[row][i] == value) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    //returns true if column is good, false otherwise
    let convertRow = {
      "A": 1,
      "B": 2,
      "C": 3,
      "D": 4,
      "E": 5,
      "F": 6,
      "G": 7,
      "H": 8,
      "I": 9
    }
    row = convertRow[row] - 1;
    column = Number(column) - 1;
    let splitString = puzzleString.split("");
    let puzzle = [];
    for (let i=0; i<splitString.length; i+=9) {
      puzzle.push(splitString.slice(i, i+9));
    }

    for (let i=0; i<puzzle.length; i++) {
      if(puzzle[i][column] == value) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    //returns true if region is good, false otherwise
    let convertRow = {
      "A": 1,
      "B": 2,
      "C": 3,
      "D": 4,
      "E": 5,
      "F": 6,
      "G": 7,
      "H": 8,
      "I": 9
    }
    row = convertRow[row] - 1;
    column = Number(column) - 1;
    let splitString = puzzleString.split("");
    let puzzle = [];
    for (let i=0; i<splitString.length; i+=9) {
      puzzle.push(splitString.slice(i, i+9));
    }

    let boxLength = 3;
    let xRegion = 0;
    let yRegion = 0;
    while (xRegion + boxLength <= row) {
      xRegion += 3;
    }
    while (yRegion + boxLength <= column) {
      yRegion += 3;
    }

    for (let k=xRegion; k<xRegion+boxLength; k++) {
      for (let l=yRegion; l<yRegion+boxLength; l++) {
        if(puzzle[k][l] == value) {
          return false;
        }
      }
    }

    return true;
  }

  solve(puzzleString) {
    //returns solved puzzle as string
    if (!this.validate(puzzleString)) {
      return "invalid puzzle";
    }

    let splitString = puzzleString.split("");
    let puzzle = [];
    for (let i=0; i<splitString.length; i+=9) {
      puzzle.push(splitString.slice(i, i+9));
    }

    let row = puzzle.length;
    let column = puzzle.length;
    let solution = "";

    function findValue(xCoor, yCoor) {
      let fullSet = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      let possibleValues = [];

      //row
      for (let i=0; i<row; i++) {
        possibleValues.push(puzzle[i][yCoor]);
      }

      //column
      for (let i=0; i<column; i++) {
        possibleValues.push(puzzle[xCoor][i]);
      }

      //region

      let boxLength = 3;
      let xRegion = 0;
      let yRegion = 0;
      while (xRegion + boxLength <= xCoor) {
        xRegion += 3;
      }
      while (yRegion + boxLength <= yCoor) {
        yRegion += 3;
      }
      for (let k=xRegion; k<xRegion+boxLength; k++) {
        for (let l=yRegion; l<yRegion+boxLength; l++) {
          possibleValues.push(puzzle[k][l]);
        }
      }
      possibleValues = fullSet.filter((item) => !possibleValues.includes(item));
      if (possibleValues.length == 1) {
        return possibleValues[0];
      }

      return ".";
    }

    while(true) {
      let solved = true;
      for (let i=0; i<row; i++) {
        for (let j=0; j<column; j++) {
          if (puzzle[i][j] == ".") {
            puzzle[i][j] = findValue(i, j);
            solved = false;
          }
        }
      }
      if (solved) {
        for (let i=0; i<row; i++) {
          for (let j=0; j<column; j++) {
            solution += puzzle[i][j];
          }
        }
        break;
      }
    }
    return solution;
  }
}

module.exports = SudokuSolver;

