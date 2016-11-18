describe("aiService", function() {
  describe("chooseFromPossibleMoves", function() {
    let state: IState;
    let turnIndexBeforeMove: number;
    let delta: number = 3;

    it("returns a valid move", function() {
      state = {
        expectedSequence: [3, 0],
        playerSequence: [],
        delta: delta
      };

      turnIndexBeforeMove = 0;

      let choice = aiService.chooseFromPossibleMoves(state, turnIndexBeforeMove);

      expect(choice.endMatchScores).toBeDefined();
      expect(choice.turnIndexAfterMove).toEqual(jasmine.any(Number));
      expect(choice.stateAfterMove).toBeDefined();
      expect(choice.stateAfterMove.delta).toEqual(jasmine.any(Number));
      expect(choice.stateAfterMove.playerSequence).toBeDefined();
      expect(choice.stateAfterMove.expectedSequence).toBeDefined();
    });
  });

  describe("createComputerMove", function() {
    let move: IMove;
    let delta = 3;

    it("returns a valid move", function() {
      move = {
        endMatchScores: [0, 1],
        turnIndexAfterMove: 1,
        stateAfterMove: {
          expectedSequence: [3, 0],
          playerSequence: [],
          delta: delta
        }
      };

      let compMove = aiService.createComputerMove(move);
      expect(move).toEqual(
        {
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

  describe("findComputerMove", function() {
    let move: IMove;
    let delta: number = 3;

    it("returns the move that the computer player should do for the given state in the passed-in move.", function() {
      move = {
        endMatchScores: [0, 1],
        turnIndexAfterMove: 1,
        stateAfterMove: {
          expectedSequence: [3, 0],
          playerSequence: [],
          delta: delta
        }
      };

      let compMove = aiService.findComputerMove(move);
      expect(move).toEqual(
        {
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
});
