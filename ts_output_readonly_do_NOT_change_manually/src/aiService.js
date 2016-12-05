var aiService;
(function (aiService) {
    function chooseFromPossibleMoves(state, currentUpdateUI) {
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
        move = gameLogic.createMove(state, num, currentUpdateUI);
        return move;
    }
    aiService.chooseFromPossibleMoves = chooseFromPossibleMoves;
})(aiService || (aiService = {}));
//# sourceMappingURL=aiService.js.map