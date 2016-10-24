// interface SupportedLanguages {
//   en: string, iw: string,
//   pt: string, zh: string,
//   el: string, fr: string,
//   hi: string, es: string,
// };
// interface Translations {
//   [index: string]: SupportedLanguages;
// }
// module game {
//   // Global variables are cleared when getting updateUI.
//   // I export all variables to make it easy to debug in the browser by
//   // simply typing in the console, e.g.,
//   // game.currentUpdateUI
//   export let currentUpdateUI: IUpdateUI = null;
//   export let didMakeMove: boolean = false; // You can only make one move per updateUI
//   export let animationEndedTimeout: ng.IPromise<any> = null;
//   export let state: IState = null;
//   export function init() {
//     registerServiceWorker();
//     translate.setTranslations(getTranslations());
//     translate.setLanguage('en');
//     resizeGameAreaService.setWidthToHeight(1);
//     moveService.setGame({
//       minNumberOfPlayers: 2,
//       maxNumberOfPlayers: 2,
//       checkMoveOk: gameLogic.checkMoveOk,
//       updateUI: updateUI,
//       gotMessageFromPlatform: null,
//     });
//   }
//   function registerServiceWorker() {
//     if ('serviceWorker' in navigator) {
//       let n: any = navigator;
//       log.log('Calling serviceWorker.register');
//       n.serviceWorker.register('service-worker.js').then(function(registration: any) {
//         log.log('ServiceWorker registration successful with scope: ',    registration.scope);
//       }).catch(function(err: any) {
//         log.log('ServiceWorker registration failed: ', err);
//       });
//     }
//   }
//   function getTranslations(): Translations {
//     return {};
//   }
//   export function updateUI(params: IUpdateUI): void {
//     log.info("Game got updateUI ILANA:", params);
//     didMakeMove = false; // Only one move per updateUI
//     currentUpdateUI = params;
//     clearAnimationTimeout();
//     state = params.move.stateAfterMove;
//     if (isFirstMove()) {
//       state = gameLogic.getInitialState();
//       if (isMyTurn()) makeMove(gameLogic.createInitialMove());
//     } else {
//       // We calculate the AI move only after the animation finishes,
//       // because if we call aiService now
//       // then the animation will be paused until the javascript finishes.
//       animationEndedTimeout = $timeout(animationEndedCallback, 500);
//     }
//   }
//   function animationEndedCallback() {
//     log.info("Animation ended");
//     maybeSendComputerMove();
//   }
//   function clearAnimationTimeout() {
//     if (animationEndedTimeout) {
//       $timeout.cancel(animationEndedTimeout);
//       animationEndedTimeout = null;
//     }
//   }
//   function maybeSendComputerMove() {
//     if (!isComputerTurn()) return;
//     let move = aiService.findComputerMove(currentUpdateUI.move);
//     log.info("Computer move: ", move);
//     makeMove(move);
//   }
//   function makeMove(move: IMove) {
//     if (didMakeMove) { // Only one move per updateUI
//       return;
//     }
//     didMakeMove = true;
//     moveService.makeMove(move);
//   }
//   function isFirstMove() {
//     return !currentUpdateUI.move.stateAfterMove;
//   }
//   function yourPlayerIndex() {
//     return currentUpdateUI.yourPlayerIndex;
//   }
//   function isComputer() {
//     return currentUpdateUI.playersInfo[currentUpdateUI.yourPlayerIndex].playerId === '';
//   }
//   function isComputerTurn() {
//     return isMyTurn() && isComputer();
//   }
//   function isHumanTurn() {
//     return isMyTurn() && !isComputer();
//   }
//   function isMyTurn() {
//     return !didMakeMove && // you can only make one move per updateUI.
//       currentUpdateUI.move.turnIndexAfterMove >= 0 && // game is ongoing
//       currentUpdateUI.yourPlayerIndex === currentUpdateUI.move.turnIndexAfterMove; // it's my turn
//   }
//   export function cellClicked(row: number, col: number): void {
//     log.info("Clicked on cell:", row, col);
//     if (!isHumanTurn()) return;
//     if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
//       throw new Error("Throwing the error because URL has '?throwException'");
//     }
//     let nextMove: IMove = null;
//     try {
//       nextMove = gameLogic.createMove(
//           state, row, col, currentUpdateUI.move.turnIndexAfterMove);
//     } catch (e) {
//       log.info(["Cell is already full in position:", row, col]);
//       return;
//     }
//     // Move is legal, make it!
//     makeMove(nextMove);
//   }
//   export function shouldShowImage(row: number, col: number): boolean {
//     let cell = state.board[row][col];
//     return cell !== "";
//   }
//   export function isPieceX(row: number, col: number): boolean {
//     return state.board[row][col] === 'X';
//   }
//   export function isPieceO(row: number, col: number): boolean {
//     return state.board[row][col] === 'O';
//   }
//   export function shouldSlowlyAppear(row: number, col: number): boolean {
//     return state.delta &&
//         state.delta.row === row && state.delta.col === col;
//   }
// }
// angular.module('myApp', ['gameServices'])
//   .run(function () {
//     $rootScope['game'] = game;
//     game.init();
//   });
var game;
(function (game) {
    // Global variables are cleared when getting updateUI.
    // I export all variables to make it easy to debug in the browser by
    // simply typing in the console, e.g.,
    // game.currentUpdateUI
    game.currentUpdateUI = null;
    game.didMakeMove = false; // You can only make one move per updateUI
    game.animationEndedTimeout = null;
    game.state = null;
    function init() {
        registerServiceWorker();
        // translate.setTranslations(getTranslations());
        // translate.setLanguage('en');
        resizeGameAreaService.setWidthToHeight(1);
        moveService.setGame({
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            checkMoveOk: gameLogic.checkMoveOk,
            updateUI: updateUI,
            gotMessageFromPlatform: null,
        });
    }
    game.init = init;
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            var n = navigator;
            log.log('Calling serviceWorker.register');
            n.serviceWorker.register('service-worker.js').then(function (registration) {
                log.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(function (err) {
                log.log('ServiceWorker registration failed: ', err);
            });
        }
    }
    function updateUI(params) {
        log.info("Game got updateUI ILANA:", params);
        game.didMakeMove = false; // Only one move per updateUI
        game.currentUpdateUI = params;
        clearAnimationTimeout();
        game.state = params.move.stateAfterMove;
        if (isFirstMove()) {
            game.state = gameLogic.getInitialState();
            if (isMyTurn())
                makeMove(gameLogic.createInitialMove());
        }
        else {
            // We calculate the AI move only after the animation finishes,
            // because if we call aiService now
            // then the animation will be paused until the javascript finishes.
            game.animationEndedTimeout = $timeout(animationEndedCallback, 500);
        }
    }
    game.updateUI = updateUI;
    function animationEndedCallback() {
        log.info("Animation ended");
        maybeSendComputerMove();
    }
    function clearAnimationTimeout() {
        if (game.animationEndedTimeout) {
            $timeout.cancel(game.animationEndedTimeout);
            game.animationEndedTimeout = null;
        }
    }
    function maybeSendComputerMove() {
        if (!isComputerTurn())
            return;
        var move = aiService.findComputerMove(game.currentUpdateUI.move);
        log.info("Computer move: ", move);
        makeMove(move);
    }
    function makeMove(move) {
        console.log('trying to make a move', move);
        if (game.didMakeMove) {
            return;
        }
        game.didMakeMove = true;
        moveService.makeMove(move);
    }
    function isFirstMove() {
        return !game.currentUpdateUI.move.stateAfterMove;
    }
    function yourPlayerIndex() {
        return game.currentUpdateUI.yourPlayerIndex;
    }
    function isComputer() {
        return game.currentUpdateUI.playersInfo[game.currentUpdateUI.yourPlayerIndex].playerId === '';
    }
    function isComputerTurn() {
        return isMyTurn() && isComputer();
    }
    function isHumanTurn() {
        return isMyTurn() && !isComputer();
    }
    function isMyTurn() {
        return !game.didMakeMove &&
            game.currentUpdateUI.move.turnIndexAfterMove >= 0 &&
            game.currentUpdateUI.yourPlayerIndex === game.currentUpdateUI.move.turnIndexAfterMove; // it's my turn
    }
    function cellClicked(color) {
        log.info("Clicked on color:", color);
        if (!isHumanTurn())
            return;
        if (window.location.search === '?throwException') {
            throw new Error("Throwing the error because URL has '?throwException'");
        }
        var nextMove = null;
        try {
            log.info('state on click', game.state);
            nextMove = gameLogic.createMove(game.state, color, game.currentUpdateUI.move.turnIndexAfterMove);
        }
        catch (e) {
            log.info(["there was a problem choosing the color:", color]);
            return;
        }
        // Move is legal, make it!
        log.info('move was legal');
        makeMove(nextMove);
    }
    game.cellClicked = cellClicked;
})(game || (game = {}));
angular.module('myApp', ['gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    game.init();
});
//# sourceMappingURL=game.js.map