const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
import {puzzlesAndSolutions} from "../controllers/puzzle-strings";
let solver = new Solver();

suite('UnitTests', () => {
  
  test('valid puzzle string of 81 characters', (done) => {
    assert.equal(solver.validate("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."), true);
    done();
  });
  
  test('puzzle string with invalid characters', (done) => {
    assert.equal(solver.validate("..9..5.1.85x4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.n..6.."), false);
    done();
  });

  test('puzzle string that is not 81 characters in length', (done) => {
    assert.equal(solver.validate("..9..5.1.85.4..2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."), false)
    done();
  });

  test('valid row placement', (done) => {
    assert.equal(solver.checkRowPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", "A", "1", "7"), true);
    done();
  });

  test('invalid row placement', (done) => {
    assert.equal(solver.checkRowPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", "A", "1", "1"), false);
    done();
  });

  test('valid column placement', (done) => {
    assert.equal(solver.checkColPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", "A", "1", "7"), true);
    done();
  });

  test('invalid column placement', (done) => {
    assert.equal(solver.checkColPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", "A", "1", "8"), false);
    done();
  });

  test('valid region (3x3 grid) placement', (done) => {
    assert.equal(solver.checkRegionPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", "A", "1", "7"), true);
    done();
  });

  test('invalid region (3x3 grid) placement', (done) => {
    assert.equal(solver.checkRegionPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..", "A", "1", "3"), false);
    done();
  });

  test('Valid puzzle strings pass the solver', (done) => {
    for (let i=0; i<puzzlesAndSolutions.length;i++) {
      assert.equal(solver.solve(puzzlesAndSolutions[i][0]), puzzlesAndSolutions[i][1]);
    }
    done();
  });

  test('Invalid puzzle strings fail the solver', (done) => {
    assert.equal(solver.solve("..9..5.1.85.4.xc.2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."), "invalid puzzle");
    done();
  });

  test('Solver returns the expected solution for an incomplete puzzle', (done) => {
    for (let i=0; i<puzzlesAndSolutions.length;i++) {
      assert.equal(solver.solve(puzzlesAndSolutions[i][0]), puzzlesAndSolutions[i][1]);
    }
    done();
  });
  
});
