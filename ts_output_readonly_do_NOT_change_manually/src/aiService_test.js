describe('aiService', function () {
    describe('chooseFromPossibleMoves', function () {
        var state;
        var turnIndexBeforeMove;
        var delta = 3;
        it('returns a valid move', function () {
            state = {
                expectedSequence: [3, 0],
                playerSequence: [],
                delta: delta
            };
            turnIndexBeforeMove = 0;
            var choice = aiService.chooseFromPossibleMoves(state, turnIndexBeforeMove);
            expect(choice.endMatchScores).toBeDefined();
            expect(choice.turnIndexAfterMove).toEqual(jasmine.any(Number));
            expect(choice.stateAfterMove).toBeDefined();
            expect(choice.stateAfterMove.delta).toEqual(jasmine.any(Number));
            expect(choice.stateAfterMove.playerSequence).toBeDefined();
            expect(choice.stateAfterMove.expectedSequence).toBeDefined();
        });
    });
    describe('createComputerMove', function () {
        var move;
        var delta = 3;
        it('returns a valid move', function () {
            move = {
                endMatchScores: [0, 1],
                turnIndexAfterMove: 1,
                stateAfterMove: {
                    expectedSequence: [3, 0],
                    playerSequence: [],
                    delta: delta
                }
            };
            var compMove = aiService.createComputerMove(move);
            expect(move).toEqual({
                endMatchScores: [0, 1],
                turnIndexAfterMove: 1,
                stateAfterMove: {
                    expectedSequence: [3, 0],
                    playerSequence: [jasmine.any(Number)],
                    delta: delta
                }
            });
        });
    });
    describe('findComputerMove', function () {
        var move;
        var delta = 3;
        it('returns the move that the computer player should do for the given state in the passed-in move.', function () {
            move = {
                endMatchScores: [0, 1],
                turnIndexAfterMove: 1,
                stateAfterMove: {
                    expectedSequence: [3, 0],
                    playerSequence: [],
                    delta: delta
                }
            };
            var compMove = aiService.findComputerMove(move);
            expect(move).toEqual({
                endMatchScores: [0, 1],
                turnIndexAfterMove: 1,
                stateAfterMove: {
                    expectedSequence: [3, 0],
                    playerSequence: [3],
                    delta: delta
                }
            });
        });
    });
});
//# sourceMappingURL=aiService_test.js.map