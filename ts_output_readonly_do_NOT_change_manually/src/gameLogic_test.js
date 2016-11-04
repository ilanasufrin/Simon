// describe("In TicTacToe", function() {
//   let OK = true;
//   let ILLEGAL = false;
//   let X_TURN = 0;
//   let O_TURN = 1;
//   let NO_ONE_TURN = -1;
//   let NO_ONE_WINS: number[] = null;
//   let X_WIN_SCORES = [1, 0];
//   let O_WIN_SCORES = [0, 1];
//   let TIE_SCORES = [0, 0];
//   function expectStateTransition(
//         isOk: boolean, stateTransition: IStateTransition) {
//     if (isOk) {
//       gameLogic.checkMoveOk(stateTransition);
//     } else {
//       // We expect an exception to be thrown :)
//       let didThrowException = false;
//       try {
//         gameLogic.checkMoveOk(stateTransition);
//       } catch (e) {
//         didThrowException = true;
//       }
//       if (!didThrowException) {
//         throw new Error("We expect an illegal move, but checkMoveOk didn't throw any exception!")
//       }
//     }
//   }
//   function expectMove(
//       isOk: boolean,
//       turnIndexBeforeMove: number,
//       boardBeforeMove: Board,
//       row: number,
//       col: number,
//       boardAfterMove: Board,
//       turnIndexAfterMove: number,
//       endMatchScores: number[]): void {
//     let stateTransition: IStateTransition = {
//       turnIndexBeforeMove: turnIndexBeforeMove,
//       stateBeforeMove: boardBeforeMove ? {board: boardBeforeMove, delta: null} : null,
//       move: {
//         turnIndexAfterMove: turnIndexAfterMove,
//         endMatchScores: endMatchScores,
//         stateAfterMove: {board: boardAfterMove, delta: {row: row, col: col}}
//       },
//       numberOfPlayers: null
//     };
//     expectStateTransition(isOk, stateTransition);
//   }
//   it("Initial move", function() {
//     expectStateTransition(OK, {
//       turnIndexBeforeMove: X_TURN,
//       stateBeforeMove: null,
//       move: {
//         turnIndexAfterMove: X_TURN,
//         endMatchScores: NO_ONE_WINS,
//         stateAfterMove: {board:
//           [['', '', ''],
//           ['', '', ''],
//           ['', '', '']], delta: null}
//       },
//       numberOfPlayers: null
//     });
//   });
//   it("Initial move setting turn to O player is illegal", function() {
//     expectStateTransition(ILLEGAL, {
//       turnIndexBeforeMove: X_TURN,
//       stateBeforeMove: null,
//       move: {
//         turnIndexAfterMove: O_TURN,
//         endMatchScores: NO_ONE_WINS,
//         stateAfterMove: {board:
//           [['', '', ''],
//           ['', '', ''],
//           ['', '', '']], delta: null}
//       },
//       numberOfPlayers: null
//     });
//   });
//   it("placing X in 0x0 from initial state is legal", function() {
//     expectMove(OK, X_TURN, null, 0, 0,
//       [['X', '', ''],
//        ['', '', ''],
//        ['', '', '']], O_TURN, NO_ONE_WINS);
//   });
//   it("placing X in 0x0 from initial state but setting the turn to yourself is illegal", function() {
//     expectMove(ILLEGAL, X_TURN, null, 0, 0,
//       [['X', '', ''],
//        ['', '', ''],
//        ['', '', '']], X_TURN, NO_ONE_WINS);
//   });
//   it("placing X in 0x0 from initial state and winning is illegal", function() {
//     expectMove(ILLEGAL, X_TURN, null, 0, 0,
//       [['X', '', ''],
//        ['', '', ''],
//        ['', '', '']], NO_ONE_TURN, X_WIN_SCORES);
//   });
//   it("placing X in 0x0 from initial state and setting the wrong board is illegal", function() {
//     expectMove(ILLEGAL, X_TURN, null, 0, 0,
//       [['X', 'X', ''],
//        ['', '', ''],
//        ['', '', '']], O_TURN, NO_ONE_WINS);
//   });
//   it("placing O in 0x1 after X placed X in 0x0 is legal", function() {
//     expectMove(OK, O_TURN,
//       [['X', '', ''],
//        ['', '', ''],
//        ['', '', '']], 0, 1,
//       [['X', 'O', ''],
//        ['', '', ''],
//        ['', '', '']], X_TURN, NO_ONE_WINS);
//   });
//   it("placing an O in a non-empty position is illegal", function() {
//     expectMove(ILLEGAL, O_TURN,
//       [['X', '', ''],
//        ['', '', ''],
//        ['', '', '']], 0, 0,
//       [['O', '', ''],
//        ['', '', ''],
//        ['', '', '']], X_TURN, NO_ONE_WINS);
//   });
//   it("cannot move after the game is over", function() {
//     expectMove(ILLEGAL, O_TURN,
//       [['X', 'O', ''],
//        ['X', 'O', ''],
//        ['X', '', '']], 2, 1,
//       [['X', 'O', ''],
//        ['X', 'O', ''],
//        ['X', 'O', '']], X_TURN, NO_ONE_WINS);
//   });
//   it("placing O in 2x1 is legal", function() {
//     expectMove(OK, O_TURN,
//       [['O', 'X', ''],
//        ['X', 'O', ''],
//        ['X', '', '']], 2, 1,
//       [['O', 'X', ''],
//        ['X', 'O', ''],
//        ['X', 'O', '']], X_TURN, NO_ONE_WINS);
//   });
//   it("X wins by placing X in 2x0 is legal", function() {
//     expectMove(OK, X_TURN,
//       [['X', 'O', ''],
//        ['X', 'O', ''],
//        ['', '', '']], 2, 0,
//       [['X', 'O', ''],
//        ['X', 'O', ''],
//        ['X', '', '']], NO_ONE_TURN, X_WIN_SCORES);
//   });
//   it("O wins by placing O in 1x1 is legal", function() {
//     expectMove(OK, O_TURN,
//       [['X', 'X', 'O'],
//        ['X', '', ''],
//        ['O', '', '']], 1, 1,
//       [['X', 'X', 'O'],
//        ['X', 'O', ''],
//        ['O', '', '']], NO_ONE_TURN, O_WIN_SCORES);
//   });
//   it("the game ties when there are no more empty cells", function() {
//     expectMove(OK, X_TURN,
//       [['X', 'O', 'X'],
//        ['X', 'O', 'O'],
//        ['O', 'X', '']], 2, 2,
//       [['X', 'O', 'X'],
//        ['X', 'O', 'O'],
//        ['O', 'X', 'X']], NO_ONE_TURN, TIE_SCORES);
//   });
//   it("move without board is illegal", function() {
//     expectMove(ILLEGAL, X_TURN,
//       [['X', 'O', 'X'],
//        ['X', 'O', 'O'],
//        ['O', 'X', '']], 2, 2,
//       null, NO_ONE_TURN, TIE_SCORES);
//   });
//   it("placing X outside the board (in 0x3) is illegal", function() {
//     expectMove(ILLEGAL, X_TURN,
//       [['', '', ''],
//        ['', '', ''],
//        ['', '', '']], 0, 3,
//       [['', '', '', 'X'],
//        ['', '', ''],
//        ['', '', '']], O_TURN, NO_ONE_WINS);
//   });
// });
describe('Simon gameLogic', function () {
    it('expects true to be false', function () {
        expect(false).toBe(true);
    });
    describe('createInitialMove', function () {
        var initialMove;
        it('is blank except for one expected move', function () {
            initialMove = {
                endMatchScores: null,
                turnIndexAfterMove: 0,
                stateAfterMove: {
                    expectedSequence: [jasmine.any(Number)],
                    playerSequence: [],
                    delta: null
                }
            };
            expect(gameLogic.createInitialMove()).toEqual(initialMove);
        });
    });
    describe('addToExpectedSequence', function () {
        var currentState;
        it('adds one to color to the sequence', function () {
            currentState = {
                expectedSequence: [3, 0],
                playerSequence: [],
                delta: jasmine.any(Number)
            };
            var lengthBefore = currentState.expectedSequence.length;
            gameLogic.addToExpectedSequence(currentState);
            expect(lengthBefore).toEqual(2);
            expect(currentState.expectedSequence.length).toEqual(3);
        });
    });
    describe('checkSequenceMatchesExpected', function () {
        var currentState;
        it('returns true when the player sequence is empty', function () {
            currentState = {
                expectedSequence: [3, 0],
                playerSequence: [],
                delta: jasmine.any(Number)
            };
            expect(gameLogic.checkSequenceMatchesExpected(currentState)).toEqual(true);
        });
        it('returns true when the player sequence matches the expected sequence so far', function () {
            currentState = {
                expectedSequence: [3, 0],
                playerSequence: [3],
                delta: jasmine.any(Number)
            };
            expect(gameLogic.checkSequenceMatchesExpected(currentState)).toEqual(true);
        });
        it('returns false when the player sequence is different than expected', function () {
            currentState = {
                expectedSequence: [3, 0],
                playerSequence: [1],
                delta: jasmine.any(Number)
            };
            expect(gameLogic.checkSequenceMatchesExpected(currentState)).toEqual(false);
        });
    });
    describe('getWinner', function () {
        var currentState;
        var turnIndex;
        it('returns -1 if nobody has lost yet', function () {
            currentState = {
                expectedSequence: [3, 0],
                playerSequence: [],
                delta: jasmine.any(Number)
            };
            turnIndex = 1;
            expect(gameLogic.getWinner(currentState, turnIndex)).toEqual(-1);
        });
        it('returns 1 if player 0 has lost', function () {
            currentState = {
                expectedSequence: [3, 0],
                playerSequence: [1, 1],
                delta: jasmine.any(Number)
            };
            turnIndex = 0;
            expect(gameLogic.getWinner(currentState, turnIndex)).toEqual(1);
        });
        it('returns 0 if player 1 has lost', function () {
            currentState = {
                expectedSequence: [3, 0],
                playerSequence: [1, 1],
                delta: jasmine.any(Number)
            };
            turnIndex = 1;
            expect(gameLogic.getWinner(currentState, turnIndex)).toEqual(1);
        });
    });
});
//# sourceMappingURL=gameLogic_test.js.map