interface SupportedLanguages {
  en: string;
};

interface Translations {
  [index: string]: SupportedLanguages;
}


namespace game {
  export let state: IState = null;

  let currentUpdateUI: IUpdateUI = null;
  let didMakeMove: boolean = false; // You can only make one move per updateUI
  let animationEndedTimeout: ng.IPromise<any> = null;

  export function init() {
    const isLocal = ["localhost", "127.0.0.1", "0.0.0.0"].indexOf($location.host()) >= 0;
    if (!isLocal) {
      registerServiceWorker();
    }
    translate.setTranslations(getTranslations());
    translate.setLanguage("en");
    // log.log("Translation of "GAME_OVER" is " + translate("GAME_OVER"));
    resizeGameAreaService.setWidthToHeight(1);
    // Note that for playAgainstTheComputer mode the number of players is always set to 1.
    moveService.setGame({
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      checkMoveOk: gameLogic.checkMoveOk, // this is only here because the turnBasedService complains otherwise
      updateUI: updateUI,
      communityUI: (_: ICommunityUI) => {},
      getStateForOgImage: null
    });
    state = gameLogic.getInitialState();
    postMessage({gameReady: true}, "*");
  }

  export function isOver(): boolean {
    return game.state.status === GameStatus.ENDED;
  }

  export function showGameOverMsg(): string {
    return translate("GAME_OVER", {});
  }

  export function showPlayerIndicators() {
    return currentUpdateUI && currentUpdateUI.playMode === "passAndPlay";
  }

  export function getPlayerIndices(): number[] {
    if (!currentUpdateUI) return [];
    return currentUpdateUI.playersInfo.map((_, i) => i);
  }

  export function shouldHighlightPlayer(playerIndex: number): boolean {
    if (!currentUpdateUI) return false;
    return currentUpdateUI.yourPlayerIndex === playerIndex;
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      let n: any = navigator;
      log.log("Calling serviceWorker.register");
      n.serviceWorker.register("service-worker.js").then(function(registration: any) {
        log.log("ServiceWorker registration successful with scope: ", registration.scope);
      }).catch(function(err: any) {
        log.log("ServiceWorker registration failed: ", err);
      });
    }
  }

  function getTranslations(): Translations {
    return {
      GAME_OVER: {
          en: "Game Over!",
      }
    };
  }

  export function getBtnClasses(currentStatus: GameStatus) {
    const classes = ["play-btn__icon", "fa"];
    const faClass = ({
      [GameStatus.IDLE]: "fa-play",
      [GameStatus.AWAITING_NEXT_SEQUENCE_START]: "fa-play",
      [GameStatus.PLAYING_SEQUENCE]: "fa-play",
      [GameStatus.AWAITING_INPUT]: "fa-spinner",
      [GameStatus.ENDED]: "fa-repeat"
    })[currentStatus];
    classes.push(faClass);
    if (currentStatus === GameStatus.AWAITING_INPUT) {
      classes.push("spin");
    }
    return classes;
  }

  export function isButtonDisabled(): boolean {
    switch (state.status) {
      case GameStatus.AWAITING_INPUT:
      case GameStatus.PLAYING_SEQUENCE:
        return true;
      default:
        return false;
    }
  }

  export function arePadsDisabled(): boolean {
    return state.status !== GameStatus.AWAITING_INPUT;
  }

  export function handleBtnClick() {
    animateSequence(state, true);
  }

  export function updateUI(updates: IUpdateUI): void {
    didMakeMove = false; // Only one move per updateUI
    currentUpdateUI = updates;
    clearAnimationTimeout();
    if (isFirstMove()) {
      state = gameLogic.getInitialState();
      if (isMyTurn()) makeMove(gameLogic.createInitialMove());
    } else {
      state = updates.move.stateAfterMove;
    }
  }

  export function animateSequence(state: IState, human: boolean) {
    state.status = GameStatus.PLAYING_SEQUENCE;
    let playBtn = document.querySelector(".play-btn");
    let animationIntervalId = 0;
    let i = 0;
    let animate: () => void;

    const sequenceFinished = () => i === state.expectedSequence.length;

    if (human) {
      animate = function() {
        if (sequenceFinished()) {
          endAnimation(animationIntervalId);
        } else {
          pickElement(state.expectedSequence[i], true);
          i++;
        }
      };
    } else { // we"re playing the computer
      animate = function() {
        if (sequenceFinished()) {
          endAnimation(animationIntervalId);
        }
        else {
          if (state.playerSequence[i] === null) {
            return;
          }
          pickElement(state.playerSequence[i], false);
          i++;
        }
      };
    }

    animationIntervalId = setInterval(animate, 2000);
    animate();
  }

  function endAnimation(animationIntervalId: number) {
    clearInterval(animationIntervalId);

    $rootScope.$apply(() => {
      if (gameLogic.getWinner(state, 1) >= 0) {
        // TODO: Refactor the ending logic into the ng elements
        state.status = GameStatus.ENDED;
      } else {
        state.status = GameStatus.AWAITING_INPUT;
      }
    });
  }

  function pickElement(el: number, human: boolean) {
    playSound(el);
    switch (el) {
      case 0:
        handleAnimationTiming(".green", human);
        break;
      case 1:
        handleAnimationTiming(".red", human);
        break;
      case 2:
        handleAnimationTiming(".yellow", human);
        break;
      case 3:
        handleAnimationTiming(".blue", human);
        break;
      default:
        console.error("unrecognized element ", el);
    }
  }

  function playSound(el: number) {
    let audio = <HTMLAudioElement>document.getElementById("simonSound" + el);
    if (audio) {
      audio.play();
    }
  }

  function handleAnimationTiming(el: string, human: boolean, baseTimeout: number = 1000) {
    const myEl = angular.element(document.querySelector(el));
    myEl.addClass("highlighted");

    if (!human) {
      // if it"s a computer move, animate the ghost pointers
      // console.debug(el.substring(1) + "Ring");
      // const ring = document.getElementById(el.substring(1) + "Ring");
      myEl.removeClass("animating");
      myEl[0].offsetWidth;
      myEl.addClass("animating");
    }

    setTimeout(function() {
      myEl.addClass("unHighlighted");
      myEl.removeClass("highlighted");
    }, baseTimeout);
    setTimeout(function() {
      myEl.removeClass("unHighlighted");
    }, baseTimeout + (baseTimeout / 2));
  }

  function clearAnimationTimeout() {
    if (animationEndedTimeout) {
      $timeout.cancel(animationEndedTimeout);
      animationEndedTimeout = null;
    }
  }

  function makeMove(move: IMove) {
    // debugger;
    console.log("trying to make a move", move);
    if (state.playerSequence.length !== state.expectedSequence.length -1 ) {
      return;
    }
    if (didMakeMove) { // Only one move per updateUI
      return;
    }
    didMakeMove = true;
    // HACK
    if (!move || !currentUpdateUI.move) {
      let num = Math.floor(Math.random() * 4);
      move.stateAfterMove.delta = num;
      move.stateAfterMove.playerSequence.push(num);
    }
    // end hack
    moveService.makeMove(move);
  }

  function isFirstMove() {
    return !currentUpdateUI.move.stateAfterMove;
  }

  function yourPlayerIndex() {
    return currentUpdateUI.yourPlayerIndex;
  }

  function isComputer() {
    return currentUpdateUI.playersInfo[currentUpdateUI.yourPlayerIndex].playerId === "";
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
      currentUpdateUI.yourPlayerIndex === currentUpdateUI.move.turnIndexAfterMove; // it`s my turn
  }


  export function cellClicked(color: number): void {
    log.info("Clicked on color:", color);
    let i = 0;
    i++;
    const sequenceFinished = () => i === state.expectedSequence.length;

    if (!isHumanTurn()) return;
    if (window.location.search === "?throwException") { // to test encoding a stack trace with sourcemap
      throw new Error(`Throwing the error because URL has "?throwException"`);
    }
    let nextMove: IMove = null;
    // if (sequenceFinished) {
      try {
        log.info("state on click", state);
        nextMove = gameLogic.createMove(state, color, currentUpdateUI);
      } catch (e) {
        log.info(["there was a problem choosing the color:", color]);
        return;
      }
    // }


    // Move is legal, make it!
    log.info("move was legal");


    // if (sequenceFinished) {
      makeMove(nextMove);
    // }
    playSound(color);
    if (!matchMedia("(min-width: 600px)").matches) {
     handleAnimationTiming([".green", ".red", ".yellow", ".blue"][color], true, /* basetimeout */ 400);
    }
  }

}

angular.module("myApp", ["gameServices"])
  .run(function() {
    $rootScope["game"] = game;
    game.init();
  });
