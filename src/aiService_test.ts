describe("aiService", () => {
  describe("chooseFromPossibleMoves", () => {
    beforeEach(() => {
      spyOn(gameLogic, "createMove").and.callFake((_: any, num: number, __: any) => ({
        num
      }));
    });

    it("chooses a move at random from a list of possible moves using the given state and updateUI", () => {
      spyOn(Math, "random").and.returnValue(0.5);
      const state: any = {
        delta: 100
      };
      const updateUI: any = {};
      const move: any = aiService.chooseFromPossibleMoves(state, updateUI);
      expect(move.num).toEqual(state.delta);
      expect(gameLogic.createMove).toHaveBeenCalledWith(state, state.delta, updateUI);
    });

    it("chooses from 0-3 when given the when given one of the first 4 indices", () => {
      spyOn(Math, "random").and.returnValue(0.125);
      const state: any = {
        delta: 100
      };
      const updateUI: any = {};
      const move: any = aiService.chooseFromPossibleMoves(state, updateUI);
      expect(move.num).toEqual(1);
      expect(gameLogic.createMove).toHaveBeenCalledWith(state, 1, updateUI);
    });

    it("biases towards state.delta", () => {
      spyOn(Math, "random").and.returnValue(0.5);
      const state: any = {
        delta: 100
      };
      const updateUI: any = {};

      const move: any = aiService.chooseFromPossibleMoves(state, updateUI);
      expect(move.num).toEqual(state.delta);
      expect(gameLogic.createMove).toHaveBeenCalledWith(state, state.delta, updateUI);

      (<jasmine.Spy>Math.random).and.returnValue(0.75);
      const move2: any = aiService.chooseFromPossibleMoves(state, updateUI);
      expect(move.num).toEqual(state.delta);
      expect(gameLogic.createMove).toHaveBeenCalledWith(state, state.delta, updateUI);
    });
  });
});
