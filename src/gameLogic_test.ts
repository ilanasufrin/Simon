describe("Simon gameLogic", () => {
  describe("getInitialState", () => {
    it("returns a properly configured initial state object", () => {
      spyOn(Math, "random").and.returnValue(0.85);
      expect(gameLogic.getInitialState()).toEqual({
        status: GameStatus.IDLE,
        expectedSequence: [3],
        playerSequence: [],
        delta: null
      });
    });
  });

  describe("checkSequenceMatchesExpected", () => {
    it("returns true when playerSequence matches expectedSequence", () => {
      const state: any = {
        playerSequence: [0, 1, 2, 3],
        expectedSequence: [0, 1, 2, 3]
      };
      expect(gameLogic.checkSequenceMatchesExpected(state)).toBe(true);
    });

    it("returns false when playerSequence does not match expectedSequence", () => {
      const state: any = {
        playerSequence: [0, 1, 2, 3],
        expectedSequence: [0, 1, 3, 2]
      };
      expect(gameLogic.checkSequenceMatchesExpected(state)).toBe(false);
    });
  });

  describe("addToExpectedSequence", () => {
    it("adds a random number to the state's expectedSequence", () => {
      const state: any = {
        expectedSequence: [3]
      };
      spyOn(Math, "random").and.returnValue(0.26);
      gameLogic.addToExpectedSequence(state);
      expect(state.expectedSequence).toEqual([3, 1]);
    });
  });

  describe("getWinner", () => {
    it("returns the index of whomevers turn it is not when there is a winner", () => {
      const state: any = {
        expectedSequence: [0, 1, 2, 3],
        playerSequence: [0, 1, 3, 2]
      };
      expect(gameLogic.getWinner(state, 1)).toEqual(0);
      expect(gameLogic.getWinner(state, 0)).toEqual(1);
    });

    it("returns -1 if there is not yet a winner", () => {
      const state: any = {
        expectedSequence: [0, 1, 2, 3],
        playerSequence: [0, 1, 2, 3]
      };
      expect(gameLogic.getWinner(state, 1)).toEqual(-1);
      expect(gameLogic.getWinner(state, 0)).toEqual(-1);
    });
  });

  describe("createMove", () => {
    let stateBeforeMove: any;
    let color: number;
    let currentUpdateUI: any;

    beforeEach(() => {
      color = 0;
      currentUpdateUI = {
        numberOfPlayers: 2,
        move: {
          turnIndexAfterMove: 1
        }
      };
    });

    describe("when there is a winner", () => {
      beforeEach(() => {
        stateBeforeMove = {
          expectedSequence: [0, 1],
          playerSequence: [0]
        };
      });

      it("sets endMatchScores to an array of 0 for every player (shrug)", () => {
        const {endMatchScores} = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI);
        expect(endMatchScores).toEqual([0, 0]);
      });

      it("sets turnIndexAfterMove to -1", () => {
        const {turnIndexAfterMove} = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI);
        expect(turnIndexAfterMove).toEqual(-1);
      });

      it("sets stateAfterMove to reflect the win", () => {
        const {stateAfterMove} = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI);
        expect(stateAfterMove).toEqual({
          status: GameStatus.ENDED,
          delta: color,
          playerSequence: [0, 0],
          expectedSequence: stateBeforeMove.expectedSequence
        });
      });
    });

    describe("when there is no winner", () => {
      beforeEach(() => {
        stateBeforeMove = {
          playerSequence: [],
          expectedSequence: [0, 1]
        };
        spyOn(Math, "random").and.returnValue(0.75);
      });

      it("sets endsMatchScores to null", () => {
        const {endMatchScores} = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI);
        expect(endMatchScores).toBeNull();
      });

      describe("when the playerSequence is the same length as the expectedSequence", () => {
        beforeEach(() => {
          stateBeforeMove.playerSequence.push(0);
          color = 1;
        });

        it("flips the turnIndexAfterMove", () => {
          const {turnIndexAfterMove} = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI);
          expect(turnIndexAfterMove).toEqual(0);
        });

        it("updates the stateAfterMove to reflect the start of a new sequence", () => {
          const {stateAfterMove} = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI);
          expect(stateAfterMove).toEqual({
            status: GameStatus.AWAITING_NEXT_SEQUENCE_START,
            delta: color,
            playerSequence: [],
            expectedSequence: [0, 1, 3]
          });
        });
      });

      describe("when the playerSequence is not the same length as the expectedSequence", () => {
        it("keeps turnIndexAfterMove the same", () => {
          const {turnIndexAfterMove} = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI);
          expect(turnIndexAfterMove).toEqual(1);
        });

        it("updates stateAfterMove to reflect the new addition", () => {
          const {stateAfterMove} = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI);
          expect(stateAfterMove).toEqual({
            expectedSequence: [0, 1],
            playerSequence: [0],
            status: GameStatus.AWAITING_INPUT,
            delta: color
          });
        });
      });
    });

    describe("when no state is given", () => {
      beforeEach(() => {
        spyOn(Math, "random").and.returnValue(0.01);
        stateBeforeMove = null;
      });

      it("uses the initial state as stateBeforeMove", () => {
        const {stateAfterMove} = gameLogic.createMove(stateBeforeMove, color, currentUpdateUI);
        expect(stateAfterMove).toEqual({
          status: GameStatus.AWAITING_NEXT_SEQUENCE_START,
          delta: 0,
          playerSequence: [],
          expectedSequence: [0, 0]
        });
      });
    });
  });

  describe("createInitialMove", () => {
    it("returns the initial move", () => {
      expect(gameLogic.createInitialMove()).toEqual({
        endMatchScores: null,
        turnIndexAfterMove: 0,
        stateAfterMove: gameLogic.getInitialState()
      });
    });
  });

  describe("checkMoveOk", () => {
    it("is a NOP", () => expect(gameLogic.checkMoveOk(<any>{})).toBeUndefined());
  });
});
