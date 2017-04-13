$( document ).ready(function() {
    var player = '';
    var computerPlayer = '';
    var humanPlayer = '';
    var computer = '';
    var computerDifficulty = '';
    var cell;
    var cellValues = {};   //1st cell value instance
    var cellValuesArray = [0,1,2,3,4,5,6,7,8];
    var winner = '';
    var xWins = 0;
    var oWins = 0;


// pop-up box at beginning

$('#chooseX').click(function(){
	player = 'X';
	humanPlayer = 'X';
	computerPlayer = 'O';
	$('#chooseX').css('background-color','#ccc');
	$('#chooseO').css('background-color', '');
	console.log(player, humanPlayer, computerPlayer);
});
$('#chooseO').click(function(){
	player = 'O';
	humanPlayer = 'O';
	computerPlayer = 'X';
	$('#chooseO').css('background-color','#ccc');
	$('#chooseX').css('background-color', '');
});
$('#easy').click(function(){
    $('#easy').css('background-color', '#ccc');
    $('#medium').css('background-color', '');
    $('#hard').css('background-color', '');
    computerDifficulty = 'easy';
});
$('#medium').click(function(){
    $('#easy').css('background-color', '');
    $('#medium').css('background-color', '#ccc');
    $('#hard').css('background-color', '');
    computerDifficulty = 'medium';
});
$('#hard').click(function(){
    $('#easy').css('background-color', '');
    $('#medium').css('background-color', '');
    $('#hard').css('background-color', '#ccc');
    computerDifficulty = 'hard';
});
$('#human').click(function(){
    $('#overlay').hide();
    computer = '';
});
$('#computer').click(function(){
    computer = 'on';
    if(computerDifficulty != ''){
        $('#overlay').hide();
    } else{
        alert('Select difficulty');
    }

});

// choosing individual cells
$('.cell').click(function(){
    cell = this.id;
    makeMove(cell);
    $(this).removeClass("empty");
});

function makeMove(cell) { // populates board with player icon and updates record of available spaces

    var cellValue = document.getElementById(cell).innerHTML;
    if (cellValue == ''){
        document.getElementById(cell).innerHTML = player; // update cell with player token
        cellValues[`${cell}`] = player; // record values of cells already taken          
        var cellDec = parseInt(cell) - 1;
        cellValuesArray[cellDec] = player;
        //checkGameStatus();
        checkWin();
        switchPlayers();
        // console.log(Object.keys(cellValues).length);  
        console.log(cellValues);
        console.log(cellValuesArray);
    } else {
        return;
    }
    if (computer == 'on' && computerDifficulty == 'easy' && Object.keys(cellValues).length < 9){ //cellvalues
        computerMove();
    } else if (computer == 'on' && computerDifficulty == 'hard' && Object.keys(cellValues).length < 9){ //cellvalues
        var result = minimax(cellValuesArray, computerPlayer).index;
        console.log('result = ' + result);
        console.log(cellValues);
        console.log(cellValuesArray);
        cellValuesArray[result] = computerPlayer;
        var result1 = result + 1;
        cellValues[result1] = computerPlayer;
        $('#' + result1).html(computerPlayer);
        checkWin();
        switchPlayers();
    }
}

// change player turn
function switchPlayers(){
    if(player == 'X'){
        player = 'O';
    }else{
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
            resetGame();
}

// reset game

function resetGame() {
    setTimeout(function() {
    player = 'X';
    cell = '';
    cellValues = {};
    cellValuesArray = [0,1,2,3,4,5,6,7,8];
    winner = undefined;
    computer = '';
    computerDifficulty = '';
    $('.cell').html('');
    $('.message').html('');
    $('#overlay').show();
    $('#easy').css('background-color', '');
    $('#medium').css('background-color', '');
    $('#hard').css('background-color', '');
}, (2000));
}

/*
// display player icons on hover
$('.empty').hover(function(){
    $(this).html(`${player}`);
    $(this).click(click());
}, function(){
    $(this).html('');
});

$('.empty').click(function(){	
	$('.empty').unbind("hover");
	});
*/

// new check win function, returns true if there is a winner
function checkWin() {
    if (
         (cellValues[1] == player && cellValues[2] == player && cellValues[3] == player) ||
         (cellValues[4] == player && cellValues[5] == player && cellValues[6] == player) ||
         (cellValues[7] == player && cellValues[8] == player && cellValues[9] == player) ||
         (cellValues[1] == player && cellValues[4] == player && cellValues[7] == player) ||
         (cellValues[2] == player && cellValues[5] == player && cellValues[8] == player) ||
         (cellValues[3] == player && cellValues[6] == player && cellValues[9] == player) ||
         (cellValues[1] == player && cellValues[5] == player && cellValues[9] == player) ||
         (cellValues[3] == player && cellValues[5] == player && cellValues[7] == player)
 ) {
         winner = player;
        $('.message').html(winner + " wins the game!");
        updateScore(winner);
    	$('#chooseX').css('background-color', '');
    	$('#chooseO').css('background-color', '');
        resetGame();
 } else if( Object.keys(cellValues).length == 9) {
        $('.message').html("it's a draw!");
    	$('#chooseX').css('background-color', '');
    	$('#chooseO').css('background-color', '');
        resetGame();
 }else {
     winner = '';
 }
};

// computer move with random selection
function computerMove(){
    var retry = '';
    var randomChoice =  Math.ceil(Math.random()*9);
    var choice = parseInt(randomChoice, 10);
    if (retry != ''){
        choice = retry;
    }
    // check for available spaces recursively
    function placeToken(){
        if(cellValues.hasOwnProperty(choice)){
            retry = (choice % 9) + 1;
            computerMove();
        }else{
            $('#' + choice).html(player);
            retry = '';
            cellValues[`${choice}`] = player;
            cellValuesArray[`${choice}`] = player;
            checkWin(player);
            switchPlayers();
        }
    }
    placeToken();
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

    if (player == computerPlayer) {
      var g = minimax(reboard, humanPlayer);
      move.score = g.score;
    } else {
      var g = minimax(reboard, computerPlayer);
      move.score = g.score;
    }
    reboard[array[i]] = move.index;
    moves.push(move);
  }
    if(iter < 10){
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
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  ) {
    return true;
  } else {
    return false;
  }
}

/////////////////////////////////////////////////////////////////////////////////


function checkGameStatus() {
    
//check for winner    
  if (cellValues[5] !== null) {
if (cellValues[1] == cellValues[5] && cellValues[5] == cellValues[9]
|| cellValues[2] == cellValues[5] && cellValues[5] == cellValues[8]
|| cellValues[3] == cellValues[5] && cellValues[5] == cellValues[7]
|| cellValues[4] == cellValues[5] && cellValues[5] == cellValues[6])
 {
     winner = cellValues[5];
     if (winner !== undefined) {
        $('.message').html(winner + " wins the game!");
        updateScore(winner);
}
}
}

if (cellValues[1] !== null) {
    if (cellValues[1] == cellValues[2] && cellValues[1] == cellValues[3]
    || cellValues[1] == cellValues[4] && cellValues[1] == cellValues[7])
 {
     winner = cellValues[1];
     if (winner !== undefined) {
        $('.message').html(winner + " wins the game!");
        updateScore(winner);
}
}    
}
if (cellValues[9] !== null) {
    if (cellValues[9] == cellValues[6] && cellValues[9] == cellValues[3]
    || cellValues[9] == cellValues[8] && cellValues[9] == cellValues[7])
 {
     winner = cellValues[9];
     if (winner !== undefined) {
        $('.message').html(winner + " wins the game!");
        updateScore(winner);
}   
}
}
// check for draw

if (Object.keys(cellValues).length ===9 && winner == undefined){
    console.log('length: ' + Object.keys(cellValues).length);
    console.log("winner: " + winner);
        $('.message').html("it's a draw!");
        resetGame();
    }


}


}); //end of document.ready