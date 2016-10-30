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
    game.shouldBeDisabled = false;
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
            animateSequence: animateSequence
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
            if (params.move.turnIndexAfterMove === -1) {
                console.debug('we know the game has been lost');
                //the game has been lost so all buttons should be disabled
                disableButtons();
            }
        }
        //if the game is over, disable the buttons for good
        console.debug('params ', params);
    }
    game.updateUI = updateUI;
    function animateSequence(state, human, shouldPlayComputer) {
        var playBtn = document.querySelector('.play-btn');
        var animationIntervalId = 0;
        disableButtons();
        var i = 0;
        var animate;
        if (human) {
            animate = function () {
                if (i === state.expectedSequence.length) {
                    clearInterval(animationIntervalId);
                    if (gameLogic.getWinner(state, 1) === 0 || gameLogic.getWinner(state, 1) === 1) {
                        console.debug('winner in ANIMATE');
                        disableButtons();
                    }
                    else {
                        console.debug('no winner in ANIMATE');
                        enableButtons();
                    }
                    if (typeof shouldPlayComputer !== "undefined") {
                        console.debug('in the callback');
                        setTimeout(function () {
                            animateSequence(state, false, undefined);
                        }, 3000);
                    }
                }
                else {
                    console.log('EXPECTED SEQUENCE is ' + (state.expectedSequence[i]));
                    pickElement(state.expectedSequence[i]);
                    i++;
                }
            };
        }
        else {
            animate = function () {
                if (i === state.playerSequence.length) {
                    clearInterval(animationIntervalId);
                    if (gameLogic.getWinner(state, 1) === 0 || gameLogic.getWinner(state, 1) === 1) {
                        console.debug('winner in ANIMATE');
                        disableButtons();
                    }
                    else {
                        console.debug('no winner in ANIMATE');
                        enableButtons();
                    }
                }
                else {
                    console.log('computer SEQUENCE is ' + (state.playerSequence[i]));
                    pickElement(state.playerSequence[i]);
                    i++;
                }
            };
        }
        animationIntervalId = setInterval(animate, 2000);
        animate();
    }
    game.animateSequence = animateSequence;
    function disableButtons() {
        var playBtn = document.querySelector('.play-btn');
        playBtn.disabled = true;
        game.shouldBeDisabled = true;
        var myEl = angular.element(document.querySelector('.canvas'));
        myEl.addClass('noPointer');
        $rootScope.$apply(); //repaint the page
    }
    game.disableButtons = disableButtons;
    function enableButtons() {
        var playBtn = document.querySelector('.play-btn');
        playBtn.disabled = false;
        game.shouldBeDisabled = false;
        var myEl = angular.element(document.querySelector('.canvas'));
        myEl.removeClass('noPointer');
        $rootScope.$apply(); //repaint the page
    }
    game.enableButtons = enableButtons;
    function pickElement(el) {
        switch (el) {
            case 0:
                handleAnimationTiming('.green');
                break;
            case 1:
                handleAnimationTiming('.red');
                break;
            case 2:
                handleAnimationTiming('.yellow');
                break;
            case 3:
                handleAnimationTiming('.blue');
                break;
            default:
                console.error('unrecognized element ', el);
        }
    }
    function handleAnimationTiming(el) {
        var myEl = angular.element(document.querySelector(el));
        myEl.addClass('highlighted');
        var ring = document.getElementById(el.substring(1) + 'Ring');
        ring.classList.remove('animating');
        ring.offsetWidth;
        ring.classList.add('animating');
        setTimeout(function () {
            myEl.addClass('unHighlighted');
            myEl.removeClass('highlighted');
        }, 1000);
        setTimeout(function () {
            myEl.removeClass('unHighlighted');
        }, 1500);
    }
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
        console.debug('currentUpdateUI.move', game.currentUpdateUI.move);
        var move = aiService.findComputerMove(game.currentUpdateUI.move);
        log.info("Computer move: ", move);
        animateSequence(game.state, true, true);
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