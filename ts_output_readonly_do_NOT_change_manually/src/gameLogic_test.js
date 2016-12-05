describe("Simon gameLogic", function () {
    describe("getInitialState", function () {
        it("returns a properly configured initial state object", function () {
            spyOn(Math, "random").and.returnValue(0.85);
            expect(gameLogic.getInitialState()).toEqual({
                status: GameStatus.IDLE,
                expectedSequence: [3],
                playerSequence: [],
                delta: null
            });
        });
    });
    describe("checkSequenceMatchesExpected", function () {
        it("returns true when playerSequence matches expectedSequence", function () {
            var state = {
                playerSequence: [0, 1, 2, 3],
                expectedSequence: [0, 1, 2, 3]
            };
            expect(gameLogic.checkSequenceMatchesExpected(state)).toBe(true);
        });
        it("returns false when playerSequence does not match expectedSequence", function () {
            var state = {
                playerSequence: [0, 1, 2, 3],
                expectedSequence: [0, 1, 3, 2]
            };
            expect(gameLogic.checkSequenceMatchesExpected(state)).toBe(false);
        });
    });
    describe("addToExpectedSequence", function () {
        it("adds a random number to the state's expectedSequence", function () {
            var state = {
                expectedSequence: [3]
            };
            spyOn(Math, "random").and.returnValue(0.26);
            gameLogic.addToExpectedSequence(state);
            expect(state.expectedSequence).toEqual([3, 1]);
        });
    });
    describe("getWinner", function () {
        it("returns the index of whomevers turn it is not when there is a winner", function () {
            var state = {
                expectedSequence: [0, 1, 2, 3],
                playerSequence: [0, 1, 3, 2]
            };
            expect(gameLogic.getWinner(state, 1)).toEqual(0);
            expect(gameLogic.getWinner(state, 0)).toEqual(1);
        });
        it("returns -1 if there is not yet a winner", function () {
            var state = {
                expectedSequence: [0, 1, 2, 3],
                playerSequence: [0, 1, 2, 3]
            };
            expect(gameLogic.getWinner(state, 1)).toEqual(-1);
            expect(gameLogic.getWinner(state, 0)).toEqual(-1);
        });
    });
    describe("createMove", function () {
        var stateBeforeMove;
        var color;
        var currentUpdateUI;
        beforeEach(function () {
            color = 0;
            currentUpdateUI = {
                numberOfPlayers: 2,
                move: {
                    turnIndexAfterMove: 1
                }
            };
        });
        describe("when there is a winner", function () {
            beforeEach(function () {
                stateBeforeMove = {
                    expectedSequence: [0, 1],
                    playerSequence: [0]
                };
            });
            it("sets endMatchScores to an array of 0 for every player (shrug)", function () {
                var endMatchScores = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI).endMatchScores;
                expect(endMatchScores).toEqual([0, 0]);
            });
            it("sets turnIndexAfterMove to -1", function () {
                var turnIndexAfterMove = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI).turnIndexAfterMove;
                expect(turnIndexAfterMove).toEqual(-1);
            });
            it("sets stateAfterMove to reflect the win", function () {
                var stateAfterMove = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI).stateAfterMove;
                expect(stateAfterMove).toEqual({
                    status: GameStatus.ENDED,
                    delta: color,
                    playerSequence: [0, 0],
                    expectedSequence: stateBeforeMove.expectedSequence
                });
            });
        });
        describe("when there is no winner", function () {
            beforeEach(function () {
                stateBeforeMove = {
                    playerSequence: [],
                    expectedSequence: [0, 1]
                };
                spyOn(Math, "random").and.returnValue(0.75);
            });
            it("sets endsMatchScores to null", function () {
                var endMatchScores = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI).endMatchScores;
                expect(endMatchScores).toBeNull();
            });
            describe("when the playerSequence is the same length as the expectedSequence", function () {
                beforeEach(function () {
                    stateBeforeMove.playerSequence.push(0);
                    color = 1;
                });
                it("flips the turnIndexAfterMove", function () {
                    var turnIndexAfterMove = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI).turnIndexAfterMove;
                    expect(turnIndexAfterMove).toEqual(0);
                });
                it("updates the stateAfterMove to reflect the start of a new sequence", function () {
                    var stateAfterMove = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI).stateAfterMove;
                    expect(stateAfterMove).toEqual({
                        status: GameStatus.AWAITING_NEXT_SEQUENCE_START,
                        delta: color,
                        playerSequence: [],
                        expectedSequence: [0, 1, 3]
                    });
                });
            });
            describe("when the playerSequence is not the same length as the expectedSequence", function () {
                it("keeps turnIndexAfterMove the same", function () {
                    var turnIndexAfterMove = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI).turnIndexAfterMove;
                    expect(turnIndexAfterMove).toEqual(1);
                });
                it("updates stateAfterMove to reflect the new addition", function () {
                    var stateAfterMove = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI).stateAfterMove;
                    expect(stateAfterMove).toEqual({
                        expectedSequence: [0, 1],
                        playerSequence: [0],
                        status: GameStatus.AWAITING_INPUT,
                        delta: color
                    });
                });
            });
        });
        describe("when no state is given", function () {
            beforeEach(function () {
                spyOn(Math, "random").and.returnValue(0.01);
                stateBeforeMove = null;
            });
            it("uses the initial state as stateBeforeMove", function () {
                var stateAfterMove = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI).stateAfterMove;
                expect(stateAfterMove).toEqual({
                    status: GameStatus.AWAITING_NEXT_SEQUENCE_START,
                    delta: 0,
                    playerSequence: [],
                    expectedSequence: [0, 0]
                });
            });
        });
    });
    describe("createInitialMove", function () {
        it("returns the initial move", function () {
            expect(gameLogic.createInitialMove()).toEqual({
                endMatchScores: null,
                turnIndexAfterMove: 0,
                stateAfterMove: gameLogic.getInitialState()
            });
        });
    });
    describe("checkMoveOk", function () {
        it("is a NOP", function () { return expect(gameLogic.checkMoveOk({})).toBeUndefined(); });
    });
});
//# sourceMappingURL=gameLogic_test.js.map