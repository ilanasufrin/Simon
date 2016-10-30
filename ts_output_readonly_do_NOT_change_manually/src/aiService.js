// module aiService {
//   /** Returns the move that the computer player should do for the given state in move. */
//   export function findComputerMove(move: IMove): IMove {
//     return createComputerMove(move,
//         // at most 1 second for the AI to choose a move (but might be much quicker)
//         {millisecondsLimit: 1000});
//   }
//   /**
//    * Returns all the possible moves for the given state and turnIndexBeforeMove.
//    * Returns an empty array if the game is over.
//    */
//   export function getPossibleMoves(state: IState, turnIndexBeforeMove: number): IMove[] {
//     let possibleMoves: IMove[] = [];
//     for (let i = 0; i < gameLogic.ROWS; i++) {
//       for (let j = 0; j < gameLogic.COLS; j++) {
//         try {
//           possibleMoves.push(gameLogic.createMove(state, i, j, turnIndexBeforeMove));
//         } catch (e) {
//           // The cell in that position was full.
//         }
//       }
//     }
//     return possibleMoves;
//   }
//   *
//    * Returns the move that the computer player should do for the given state.
//    * alphaBetaLimits is an object that sets a limit on the alpha-beta search,
//    * and it has either a millisecondsLimit or maxDepth field:
//    * millisecondsLimit is a time limit, and maxDepth is a depth limit.
//   export function createComputerMove(
//       move: IMove, alphaBetaLimits: IAlphaBetaLimits): IMove {
//     // We use alpha-beta search, where the search states are TicTacToe moves.
//     return alphaBetaService.alphaBetaDecision(
//         move, move.turnIndexAfterMove, getNextStates, getStateScoreForIndex0, null, alphaBetaLimits);
//   }
//   function getStateScoreForIndex0(move: IMove, playerIndex: number): number {
//     let endMatchScores = move.endMatchScores;
//     if (endMatchScores) {
//       return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
//           : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
//           : 0;
//     }
//     return 0;
//   }
//   function getNextStates(move: IMove, playerIndex: number): IMove[] {
//     return getPossibleMoves(move.stateAfterMove, playerIndex);
//   }
// }
var aiService;
(function (aiService) {
    /** Returns the move that the computer player should do for the given state in move. */
    function findComputerMove(move) {
        return createComputerMove(move, 
        // at most 1 second for the AI to choose a move (but might be much quicker)
        { millisecondsLimit: 1000 });
    }
    aiService.findComputerMove = findComputerMove;
    /**
     * Returns all the possible moves for the given state and turnIndexBeforeMove.
     * Returns an empty array if the game is over.
     */
    function chooseFromPossibleMoves(state, turnIndexBeforeMove) {
        var winningChoice = state.delta;
        var possibleMoves = [];
        for (var i = 0; i <= 3; i++) {
            possibleMoves.push(i); //we will choose from all the colors
        }
        possibleMoves.push(winningChoice);
        possibleMoves.push(winningChoice);
        possibleMoves.push(winningChoice);
        possibleMoves.push(winningChoice); //give a greater chance that we will choose the right color
        var choice = (Math.floor(Math.random() * possibleMoves.length));
        var num = possibleMoves[choice];
        console.debug('num ', num);
        move = gameLogic.createMove(state, num, turnIndexBeforeMove);
        console.debug('choosing', move);
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
        console.debug('move!', move);
        return (move, move.turnIndexAfterMove, chooseFromPossibleMoves(move.stateAfterMove, move.turnIndexAfterMove));
    }
    aiService.createComputerMove = createComputerMove;
})(aiService || (aiService = {}));
//# sourceMappingURL=aiService.js.map