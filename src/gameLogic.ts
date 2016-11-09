// type Board = string[][];
// interface BoardDelta {
//   row: number;
//   col: number;
// }
// interface IState {
//   board: Board;
//   delta: BoardDelta;
// }

// module gameLogic {
//   export const ROWS = 3;
//   export const COLS = 3;

//   /** Returns the initial TicTacToe board, which is a ROWSxCOLS matrix containing ''. */
//   function getInitialBoard(): Board {
//     let board: Board = [];
//     for (let i = 0; i < ROWS; i++) {
//       board[i] = [];
//       for (let j = 0; j < COLS; j++) {
//         board[i][j] = '';
//       }
//     }
//     return board;
//   }

//   export function getInitialState(): IState {
//     return {board: getInitialBoard(), delta: null};
//   }

//   /**
//    * Returns true if the game ended in a tie because there are no empty cells.
//    * E.g., isTie returns true for the following board:
//    *     [['X', 'O', 'X'],
//    *      ['X', 'O', 'O'],
//    *      ['O', 'X', 'X']]
//    */
//   function isTie(board: Board): boolean {
//     for (let i = 0; i < ROWS; i++) {
//       for (let j = 0; j < COLS; j++) {
//         if (board[i][j] === '') {
//           // If there is an empty cell then we do not have a tie.
//           return false;
//         }
//       }
//     }
//     // No empty cells, so we have a tie!
//     return true;
//   }

//   /**
//    * Return the winner (either 'X' or 'O') or '' if there is no winner.
//    * The board is a matrix of size 3x3 containing either 'X', 'O', or ''.
//    * E.g., getWinner returns 'X' for the following board:
//    *     [['X', 'O', ''],
//    *      ['X', 'O', ''],
//    *      ['X', '', '']]
//    */
//   function getWinner(board: Board): string {
//     let boardString = '';
//     for (let i = 0; i < ROWS; i++) {
//       for (let j = 0; j < COLS; j++) {
//         let cell = board[i][j];
//         boardString += cell === '' ? ' ' : cell;
//       }
//     }
//     let win_patterns = [
//       'XXX......',
//       '...XXX...',
//       '......XXX',
//       'X..X..X..',
//       '.X..X..X.',
//       '..X..X..X',
//       'X...X...X',
//       '..X.X.X..'
//     ];
//     for (let win_pattern of win_patterns) {
//       let x_regexp = new RegExp(win_pattern);
//       let o_regexp = new RegExp(win_pattern.replace(/X/g, 'O'));
//       if (x_regexp.test(boardString)) {
//         return 'X';
//       }
//       if (o_regexp.test(boardString)) {
//         return 'O';
//       }
//     }
//     return '';
//   }

//   /**
//    * Returns the move that should be performed when player
//    * with index turnIndexBeforeMove makes a move in cell row X col.
//    */
//   export function createMove(
//       stateBeforeMove: IState, row: number, col: number, turnIndexBeforeMove: number): IMove {
//     if (!stateBeforeMove) {
//       stateBeforeMove = getInitialState();
//     }
//     let board: Board = stateBeforeMove.board;
//     if (board[row][col] !== '') {
//       throw new Error("One can only make a move in an empty position!");
//     }
//     if (getWinner(board) !== '' || isTie(board)) {
//       throw new Error("Can only make a move if the game is not over!");
//     }
//     let boardAfterMove = angular.copy(board);
//     boardAfterMove[row][col] = turnIndexBeforeMove === 0 ? 'X' : 'O';
//     let winner = getWinner(boardAfterMove);
//     let endMatchScores: number[];
//     let turnIndexAfterMove: number;
//     if (winner !== '' || isTie(boardAfterMove)) {
//       // Game over.
//       turnIndexAfterMove = -1;
//       endMatchScores = winner === 'X' ? [1, 0] : winner === 'O' ? [0, 1] : [0, 0];
//     } else {
//       // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
//       turnIndexAfterMove = 1 - turnIndexBeforeMove;
//       endMatchScores = null;
//     }
//     let delta: BoardDelta = {row: row, col: col};
//     let stateAfterMove: IState = {delta: delta, board: boardAfterMove};
//     return {endMatchScores: endMatchScores, turnIndexAfterMove: turnIndexAfterMove, stateAfterMove: stateAfterMove};
//   }

//   export function createInitialMove(): IMove {
//     return {endMatchScores: null, turnIndexAfterMove: 0,
//         stateAfterMove: getInitialState()};
//   }

//   export function checkMoveOk(stateTransition: IStateTransition): void {
//     // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
//     // to verify that the move is OK.
//     let turnIndexBeforeMove = stateTransition.turnIndexBeforeMove;
//     let stateBeforeMove: IState = stateTransition.stateBeforeMove;
//     let move: IMove = stateTransition.move;
//     if (!stateBeforeMove && turnIndexBeforeMove === 0 &&
//         angular.equals(createInitialMove(), move)) {
//       return;
//     }
//     let deltaValue: BoardDelta = move.stateAfterMove.delta;
//     let row = deltaValue.row;
//     let col = deltaValue.col;
//     let expectedMove = createMove(stateBeforeMove, row, col, turnIndexBeforeMove);
//     if (!angular.equals(move, expectedMove)) {
//       throw new Error("Expected move=" + angular.toJson(expectedMove, true) +
//           ", but got stateTransition=" + angular.toJson(stateTransition, true))
//     }
//   }

//   export function forSimpleTestHtml() {
//     var move = gameLogic.createMove(null, 0, 0, 0);
//     log.log("move=", move);
//     var params: IStateTransition = {
//       turnIndexBeforeMove: 0,
//       stateBeforeMove: null,
//       move: move,
//       numberOfPlayers: 2};
//     gameLogic.checkMoveOk(params);
//   }
// }

type Sequence = number[];


interface SequenceDelta {
  color: number;
}

interface IState {
  expectedSequence: Sequence;
  playerSequence: Sequence;
  delta: SequenceDelta;
}

module gameLogic {
/** Returns an initial, empty, sequence for the players and the board. */
  function getInitialSequence(): Sequence {
    let emptySequence: Sequence = [];
    return emptySequence;
  }

  function getInitialSequencePopulated(): Sequence {
    let sequence: Sequence = [];
    sequence.push(Math.floor(Math.random()*4));
    return sequence;
  }

  export function getInitialState(): IState {
    return {expectedSequence: getInitialSequencePopulated(), playerSequence: getInitialSequence(), delta: null}
  }


  export function checkSequenceMatchesExpected(currentState: IState): boolean {
    console.log('checking sequence');
    console.log(currentState);
    for (let i = 0; i < currentState.playerSequence.length; i++) {
      if (currentState.expectedSequence[i] !== currentState.playerSequence[i]) {
        return false;
      }
    }
    return true;
  }

  export function addToExpectedSequence(currentState: IState) {
    let newColor = Math.floor(Math.random()*4);
    currentState.expectedSequence.push(newColor);
    console.log('returning new color', newColor);
    return newColor;
  }

  //if there is newly a loss, return the index of whoever just lost
  export function getWinner(currentState: IState, turnIndexOfMove: number): number {
    console.log('checking winner');
    console.log(currentState);
    if (!checkSequenceMatchesExpected(currentState)) {
      console.log('there is a winner');
      console.log('this is the loser', turnIndexOfMove);
      return 1 - turnIndexOfMove;
    }
    console.log('no winner');
    return -1; //no winner
  }

   /**
    * Returns the move that should be performed when player
    * with index turnIndexBeforeMove adds a move to their sequence.
    */
  export function createMove(stateBeforeMove: IState, color: number, turnIndexBeforeMove: number): IMove {
    if (!stateBeforeMove) {
      stateBeforeMove = getInitialState();
    }
    log.info('state passed into createMove');
    log.info(stateBeforeMove);
    let sequence1: Sequence = stateBeforeMove.expectedSequence;
    let sequence2: Sequence = stateBeforeMove.playerSequence;
    let sequence1AfterMove = angular.copy(sequence1);
    let sequence2AfterMove = angular.copy(sequence2);

    log.info('sequence after copying');
    log.info(sequence2AfterMove);

    stateBeforeMove.playerSequence.push(color);
    sequence2AfterMove.push(color);

    let winner = getWinner(stateBeforeMove, turnIndexBeforeMove);
    let endMatchScores: number[];
    let turnIndexAfterMove: number;
    if (winner !== -1) {
      log.info('game over');
      console.debug('the winner is ', winner);
      // Game over.
      turnIndexAfterMove = -1;
      endMatchScores = winner === 0 ? [1, 0] : winner === 1 ? [0, 1] : [0, 0];
    } else {
      // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
      log.info('game continues');

      //clear the player's sequence so we can start the pattern over
      //but only if the player has submitted enough colors to make a full sequence
      if (sequence1AfterMove.length === sequence2AfterMove.length) {
        log.info('submitted a full pattern, clearing');
        sequence2AfterMove = [];

        //add a new color for the next round
        let newColor = addToExpectedSequence(stateBeforeMove);
        console.log('next color in sequence', newColor);
        sequence1AfterMove.push(newColor);

      //switch players, but only once a full turn is completed
      turnIndexAfterMove = 1 - turnIndexBeforeMove;
      } else {
        //keep the same player until a sequence has been completed
        turnIndexAfterMove = turnIndexBeforeMove;
      }

      endMatchScores = null;
    }

    let delta: SequenceDelta = color;
    let stateAfterMove: IState = {delta: delta, playerSequence: sequence2AfterMove, expectedSequence: sequence1AfterMove};
    console.log(stateAfterMove);
    return {endMatchScores: endMatchScores, turnIndexAfterMove: turnIndexAfterMove, stateAfterMove: stateAfterMove};
  }

  export function createInitialMove(): IMove {
    return {endMatchScores: null, turnIndexAfterMove: 0,
        stateAfterMove: getInitialState()};
  }

  export function checkMoveOk(stateTransition: IStateTransition): void {
    // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
    // to verify that the move is OK.
    // let turnIndexBeforeMove = stateTransition.turnIndexBeforeMove;
    // let stateBeforeMove: IState = stateTransition.stateBeforeMove;
    // let move: IMove = stateTransition.move;
    // console.debug('move', move);
    // if (!stateBeforeMove && turnIndexBeforeMove === 0 &&
    //     angular.equals(createInitialMove(), move)) {
    //   return;
    // }
    // let deltaValue: SequenceDelta = move.stateAfterMove.delta;
    // console.debug('delta value', deltaValue);


    // let row = deltaValue.row;
    // let col = deltaValue.col;
    //idk why this is here yet
    // let expectedMove = createMove(stateBeforeMove, deltaValue, turnIndexBeforeMove);
    // if (!angular.equals(move, expectedMove)) {
    //   throw new Error("Expected move=" + angular.toJson(expectedMove, true) +
    //       ", but got stateTransition=" + angular.toJson(stateTransition, true))
    // }
  }

}

