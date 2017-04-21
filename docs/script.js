/*jslint browser: true, devel: true*/
/*jshint esversion: 6 */
/*global $, jQuery, alert*/
$(document).ready(function () {
    'use strict';
    var player, computerPlayer, humanPlayer, computer, computerDifficulty, cell, winner,
        cellValues = {}, //1st cell value instance
        cellValuesArray = [0, 1, 2, 3, 4, 5, 6, 7, 8],
        xWins = 0,
        oWins = 0,
        winArray = [];


    // beforegame options

    // play human or computer?

    $('#human').click(function () {
        player = 'X';
        humanPlayer = 'X';
        computerPlayer = 'O';
        console.log(player, humanPlayer, computerPlayer);
        $('#overlay').hide();
        computer = '';
    });
    $('#computer').click(function () {
        computer = 'on';
        $('.pl').hide();
        $('.dif').show();
    });

    // set difficulty

    $('#easy').click(function () {
        $('.dif').hide();
        $('.hc').show();
        computerDifficulty = 'easy';
    });
    $('#medium').click(function () {
        $('.dif').hide();
        $('.hc').show();
        computerDifficulty = 'medium';
    });
    $('#hard').click(function () {
        $('.dif').hide();
        $('.hc').show();
        computerDifficulty = 'hard';
    });

    // human or computer first?

    $('#human-first').click(function () {
        player = 'X';
        humanPlayer = 'X';
        computerPlayer = 'O';
        $('#overlay').hide();
    });

    $('#computer-first').click(function () {
        player = 'X';
        humanPlayer = 'O';
        computerPlayer = 'X';
        $('#overlay').hide();
        if (computerDifficulty === 'easy') {
            computerMove();
        } else if (computerDifficulty === 'hard') {
            minimaxMove();
        }
    });


    // display player icons on hover

    $('.empty').mouseenter(
        function () {
            if (player === 'X') {
                $(this).append($("<span class ='chov x'>&times;</span>"));
            } else if (player === 'O') {
                $(this).append($("<span class ='chov o'>o</span>"));
            }
        }
    );

    $('.empty').mouseleave(
        function () {
            if ($(this).hasClass("empty")) {
                $(this).find('.chov').remove();
            }
        }
    );


    $('.empty').click(
        function () {
            $(this).removeClass("empty");
            $(this).removeClass("pe-on");
            $(this).addClass("pe-off");
            cell = this.id;
            console.log(cell);
            makeMove(cell);
        }
    );

    // light up row on win
    function highlightWin(winArray, winner) {
        for (let i = 0; i < winArray.length; i++) {
            setTimeout(function () {
                $('#' + winArray[i]).addClass('lit');
            }, 300);
        }
    }




    function makeMove(cell) { // populates board with player icon and updates record of available spaces
        var cellValue = player;
        cellValues[cell] = player; // record values of cells already taken
        console.log(cellValues);
        var cellDec = parseInt(cell, 10) - 1;
        cellValuesArray[cellDec] = player;
        checkWin();
        switchPlayers();
        if (computer === 'on' && computerDifficulty === 'easy' && Object.keys(cellValues).length < 9) { //cellvalues
            computerMove();
        } else if (computer === 'on' && computerDifficulty === 'hard' && Object.keys(cellValues).length < 9) {
            minimaxMove();
        }
    }

    // change player turn
    function switchPlayers() {
        if (player === 'X') {
            player = 'O';
        } else {
            player = 'X';
        }
        console.log('player switched to ' + player);
    }

    // increment the score counter
    function updateScore(winner) {
        if (winner === "X") {
            xWins++;
            $('#xWins').html(xWins);
        } else if (winner === "O") {
            oWins++;
            $('#oWins').html(oWins);
        }
    }

    // reset game
    function resetGame() {
        player = 'X';
        cell = '';
        cellValues = {};
        cellValuesArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        winner = undefined;
        computer = '';
        computerDifficulty = '';
        $('.cell').html('');
        $('.cell').addClass('empty');
        $('#overlay').show();
        $('.message').html('');
        $('.afterGame').hide();
        $('.beforeGame').show();
        $('.pl').show();
        $('.st').hide();
        $('.dif').hide();
        $('.pe-off').removeClass("pe-off");
        $('.cell').addClass("pe-on");
        winArray = [];
        $('.lit').removeClass('lit');

    }

    $('#restart').click(
        function () {
            resetGame();
        });


    // new check win function, returns true if there is a winner
    function checkWin() {
        if (cellValues[1] === player && cellValues[2] === player && cellValues[3] === player) {
            winArray = [1, 2, 3];
        } else if (cellValues[4] === player && cellValues[5] === player && cellValues[6] === player) {
            winArray = [4, 5, 6];
        } else if (cellValues[7] === player && cellValues[8] === player && cellValues[9] === player) {
            winArray = [7, 8, 9, ];
        } else if (cellValues[1] === player && cellValues[4] === player && cellValues[7] === player) {
            winArray = [1, 4, 7];
        } else if (cellValues[2] === player && cellValues[5] === player && cellValues[8] === player) {
            winArray = [2, 5, 8];
        } else if (cellValues[3] === player && cellValues[6] === player && cellValues[9] === player) {
            winArray = [3, 6, 9];
        } else if (cellValues[1] === player && cellValues[5] === player && cellValues[9] === player) {
            winArray = [1, 5, 9];
        } else if (cellValues[3] === player && cellValues[5] === player && cellValues[7] === player) {
            winArray = [3, 5, 7];
        }
        if (winArray.length === 3) {
            winner = player;
            $('.pe-on').removeClass("pe-on");
            $('.cell').addClass("pe-off");
            highlightWin(winArray, winner);
            setTimeout(function () {
                $('#overlay').show();
                $('.beforeGame').hide();
                $('.afterGame').show();
                if (winner === "X") {
                    $('.message').html('<span class="win-x">&times;</span> wins!');
                } else if (winner === "O") {
                    $('.message').html('<span class="win-o">o</span> wins!');
                }
                updateScore(winner);
            }, (2000));
        } else if (Object.keys(cellValues).length === 9) {
            $('#overlay').show();
            $('.beforeGame').hide();
            $('.afterGame').show();
            $('.message').html("It's a draw!");
        } else {
            winner = '';
        }
    }

    // computer move: easy
    function computerMove() {
        console.log('computer move easy');
        var retry = '';
        var randomChoice = Math.ceil(Math.random() * 9);
        var choice = parseInt(randomChoice, 10);
        if (retry !== '') {
            choice = retry;
        }
        // check for available spaces recursively
        function placeToken() {
            if (cellValues.hasOwnProperty(choice)) {
                retry = (choice % 9) + 1;
                computerMove();
            } else {
                if (player === 'X') {
                $('#' + choice).append($("<span class ='chov x'>&times;</span>"));
            } else if (player === 'O') {
                $('#' + choice).append($("<span class ='chov o'>o</span>"));
            }
                $('#' + choice).removeClass('empty');
                $('#' + choice).removeClass('pe-on');
                $('#' + choice).addClass('pe-off');
                retry = '';
                cellValues[choice] = player;
                cellValuesArray[choice] = player;
                checkWin(player);
                switchPlayers();
            }
        }
        if (!winner) {
            placeToken();
    }
    }

    // computer move: hard
    function minimaxMove() {
        var result = minimax(cellValuesArray, computerPlayer).index;
            console.log('result = ' + result);
            console.log(cellValues);
            console.log(cellValuesArray);
            cellValuesArray[result] = computerPlayer;
            var result1 = result + 1;
            cellValues[result1] = computerPlayer;
            if (player === 'X') {
                $('#' + result1).append($("<span class ='chov x'>&times;</span>"));
            } else if (player === 'O') {
                $('#' + result1).append($("<span class ='chov o'>o</span>"));
            }
                $('#' + result1).removeClass('empty');
                $('#' + result1).removeClass('pe-on');
                $('#' + result1).addClass('pe-off');
            checkWin();
            switchPlayers();
    }


    ////////////////////////////////////////////////////////////////////////////
    // beginning of computer Minimax algorithm

    var iter = 0;


    function minimax(reboard, player) {
        iter++;
        let array = avail(reboard);
        if (winning(reboard, humanPlayer)) {
            return {
                score: -10
            };
        } else if (winning(reboard, computerPlayer)) {
            return {
                score: 10
            };
        } else if (array.length === 0) {
            return {
                score: 0
            };
        }

        var moves = [];
        for (var i = 0; i < array.length; i++) {
            var move = {};
            move.index = reboard[array[i]];
            reboard[array[i]] = player;

            if (player === computerPlayer) {
                var g = minimax(reboard, humanPlayer);
                move.score = g.score;
            } else {
                var g = minimax(reboard, computerPlayer);
                move.score = g.score;
            }
            reboard[array[i]] = move.index;
            moves.push(move);
        }
        if (iter < 10) {
            console.log('moves = ' + moves);
        }

        var bestMove;
        if (player === computerPlayer) {
            var bestScore = -10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = 10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }

    //available spots
    function avail(reboard) {
        return reboard.filter(s => s != "X" && s != "O");
    }


    // winning combinations
    function winning(board, player) {
        if (
            (board[0] === player && board[1] === player && board[2] === player) ||
            (board[3] === player && board[4] === player && board[5] === player) ||
            (board[6] === player && board[7] === player && board[8] === player) ||
            (board[0] === player && board[3] === player && board[6] === player) ||
            (board[1] === player && board[4] === player && board[7] === player) ||
            (board[2] === player && board[5] === player && board[8] === player) ||
            (board[0] === player && board[4] === player && board[8] === player) ||
            (board[2] === player && board[4] === player && board[6] === player)
        ) {
            return true;
        } else {
            return false;
        }
    }

    /////////////////////////////////////////////////////////////////////////////////



}); //end of document.ready
