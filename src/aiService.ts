namespace aiService {
  /** Returns the move that the computer player should do for the given state in move. */
  export function findComputerMove(move: IMove): IMove {
    return createComputerMove(move);
  }

  /**
   * Returns all the possible moves for the given state and turnIndexBeforeMove.
   * Returns an empty array if the game is over.
   */
  export function chooseFromPossibleMoves(state: IState, turnIndexBeforeMove: number): IMove {
    let winningChoice: number = state.delta;
    let possibleMoves: number[] = [];
    let move;
    for (let i = 0; i <= 3; i++) {
      possibleMoves.push(i); // we will choose from all the colors
    }

    possibleMoves.push(winningChoice);
    possibleMoves.push(winningChoice);
    possibleMoves.push(winningChoice);
    possibleMoves.push(winningChoice); // give a greater chance that we will choose the right color

    let choice: number = (Math.floor(Math.random() * possibleMoves.length));
    let num: number = possibleMoves[choice];
    console.debug("num ", num);
    move = gameLogic.createMove(state, num, turnIndexBeforeMove);
    console.debug("choosing", move);
    return move;
  }

  /**
   * Returns the move that the computer player should do for the given state.
   * alphaBetaLimits is an object that sets a limit on the alpha-beta search,
   * and it has either a millisecondsLimit or maxDepth field:
   * millisecondsLimit is a time limit, and maxDepth is a depth limit.
   */
  export function createComputerMove(move: IMove): IMove {
    console.debug("move!", move);
    return (move.turnIndexAfterMove, chooseFromPossibleMoves(move.stateAfterMove, move.turnIndexAfterMove));
  }
}
