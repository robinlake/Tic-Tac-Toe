$( document ).ready(function() {
    var player = 'X';
    var computer = '';
    var cell;
    var cellValues = {};
    var winner;
    var xWins = 0;
    var oWins = 0;


// pop-up box at beginning

$('#chooseX').click(function(){
	player = 'X';
	$('#chooseX').css('background-color','#ccc');
	$('#chooseO').css('background-color', '');
});
$('#chooseO').click(function(){
	player = 'O';
	$('#chooseO').css('background-color','#ccc');
	$('#chooseX').css('background-color', '');
});
$('#human').click(function(){
    $('#overlay').hide();
});
$('#computer').click(function(){
    $('#overlay').hide();
    computer = 1;
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
        //checkGameStatus();
        checkWin(player);
        switchPlayers();
    } 
    if (computer != ''){
        computerMove();
    }
}

// change player turn
function switchPlayers(){
    if(player == 'X'){
        player = 'O';
    }else{
        player = 'X';
    }
}

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
    winner = undefined;
    $('.cell').html('');
    $('.message').html('');
    $('#overlay').show();
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

// new check win function
function checkWin(player) {
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
        resetGame();
 } else if( Object.keys(cellValues).length == 9) {
        $('.message').html("it's a draw!");
        resetGame();
 }
};

// computer move with random selection
var randomChoice;
var choice;
function computerMove(retry){
    //var retry;
    randomChoice =  Math.ceil(Math.random()*9);
    choice = parseInt(randomChoice, 10);
    console.log(choice);
    function placeToken(){
        if(cellValues.hasOwnProperty(choice)){
            console.log('foo');
        }else{
            $('#' + choice).html(player);
            if (player == 'X'){
                player = 'O';
            } else {
                player = 'X';
            }
        }
    }
    placeToken();
}
$('#compy').click(function(){
    computerMove();
    console.log(randomChoice.valueOf());
    console.log(choice);
})


/*
// beginning of computer Minimax algorithm
//check if given board results in win
function winning(board, player){
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

// check available spots
function avail(reboard) {
  return reboard.filter(s => s != "P" && s != "C");
}

var calls = 0;

function minimax(reboard, player) {
  calls++;
  let array = avail(reboard);
  if (winning(reboard, huPlayer)) {
    return {
      score: -10
    };
  } else if (winning(reboard, aiPlayer)) {
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

    if (player == aiPlayer) {
      var g = minimax(reboard, huPlayer);
      move.score = g.score;
    } else {
      var g = minimax(reboard, aiPlayer);
      move.score = g.score;
    }
    reboard[array[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
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

*/

}); //end of document.ready