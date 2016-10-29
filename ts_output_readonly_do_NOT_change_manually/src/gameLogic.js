// type Board = string[][];
// interface BoardDelta {
//   row: number;
//   col: number;
// }
// interface IState {
//   board: Board;
//   delta: BoardDelta;
// }
var gameLogic;
(function (gameLogic) {
    /** Returns an initial, empty, sequence for the players and the board. */
    function getInitialSequence() {
        var emptySequence = [];
        return emptySequence;
    }
    function getInitialSequencePopulated() {
        var sequence = [];
        sequence.push(Math.floor(Math.random() * 4));
        return sequence;
    }
    function getInitialState() {
        return { expectedSequence: getInitialSequencePopulated(), playerSequence: getInitialSequence(), delta: null };
    }
    gameLogic.getInitialState = getInitialState;
    function checkSequenceMatchesExpected(currentState) {
        console.log('checking sequence');
        console.log(currentState);
        for (var i = 0; i < currentState.playerSequence.length; i++) {
            if (currentState.expectedSequence[i] !== currentState.playerSequence[i]) {
                return false;
            }
        }
        return true;
    }
    gameLogic.checkSequenceMatchesExpected = checkSequenceMatchesExpected;
    function addToExpectedSequence(currentState) {
        var newColor = Math.floor(Math.random() * 4);
        currentState.expectedSequence.push(newColor);
        console.log('returning new color', newColor);
        return newColor;
    }
    gameLogic.addToExpectedSequence = addToExpectedSequence;
    //if there is newly a loss, return the index of whoever just lost
    function getWinner(currentState, turnIndexOfMove) {
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
    gameLogic.getWinner = getWinner;
    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove makes a move to their sequence.
     */
    function createMove(stateBeforeMove, color, turnIndexBeforeMove) {
        if (!stateBeforeMove) {
            stateBeforeMove = getInitialState();
        }
        log.info('state passed into createMove');
        log.info(stateBeforeMove);
        var sequence1 = stateBeforeMove.expectedSequence;
        var sequence2 = stateBeforeMove.playerSequence;
        var sequence1AfterMove = angular.copy(sequence1);
        var sequence2AfterMove = angular.copy(sequence2);
        log.info('sequence after copying');
        log.info(sequence2AfterMove);
        // let winner = getWinner(sequence2AfterMove, turnIndexBeforeMove);
        stateBeforeMove.playerSequence.push(color);
        sequence2AfterMove.push(color);
        var winner = getWinner(stateBeforeMove, turnIndexBeforeMove);
        var endMatchScores;
        var turnIndexAfterMove;
        if (winner !== -1) {
            log.info('game over');
            console.debug('the winner is ', winner);
            // Game over.
            turnIndexAfterMove = -1;
            endMatchScores = winner === 0 ? [1, 0] : winner === 1 ? [0, 1] : [0, 0];
        }
        else {
            // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
            log.info('game continues');
            //clear the player's sequence so we can start the pattern over
            //but only if the player has submitted enough colors to make a full sequence
            if (sequence1AfterMove.length === sequence2AfterMove.length) {
                log.info('submitted a full pattern, clearing');
                sequence2AfterMove = [];
                //add a new color for the next round
                var newColor = addToExpectedSequence(stateBeforeMove);
                console.log('next color in sequence', newColor);
                sequence1AfterMove.push(newColor);
                //switch players, but only once a full turn is completed
                turnIndexAfterMove = 1 - turnIndexBeforeMove;
            }
            else {
                //keep the same player until a sequence has been completed
                turnIndexAfterMove = turnIndexBeforeMove;
            }
            endMatchScores = null;
        }
        var delta = color;
        var stateAfterMove = { delta: delta, playerSequence: sequence2AfterMove, expectedSequence: sequence1AfterMove };
        console.log(stateAfterMove);
        return { endMatchScores: endMatchScores, turnIndexAfterMove: turnIndexAfterMove, stateAfterMove: stateAfterMove };
    }
    gameLogic.createMove = createMove;
    function createInitialMove() {
        return { endMatchScores: null, turnIndexAfterMove: 0,
            stateAfterMove: getInitialState() };
    }
    gameLogic.createInitialMove = createInitialMove;
    function checkMoveOk(stateTransition) {
        // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
        // to verify that the move is OK.
        var turnIndexBeforeMove = stateTransition.turnIndexBeforeMove;
        var stateBeforeMove = stateTransition.stateBeforeMove;
        var move = stateTransition.move;
        console.debug('move', move);
        if (!stateBeforeMove && turnIndexBeforeMove === 0 &&
            angular.equals(createInitialMove(), move)) {
            return;
        }
        var deltaValue = move.stateAfterMove.delta;
        console.debug('delta value', deltaValue);
        // let row = deltaValue.row;
        // let col = deltaValue.col;
        //idk why this is here yet
        // let expectedMove = createMove(stateBeforeMove, deltaValue, turnIndexBeforeMove);
        // if (!angular.equals(move, expectedMove)) {
        //   throw new Error("Expected move=" + angular.toJson(expectedMove, true) +
        //       ", but got stateTransition=" + angular.toJson(stateTransition, true))
        // }
    }
    gameLogic.checkMoveOk = checkMoveOk;
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map