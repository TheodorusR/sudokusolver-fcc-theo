'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let value = req.body.value;
      let coordinate = req.body.coordinate;
      let puzzleRegex = /[^\d\.]/;
      let coordinateRegex = /^[A-I][1-9]$/i;
      let valueRegex = /^[1-9]$/;

      if (puzzleRegex.test(puzzle)) {
        res.json(
          { error: 'Invalid characters in puzzle' }
        );
        return;
      } else if (puzzle.length != 81) {
        res.json(
          { error: 'Expected puzzle to be 81 characters long' }
        );
        return;
      } else if (!puzzle || !value || !coordinate) {
        res.json(
          { error: 'Required field(s) missing' }
        );
        return;
      } else if (!coordinateRegex.test(coordinate)) {
        res.json(
          { error: 'Invalid coordinate'}
        );
        return;
      } else if (!valueRegex.test(value)) {
        res.json(
          { error: 'Invalid value' }
        );
        return;
      }

      //check placement
      let row = coordinate.split("")[0];
      let col = coordinate.split("")[1];
      let conflict = [];
      if (!solver.checkRowPlacement(puzzle, row.toUpperCase(), col, value)) {
        conflict.push("row");
      }
      if (!solver.checkColPlacement(puzzle, row.toUpperCase(), col, value)) {
        conflict.push("column");
      }
      if (!solver.checkRegionPlacement(puzzle, row.toUpperCase(), col, value)) {
        conflict.push("region");
      }

      //check valid
      let valid = true;
      if (conflict.length > 0) {
        valid = false;
      } 

      if (valid) {
        res.json({
          valid: valid
        })
      } else {
        res.json({
          valid: valid,
          conflict : conflict
        });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let puzzleRegex = /[^\d\.]/;

      if (!puzzle) {
        res.json(
          { error: 'Required field missing' }
        );
        return;
      } else if (puzzleRegex.test(puzzle)) {
        res.json(
          { error: 'Invalid characters in puzzle' }
        );
        return;
      } else if (puzzle.length != 81) {
        res.json(
          { error: 'Expected puzzle to be 81 characters long' }
        );
        return;
      } else if (!solver.validate(puzzle)) {
        res.json(
          { error: 'Puzzle cannot be solved' }
        );
        return;
      }

      res.json({
        solution: solver.solve(puzzle)
      });

    });
};
