namespace aiService {
  export function chooseFromPossibleMoves(state: IState, currentUpdateUI: IUpdateUI): IMove {
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
    move = gameLogic.createMove(state, num, currentUpdateUI);
    return move;
  }
}
