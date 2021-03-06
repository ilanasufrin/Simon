type Sequence = number[];

enum GameStatus {
  IDLE,
  AWAITING_NEXT_SEQUENCE_START,
  PLAYING_SEQUENCE,
  AWAITING_INPUT,
  ENDED
}

interface IState {
  status: GameStatus;
  expectedSequence: Sequence;
  playerSequence: Sequence;
  delta: number;
}

// Sentinel since no proposals in Simon
interface IProposalData {}

namespace gameLogic {
  /** Returns an initial, empty, sequence for the players and the board. */
  function getInitialSequence(): Sequence {
    let emptySequence: Sequence = [];
    return emptySequence;
  }

  function getInitialSequencePopulated(): Sequence {
    let sequence: Sequence = [];
    sequence.push(Math.floor(Math.random() * 4));
    return sequence;
  }

  export function getInitialState(): IState {
    return {
      status: GameStatus.IDLE,
      expectedSequence: getInitialSequencePopulated(),
      playerSequence: getInitialSequence(),
      delta: null
    };
  }


  export function checkSequenceMatchesExpected(currentState: IState): boolean {
    for (let i = 0; i < currentState.playerSequence.length; i++) {
      if (currentState.expectedSequence[i] !== currentState.playerSequence[i]) {
        return false;
      }
    }
    return true;
  }

  export function addToExpectedSequence(currentState: IState) {
    let newColor = Math.floor(Math.random() * 4);
    currentState.expectedSequence.push(newColor);
    return newColor;
  }

  // if there is newly a loss, return the index of whoever just lost
  export function getWinner(currentState: IState, turnIndexOfMove: number): number {
    if (!checkSequenceMatchesExpected(currentState)) {
      return 1 - turnIndexOfMove;
    }
    return -1; // no winner
  }

  /**
   * Returns the move that should be performed when player
   * with index turnIndexBeforeMove adds a move to their sequence.
   */
  export function createMove(stateBeforeMove: IState, color: number, currentUpdateUI: IUpdateUI): IMove {
    if (!stateBeforeMove) {
      stateBeforeMove = getInitialState();
    }
    let nextStatus = GameStatus.AWAITING_INPUT;
    let sequence1: Sequence = stateBeforeMove.expectedSequence;
    let sequence2: Sequence = stateBeforeMove.playerSequence;
    let sequence1AfterMove = angular.copy(sequence1);
    let sequence2AfterMove = angular.copy(sequence2);

    stateBeforeMove.playerSequence.push(color);
    sequence2AfterMove.push(color);

    const {turnIndexAfterMove: turnIndexBeforeMove} = currentUpdateUI.move;
    let winner = getWinner(stateBeforeMove, turnIndexBeforeMove);
    let endMatchScores: number[];
    let turnIndexAfterMove: number;
    if (winner >= 0) {
      // Game over.
      nextStatus = GameStatus.ENDED;
      turnIndexAfterMove = -1;
      endMatchScores = [];
      for (let i = 0; i < currentUpdateUI.numberOfPlayers; i++) {
        endMatchScores.push(0);
      }
    } else {
      // Game continues. Now it"s the opponent"s turn (the turn switches from 0 to 1 and 1 to 0).
      // clear the player"s sequence so we can start the pattern over
      // but only if the player has submitted enough colors to make a full sequence
      if (sequence1AfterMove.length === sequence2AfterMove.length) {
        sequence2AfterMove = [];

        // add a new color for the next round
        let newColor = addToExpectedSequence(stateBeforeMove);
        sequence1AfterMove.push(newColor);

        // switch players, but only once a full turn is completed
        turnIndexAfterMove = (turnIndexBeforeMove + 1) % currentUpdateUI.numberOfPlayers;
        nextStatus = GameStatus.AWAITING_NEXT_SEQUENCE_START;
      } else {
        // keep the same player until a sequence has been completed
        turnIndexAfterMove = turnIndexBeforeMove;
      }
      endMatchScores = null;
    }

    let delta: number = color;
    let stateAfterMove: IState = {
      status: nextStatus,
      delta,
      playerSequence: sequence2AfterMove,
      expectedSequence: sequence1AfterMove
    };
    return { endMatchScores, turnIndexAfterMove, stateAfterMove };
  }

  export function createInitialMove(): IMove {
    return {
      endMatchScores: null,
      turnIndexAfterMove: 0,
      stateAfterMove: getInitialState()
    };
  }

  export function checkMoveOk(stateTransition: IStateTransition): void {
    // There are no "invalid moves" in Simon, therefore this is a nop.
  }
}
