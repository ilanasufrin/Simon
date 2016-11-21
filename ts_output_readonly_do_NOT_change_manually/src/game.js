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
        moveService.setGame({
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            checkMoveOk: gameLogic.checkMoveOk,
            updateUI: updateUI,
            gotMessageFromPlatform: null
        });
        game.state = gameLogic.getInitialState();
    }
    game.init = init;
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
        return {};
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
            case GameStatus.ENDED:
                return true;
            default:
                return false;
        }
    }
    game.isButtonDisabled = isButtonDisabled;
    function isCanvasDisabled() {
        switch (game.state.status) {
            case GameStatus.PLAYING_SEQUENCE:
            case GameStatus.ENDED:
                return true;
            default:
                return false;
        }
    }
    game.isCanvasDisabled = isCanvasDisabled;
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
            // We calculate the AI move only after the animation finishes,
            // because if we call aiService now
            // then the animation will be paused until the javascript finishes.
            animationEndedTimeout = $timeout(animationEndedCallback, 500);
        }
    }
    game.updateUI = updateUI;
    function animateSequence(state, human, shouldPlayComputer) {
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
                    if (typeof shouldPlayComputer !== "undefined") {
                        setTimeout(function () {
                            animateSequence(state, false, undefined);
                        }, 1000);
                    }
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
        // ??? TODO ask Ilana about this
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
            audio.play();
        }
    }
    function handleAnimationTiming(el, human) {
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
        }, 1000);
        setTimeout(function () {
            myEl.removeClass("unHighlighted");
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
        if (!isComputerTurn())
            return;
        console.debug("currentUpdateUI.move", currentUpdateUI.move);
        var move = aiService.findComputerMove(currentUpdateUI.move);
        log.info("Computer move: ", move);
        animateSequence(game.state, true, true);
        makeMove(move);
    }
    function makeMove(move) {
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
            nextMove = gameLogic.createMove(game.state, color, currentUpdateUI.move.turnIndexAfterMove);
        }
        catch (e) {
            log.info(["there was a problem choosing the color:", color]);
            return;
        }
        // Move is legal, make it!
        log.info("move was legal");
        makeMove(nextMove);
        playSound(color);
    }
    game.cellClicked = cellClicked;
})(game || (game = {}));
angular.module("myApp", ["gameServices"])
    .run(function () {
    $rootScope["game"] = game;
    game.init();
});
//# sourceMappingURL=game.js.map