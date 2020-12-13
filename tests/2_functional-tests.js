const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite("Solve a Puzzle: POST request to /api/solve", () => {
    test("with valid puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isNotNull(res.body.solution);
          done();
        });
    });

    test("with missing puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test("with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: "..9..5.1.85.4x..n2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test("with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: "..9..5.1.85.4....2432..1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test("that cannot be solved", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: ".99..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });

  suite("Check a Puzzle: POST request to /api/check", () => {
    test("with all fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          value: "7",
          coordinate: "A1"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test("with single placement conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          value: "1",
          coordinate: "A2"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.valid, false);
          assert.lengthOf(res.body.conflict, 1);
          assert.include(res.body.conflict, "row");
          done();
        });
    });

    test("with multiple placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          value: "1",
          coordinate: "A1"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.valid, false);
          assert.lengthOf(res.body.conflict, 2);
          done();
        });
    });

    test("with all placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          value: "5",
          coordinate: "A1"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.valid, false);
          assert.lengthOf(res.body.conflict, 3);
          done();
        });
    });

    test("with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          value: "7"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test("with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: "..9..5.1.85.4.xx.2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          value: "7",
          coordinate: "A1"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test("with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: "..9..5.1.85.4....2432...1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          value: "7",
          coordinate: "A1"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test("with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          value: "7",
          coordinate: "X1"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test("with invalid placement value", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
          value: "10",
          coordinate: "a1"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
  });
});

