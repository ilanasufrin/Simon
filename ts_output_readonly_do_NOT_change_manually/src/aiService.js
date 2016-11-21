var aiService;
(function (aiService) {
    /** Returns the move that the computer player should do for the given state in move. */
    function findComputerMove(move) {
        return createComputerMove(move);
    }
    aiService.findComputerMove = findComputerMove;
    /**
     * Returns all the possible moves for the given state and turnIndexBeforeMove.
     * Returns an empty array if the game is over.
     */
    function chooseFromPossibleMoves(state, turnIndexBeforeMove) {
        var winningChoice = state.delta;
        var possibleMoves = [];
        var move;
        for (var i = 0; i <= 3; i++) {
            possibleMoves.push(i); // we will choose from all the colors
        }
        possibleMoves.push(winningChoice);
        possibleMoves.push(winningChoice);
        possibleMoves.push(winningChoice);
        possibleMoves.push(winningChoice); // give a greater chance that we will choose the right color
        var choice = (Math.floor(Math.random() * possibleMoves.length));
        var num = possibleMoves[choice];
        console.debug("num ", num);
        move = gameLogic.createMove(state, num, turnIndexBeforeMove);
        console.debug("choosing", move);
        return move;
    }
    aiService.chooseFromPossibleMoves = chooseFromPossibleMoves;
    /**
     * Returns the move that the computer player should do for the given state.
     * alphaBetaLimits is an object that sets a limit on the alpha-beta search,
     * and it has either a millisecondsLimit or maxDepth field:
     * millisecondsLimit is a time limit, and maxDepth is a depth limit.
     */
    function createComputerMove(move) {
        console.debug("move!", move);
        return (move.turnIndexAfterMove, chooseFromPossibleMoves(move.stateAfterMove, move.turnIndexAfterMove));
    }
    aiService.createComputerMove = createComputerMove;
})(aiService || (aiService = {}));
//# sourceMappingURL=aiService.js.map