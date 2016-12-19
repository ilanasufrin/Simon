;
var game;
(function (game) {
    game.state = null;
    var currentUpdateUI = null;
    var didMakeMove = false; // You can only make one move per updateUI
    var animationEndedTimeout = null;
    function init() {
        var isLocal = ["localhost", "127.0.0.1", "0.0.0.0"].indexOf($location.host()) >= 0;
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
            checkMoveOk: gameLogic.checkMoveOk,
            updateUI: updateUI,
            communityUI: function (_) { },
            getStateForOgImage: null
        });
        game.state = gameLogic.getInitialState();
        postMessage({ gameReady: true }, "*");
    }
    game.init = init;
    function isOver() {
        return game.state.status === GameStatus.ENDED;
    }
    game.isOver = isOver;
    function showGameOverMsg() {
        return translate("GAME_OVER", {});
    }
    game.showGameOverMsg = showGameOverMsg;
    function showPlayerIndicators() {
        return currentUpdateUI && currentUpdateUI.playMode === "passAndPlay";
    }
    game.showPlayerIndicators = showPlayerIndicators;
    function getPlayerIndices() {
        if (!currentUpdateUI)
            return [];
        return currentUpdateUI.playersInfo.map(function (_, i) { return i; });
    }
    game.getPlayerIndices = getPlayerIndices;
    function shouldHighlightPlayer(playerIndex) {
        if (!currentUpdateUI)
            return false;
        return currentUpdateUI.yourPlayerIndex === playerIndex;
    }
    game.shouldHighlightPlayer = shouldHighlightPlayer;
    function registerServiceWorker() {
        if ("serviceWorker" in navigator) {
            var n = navigator;
            log.log("Calling serviceWorker.register");
            n.serviceWorker.register("service-worker.js").then(function (registration) {
                log.log("ServiceWorker registration successful with scope: ", registration.scope);
            }).catch(function (err) {
                log.log("ServiceWorker registration failed: ", err);
            });
        }
    }
    function getTranslations() {
        return {
            GAME_OVER: {
                en: "Game Over!",
            }
        };
    }
    function getBtnClasses(currentStatus) {
        var classes = ["play-btn__icon", "fa"];
        var faClass = ((_a = {},
            _a[GameStatus.IDLE] = "fa-play",
            _a[GameStatus.AWAITING_NEXT_SEQUENCE_START] = "fa-play",
            _a[GameStatus.PLAYING_SEQUENCE] = "fa-play",
            _a[GameStatus.AWAITING_INPUT] = "fa-spinner",
            _a[GameStatus.ENDED] = "fa-repeat",
            _a
        ))[currentStatus];
        classes.push(faClass);
        if (currentStatus === GameStatus.AWAITING_INPUT) {
            classes.push("spin");
        }
        return classes;
        var _a;
    }
    game.getBtnClasses = getBtnClasses;
    function isButtonDisabled() {
        switch (game.state.status) {
            case GameStatus.AWAITING_INPUT:
            case GameStatus.PLAYING_SEQUENCE:
                return true;
            default:
                return false;
        }
    }
    game.isButtonDisabled = isButtonDisabled;
    function arePadsDisabled() {
        return game.state.status !== GameStatus.AWAITING_INPUT;
    }
    game.arePadsDisabled = arePadsDisabled;
    function handleBtnClick() {
        animateSequence(game.state, true);
    }
    game.handleBtnClick = handleBtnClick;
    function updateUI(updates) {
        didMakeMove = false; // Only one move per updateUI
        currentUpdateUI = updates;
        clearAnimationTimeout();
        if (isFirstMove()) {
            game.state = gameLogic.getInitialState();
            if (isMyTurn())
                makeMove(gameLogic.createInitialMove());
        }
        else {
            game.state = updates.move.stateAfterMove;
        }
    }
    game.updateUI = updateUI;
    function animateSequence(state, human) {
        state.status = GameStatus.PLAYING_SEQUENCE;
        var playBtn = document.querySelector(".play-btn");
        var animationIntervalId = 0;
        var i = 0;
        var animate;
        var sequenceFinished = function () { return i === state.expectedSequence.length; };
        if (human) {
            animate = function () {
                if (sequenceFinished()) {
                    endAnimation(animationIntervalId);
                }
                else {
                    pickElement(state.expectedSequence[i], true);
                    i++;
                }
            };
        }
        else {
            animate = function () {
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
    game.animateSequence = animateSequence;
    function endAnimation(animationIntervalId) {
        clearInterval(animationIntervalId);
        $rootScope.$apply(function () {
            if (gameLogic.getWinner(game.state, 1) >= 0) {
                // TODO: Refactor the ending logic into the ng elements
                game.state.status = GameStatus.ENDED;
            }
            else {
                game.state.status = GameStatus.AWAITING_INPUT;
            }
        });
    }
    function pickElement(el, human) {
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
    function playSound(el) {
        var audio = document.getElementById("simonSound" + el);
        if (audio) {
        }
    }
    function handleAnimationTiming(el, human, baseTimeout) {
        if (baseTimeout === void 0) { baseTimeout = 1000; }
        var myEl = angular.element(document.querySelector(el));
        myEl.addClass("highlighted");
        if (!human) {
            // if it"s a computer move, animate the ghost pointers
            // console.debug(el.substring(1) + "Ring");
            // const ring = document.getElementById(el.substring(1) + "Ring");
            myEl.removeClass("animating");
            myEl[0].offsetWidth;
            myEl.addClass("animating");
        }
        setTimeout(function () {
            myEl.addClass("unHighlighted");
            myEl.removeClass("highlighted");
        }, baseTimeout);
        setTimeout(function () {
            myEl.removeClass("unHighlighted");
        }, baseTimeout + (baseTimeout / 2));
    }
    function clearAnimationTimeout() {
        if (animationEndedTimeout) {
            $timeout.cancel(animationEndedTimeout);
            animationEndedTimeout = null;
        }
    }
    function makeMove(move) {
        // debugger;
        console.log("trying to make a move", move);
        if (didMakeMove) {
            return;
        }
        didMakeMove = true;
        // HACK
        if (!move || !currentUpdateUI.move) {
            var num = Math.floor(Math.random() * 4);
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
        return !didMakeMove &&
            currentUpdateUI.move.turnIndexAfterMove >= 0 &&
            currentUpdateUI.yourPlayerIndex === currentUpdateUI.move.turnIndexAfterMove; // it`s my turn
    }
    function cellClicked(color) {
        log.info("Clicked on color:", color);
        if (!isHumanTurn())
            return;
        if (window.location.search === "?throwException") {
            throw new Error("Throwing the error because URL has \"?throwException\"");
        }
        var nextMove = null;
        try {
            log.info("state on click", game.state);
            nextMove = gameLogic.createMove(game.state, color, currentUpdateUI);
        }
        catch (e) {
            log.info(["there was a problem choosing the color:", color]);
            return;
        }
        // Move is legal, make it!
        log.info("move was legal");
        makeMove(nextMove);
        playSound(color);
        if (!matchMedia("(min-width: 600px)").matches) {
            handleAnimationTiming([".green", ".red", ".yellow", ".blue"][color], true, /* basetimeout */ 400);
        }
    }
    game.cellClicked = cellClicked;
})(game || (game = {}));
angular.module("myApp", ["gameServices"])
    .run(function () {
    $rootScope["game"] = game;
    game.init();
});
//# sourceMappingURL=game.js.map