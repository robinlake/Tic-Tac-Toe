$( document ).ready(function() {
    var player = 'X';
    var cell;
    var cellValues = {};
    var winner;
    var xWins = 0;
    var oWins = 0;

$('.cell').click(function(){
    cell = this.id;
    makeMove(cell);
});

function makeMove(cell) {

    var cellValue = document.getElementById(cell).innerHTML;
    if (cellValue == ''){
        document.getElementById(cell).innerHTML = player; // update cell with player token
        cellValues[`${cell}`] = player; // record values of cells already taken      
        checkGameStatus();
        if (player == 'X'){ // alternates players
        player = 'O';
        } else {
        player = 'X';
        } 
    } 
    return player;
}

// pop-up box at beginning

$('#chooseX').click(function(){
    $('#overlay').hide();
	player = 'X';
})
$('#chooseO').click(function(){
    $('#overlay').hide();
	player = 'O';
})

// to do:
// robin: populate cells, logging values of used cells (DONE)
// sarah: figure out if game is won (DONE)
// need a function to reset the game
// need to call reset once game is won

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


}); //end of document.ready