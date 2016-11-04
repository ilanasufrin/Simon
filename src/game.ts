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

interface SupportedLanguages { en: string, fr: string };

interface Translations {
    [index: string]: SupportedLanguages;
}


module game {
  // Global variables are cleared when getting updateUI.
  // I export all variables to make it easy to debug in the browser by
  // simply typing in the console, e.g.,
  // game.currentUpdateUI
  export let currentUpdateUI: IUpdateUI = null;
  export let didMakeMove: boolean = false; // You can only make one move per updateUI
  export let animationEndedTimeout: ng.IPromise<any> = null;
  export let state: IState = null;
  export let shouldBeDisabled : boolean = true;

  export function init() {
    registerServiceWorker();
    translate.setTranslations(getTranslations());
    translate.setLanguage('en');
   // log.log("Translation of 'GAME_OVER' is " + translate('GAME_OVER'));
    resizeGameAreaService.setWidthToHeight(1);
    moveService.setGame({
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      checkMoveOk: gameLogic.checkMoveOk,
      updateUI: updateUI,
      gotMessageFromPlatform: null,
      animateSequence: animateSequence
    });
     enableButtons();
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      let n: any = navigator;
      log.log('Calling serviceWorker.register');
      n.serviceWorker.register('service-worker.js').then(function(registration: any) {
        log.log('ServiceWorker registration successful with scope: ',    registration.scope);
      }).catch(function(err: any) {
        log.log('ServiceWorker registration failed: ', err);
      });
    }
  }

  function getTranslations(): Translations {
    return {
        // GAME_OVER: {
        //     en: "GAME OVER",
        //     fr: "JEU TERMINÉ",
        // }
    };
  }

  export function updateUI(params: IUpdateUI): void {
    log.info("Game got updateUI ILANA:", params);

    didMakeMove = false; // Only one move per updateUI
    currentUpdateUI = params;
    clearAnimationTimeout();
    state = params.move.stateAfterMove;
    if (isFirstMove()) {
      state = gameLogic.getInitialState();
      if (isMyTurn()) makeMove(gameLogic.createInitialMove());
    } else {
      // We calculate the AI move only after the animation finishes,
      // because if we call aiService now
      // then the animation will be paused until the javascript finishes.
      animationEndedTimeout = $timeout(animationEndedCallback, 500);
      if (params.move.turnIndexAfterMove === -1) {
        console.debug('we know the game has been lost')
        //the game has been lost so all buttons should be disabled
        disableButtons();
        switchOutPlayButton();
      }

    }
    //if the game is over, disable the buttons for good
    console.debug('params ', params);
  }

  export function animateSequence(state: IState, human: boolean, shouldPlayComputer: boolean) {
    let playBtn = document.querySelector('.play-btn');
    let animationIntervalId = 0;
    disableButtons();
    let i = 0;
    let animate: () => void;

    if (human) {
      animate = function() {
      if (i === state.expectedSequence.length) {
          clearInterval(animationIntervalId);
          if (gameLogic.getWinner(state, 1) === 0 || gameLogic.getWinner(state, 1) === 1) {
             console.debug('winner in ANIMATE');
             disableButtons();
             switchOutPlayButton();
           } else {
              console.debug('no winner in ANIMATE');
              enableButtons();
           }
          if (typeof shouldPlayComputer !== "undefined") {
             console.debug('in the callback');
             setTimeout(function() {
               animateSequence(state, false, undefined)
             }, 1000);
          }
      } else {
          console.log('EXPECTED SEQUENCE is ' + (state.expectedSequence[i]) );
          pickElement(state.expectedSequence[i], true);
          i++;
      }
      };
    } else { //we're playing the computer
        animate = function() {
        if (i === state.playerSequence.length) {
            clearInterval(animationIntervalId);

             if (gameLogic.getWinner(state, 1) === 0 || gameLogic.getWinner(state, 1) === 1) {
               console.debug('winner in ANIMATE');
               disableButtons();
               switchOutPlayButton();
             } else {
                console.debug('no winner in ANIMATE');
                enableButtons();
             }
        }
        else {
            console.log('computer SEQUENCE is ' + (state.playerSequence[i]) );
            pickElement(state.playerSequence[i], false);
            i++;
        }
      };
    }

    animationIntervalId = setInterval(animate, 2000);
    animate();
  }

  function switchOutPlayButton() {
    let playBtn = angular.element(document.querySelector('.play-btn__icon'));
    if (playBtn) {
      console.debug('switching out play button');
      playBtn.removeClass('play-btn__icon');
      playBtn.removeClass('fa-play');
      playBtn.addClass('fa-times');
      playBtn.addClass('disabledX');
    }
    $rootScope.$apply();
  }

  export function disableButtons() {
    let playBtn = document.querySelector('.play-btn');
    if (playBtn) {
      playBtn.disabled = true;
      shouldBeDisabled = true;
      let myEl = angular.element(document.querySelector('.canvas'));
      myEl.addClass('noPointer');
      $rootScope.$apply(); //repaint the page
    }
  }

  export function enableButtons() {
    let playBtn = document.querySelector('.play-btn');
    playBtn.disabled = false;
    shouldBeDisabled = false;
    let myEl = angular.element(document.querySelector('.canvas'));
    myEl.removeClass('noPointer');
    $rootScope.$apply(); //repaint the page
  }

  function pickElement(el: number, human: boolean,) {
    playSound(el);
    switch(el) {
      case 0:
       handleAnimationTiming('.green', human);
          break;
      case 1:
          handleAnimationTiming('.red', human);
          break;
      case 2:
          handleAnimationTiming('.yellow', human);
          break;
      case 3:
          handleAnimationTiming('.blue', human);
          break;
      default:
          console.error('unrecognized element ', el);
    }
  }

  function playSound(el: number) {
    let audio = document.getElementById('simonSound' + el);
    audio.play();
  }

  function handleAnimationTiming(el: string, human: boolean,) {
     var myEl = angular.element(document.querySelector(el));
      myEl.addClass('highlighted');

      if (!human) {
        //if it's a computer move, animate the ghost pointers
        // console.debug(el.substring(1) + 'Ring');
        // const ring = document.getElementById(el.substring(1) + 'Ring');
        myEl.removeClass('animating');
        myEl[0].offsetWidth;
        myEl.addClass('animating');
      }

      setTimeout(function(){
        myEl.addClass('unHighlighted');
        myEl.removeClass('highlighted');
      }, 1000);
      setTimeout(function(){
        myEl.removeClass('unHighlighted');
      }, 1500);
  }

  function animationEndedCallback() {
    log.info("Animation ended");
    maybeSendComputerMove();
  }

  function clearAnimationTimeout() {
    if (animationEndedTimeout) {
      $timeout.cancel(animationEndedTimeout);
      animationEndedTimeout = null;
    }
  }

  function maybeSendComputerMove() {
    if (!isComputerTurn()) return;
    console.debug('currentUpdateUI.move', currentUpdateUI.move);
    let move = aiService.findComputerMove(currentUpdateUI.move);
    log.info("Computer move: ", move);
    animateSequence(state, true, true);
    makeMove(move);
  }

  function makeMove(move: IMove) {
    console.log('trying to make a move', move);
    if (didMakeMove) { // Only one move per updateUI
      return;
    }
    didMakeMove = true;
    moveService.makeMove(move);
  }

  function isFirstMove() {
    return !currentUpdateUI.move.stateAfterMove;
  }

  function yourPlayerIndex() {
    return currentUpdateUI.yourPlayerIndex;
  }

  function isComputer() {
    return currentUpdateUI.playersInfo[currentUpdateUI.yourPlayerIndex].playerId === '';
  }

  function isComputerTurn() {
    return isMyTurn() && isComputer();
  }

  function isHumanTurn() {
    return isMyTurn() && !isComputer();
  }

  function isMyTurn() {
    return !didMakeMove && // you can only make one move per updateUI.
      currentUpdateUI.move.turnIndexAfterMove >= 0 && // game is ongoing
      currentUpdateUI.yourPlayerIndex === currentUpdateUI.move.turnIndexAfterMove; // it's my turn
  }


  export function cellClicked(color: number): void {
    log.info("Clicked on color:", color);
    if (!isHumanTurn()) return;
    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
      throw new Error("Throwing the error because URL has '?throwException'");
    }
    let nextMove: IMove = null;
    try {
      log.info('state on click', state);
      nextMove = gameLogic.createMove(
          state, color, currentUpdateUI.move.turnIndexAfterMove);
    } catch (e) {
      log.info(["there was a problem choosing the color:", color]);
      return;
    }
    // Move is legal, make it!
    log.info('move was legal');
    makeMove(nextMove);
    playSound(color);
  }

}

angular.module('myApp', ['gameServices'])
  .run(function () {
    $rootScope['game'] = game;
    game.init();
  });
