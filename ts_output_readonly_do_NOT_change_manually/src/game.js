// interface SupportedLanguages {
//   en: string, iw: string,
//   pt: string, zh: string,
//   el: string, fr: string,
//   hi: string, es: string,
// };
;
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
    game.shouldBeDisabled = true;
    function init() {
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
    function getTranslations() {
        return {};
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
                switchOutPlayButton();
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
                        switchOutPlayButton();
                    }
                    else {
                        console.debug('no winner in ANIMATE');
                        enableButtons();
                    }
                    if (typeof shouldPlayComputer !== "undefined") {
                        console.debug('in the callback');
                        setTimeout(function () {
                            animateSequence(state, false, undefined);
                        }, 1000);
                    }
                }
                else {
                    console.log('EXPECTED SEQUENCE is ' + (state.expectedSequence[i]));
                    pickElement(state.expectedSequence[i], true);
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
                        switchOutPlayButton();
                    }
                    else {
                        console.debug('no winner in ANIMATE');
                        enableButtons();
                    }
                }
                else {
                    if (state.playerSequence[i] === null) {
                        console.log('this is the mess up');
                        return;
                    }
                    console.log('computer SEQUENCE is ' + (state.playerSequence[i]));
                    pickElement(state.playerSequence[i], false);
                    i++;
                }
            };
        }
        animationIntervalId = setInterval(animate, 2000);
        animate();
    }
    game.animateSequence = animateSequence;
    function switchOutPlayButton() {
        var playBtn = angular.element(document.querySelector('.play-btn__icon'));
        if (playBtn) {
            console.debug('switching out play button');
            playBtn.removeClass('play-btn__icon');
            playBtn.removeClass('fa-play');
            playBtn.addClass('fa-times');
            playBtn.addClass('disabledX');
        }
        $rootScope.$apply();
    }
    function disableButtons() {
        var playBtn = document.querySelector('.play-btn');
        if (playBtn) {
            playBtn.disabled = true;
            game.shouldBeDisabled = true;
            var myEl = angular.element(document.querySelector('.canvas'));
            myEl.addClass('noPointer');
            $rootScope.$apply(); //repaint the page
        }
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
    function pickElement(el, human) {
        playSound(el);
        switch (el) {
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
    function playSound(el) {
        var audio = document.getElementById('simonSound' + el);
        if (audio) {
            audio.play();
        }
    }
    function handleAnimationTiming(el, human) {
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
        //HACK
        if (!move || !game.currentUpdateUI.move) {
            var num = Math.floor(Math.random() * 4);
            move.stateAfterMove.delta = num;
            move.stateAfterMove.playerSequence.push(num);
        }
        //end hack
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
        playSound(color);
    }
    game.cellClicked = cellClicked;
})(game || (game = {}));
angular.module('myApp', ['gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    game.init();
});
//# sourceMappingURL=game.js.map