var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["IDLE"] = 0] = "IDLE";
    GameStatus[GameStatus["AWAITING_NEXT_SEQUENCE_START"] = 1] = "AWAITING_NEXT_SEQUENCE_START";
    GameStatus[GameStatus["PLAYING_SEQUENCE"] = 2] = "PLAYING_SEQUENCE";
    GameStatus[GameStatus["AWAITING_INPUT"] = 3] = "AWAITING_INPUT";
    GameStatus[GameStatus["ENDED"] = 4] = "ENDED";
})(GameStatus || (GameStatus = {}));
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
        return {
            status: GameStatus.IDLE,
            expectedSequence: getInitialSequencePopulated(),
            playerSequence: getInitialSequence(),
            delta: null
        };
    }
    gameLogic.getInitialState = getInitialState;
    function checkSequenceMatchesExpected(currentState) {
        console.log("checking sequence");
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
        console.log("returning new color", newColor);
        return newColor;
    }
    gameLogic.addToExpectedSequence = addToExpectedSequence;
    // if there is newly a loss, return the index of whoever just lost
    function getWinner(currentState, turnIndexOfMove) {
        console.log("checking winner");
        console.log(currentState);
        if (!checkSequenceMatchesExpected(currentState)) {
            console.log("there is a winner");
            console.log("this is the loser", turnIndexOfMove);
            return 1 - turnIndexOfMove;
        }
        console.log("no winner");
        return -1; // no winner
    }
    gameLogic.getWinner = getWinner;
    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove adds a move to their sequence.
     */
    function createMove(stateBeforeMove, color, turnIndexBeforeMove) {
        if (!stateBeforeMove) {
            stateBeforeMove = getInitialState();
        }
        log.info("state passed into createMove");
        log.info(stateBeforeMove);
        var nextStatus = GameStatus.AWAITING_INPUT;
        var sequence1 = stateBeforeMove.expectedSequence;
        var sequence2 = stateBeforeMove.playerSequence;
        var sequence1AfterMove = angular.copy(sequence1);
        var sequence2AfterMove = angular.copy(sequence2);
        stateBeforeMove.playerSequence.push(color);
        sequence2AfterMove.push(color);
        var winner = getWinner(stateBeforeMove, turnIndexBeforeMove);
        var endMatchScores;
        var turnIndexAfterMove;
        if (winner >= 0) {
            // Game over.
            nextStatus = GameStatus.ENDED;
            turnIndexAfterMove = -1;
            endMatchScores = winner === 0 ? [1, 0] : winner === 1 ? [0, 1] : [0, 0];
        }
        else {
            // Game continues. Now it"s the opponent"s turn (the turn switches from 0 to 1 and 1 to 0).
            // clear the player"s sequence so we can start the pattern over
            // but only if the player has submitted enough colors to make a full sequence
            if (sequence1AfterMove.length === sequence2AfterMove.length) {
                log.info("submitted a full pattern, clearing");
                sequence2AfterMove = [];
                // add a new color for the next round
                var newColor = addToExpectedSequence(stateBeforeMove);
                console.log("next color in sequence", newColor);
                sequence1AfterMove.push(newColor);
                // switch players, but only once a full turn is completed
                turnIndexAfterMove = 1 - turnIndexBeforeMove;
                nextStatus = GameStatus.AWAITING_NEXT_SEQUENCE_START;
            }
            else {
                // keep the same player until a sequence has been completed
                turnIndexAfterMove = turnIndexBeforeMove;
            }
            endMatchScores = null;
        }
        var delta = color;
        var stateAfterMove = {
            status: nextStatus,
            delta: delta,
            playerSequence: sequence2AfterMove,
            expectedSequence: sequence1AfterMove
        };
        return { endMatchScores: endMatchScores, turnIndexAfterMove: turnIndexAfterMove, stateAfterMove: stateAfterMove };
    }
    gameLogic.createMove = createMove;
    function createInitialMove() {
        return {
            endMatchScores: null, turnIndexAfterMove: 0,
            stateAfterMove: getInitialState()
        };
    }
    gameLogic.createInitialMove = createInitialMove;
    function checkMoveOk(stateTransition) {
        // There are no "invalid moves" in Simon, therefore this is a nop.
    }
    gameLogic.checkMoveOk = checkMoveOk;
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map