describe("aiService", function () {
    describe("chooseFromPossibleMoves", function () {
        beforeEach(function () {
            spyOn(gameLogic, "createMove").and.callFake(function (_, num, __) { return ({
                num: num
            }); });
        });
        it("chooses a move at random from a list of possible moves using the given state and updateUI", function () {
            spyOn(Math, "random").and.returnValue(0.5);
            var state = {
                delta: 100
            };
            var updateUI = {};
            var move = aiService.chooseFromPossibleMoves(state, updateUI);
            expect(move.num).toEqual(state.delta);
            expect(gameLogic.createMove).toHaveBeenCalledWith(state, state.delta, updateUI);
        });
        it("chooses from 0-3 when given the when given one of the first 4 indices", function () {
            spyOn(Math, "random").and.returnValue(0.125);
            var state = {
                delta: 100
            };
            var updateUI = {};
            var move = aiService.chooseFromPossibleMoves(state, updateUI);
            expect(move.num).toEqual(1);
            expect(gameLogic.createMove).toHaveBeenCalledWith(state, 1, updateUI);
        });
        it("biases towards state.delta", function () {
            spyOn(Math, "random").and.returnValue(0.5);
            var state = {
                delta: 100
            };
            var updateUI = {};
            var move = aiService.chooseFromPossibleMoves(state, updateUI);
            expect(move.num).toEqual(state.delta);
            expect(gameLogic.createMove).toHaveBeenCalledWith(state, state.delta, updateUI);
            Math.random.and.returnValue(0.75);
            var move2 = aiService.chooseFromPossibleMoves(state, updateUI);
            expect(move.num).toEqual(state.delta);
            expect(gameLogic.createMove).toHaveBeenCalledWith(state, state.delta, updateUI);
        });
    });
});
//# sourceMappingURL=aiService_test.js.map