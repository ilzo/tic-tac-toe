var gameBoard;
var turns;
var gameState;
var winningIndices;

$(document).ready(function() {
    gameInit();
});

// Initialize a new tic-tac-toe game
function gameInit () {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    turns = 1;
    
    $( 'td' ).removeClass( 'x o' );
    $( 'td' ).empty();
    
    $('#game-msg h3').replaceWith('<h3>Crosses starts</h3>');
    $('button').remove();
    
    checkGameState();
    
    $( '.grid-cell' ).click(function( event ) {
        
        // If player attempts to click already clicked table cell, indicate with a red border flash animation
        
        if(($(event.target).hasClass('x')) || ($(event.target).hasClass('o')) || event.target !== this) {
           errorFlash();
           console.log("That field has already been clicked!"); 
           return;
        }

        var boardIndex = parseInt(event.target.id);

        if(turns % 2 == 0){
            $(event.target).addClass('o');
            $(event.target).append('<svg class="icon icon-radio-unchecked"><use xlink:href="#icon-radio-unchecked"></use></svg>');
            gameBoard[boardIndex] = 'O';
            $('#game-msg h3').replaceWith('<h3>Current turn: Crosses</h3>');

        }else{
            $(event.target).addClass('x');
            $(event.target).append('<svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg>');
            gameBoard[boardIndex] = 'X';
            $('#game-msg h3').replaceWith('<h3>Current turn: Noughts</h3>');
        }

        var thisClass = $(event.target).attr('class');

        turns++;
        checkGameState();
        
    });
}


// Make table cell borders flash for brief period 
function errorFlash () {
    
   $(".grid-cell").css({'-webkit-animation' : 'glowing 250ms infinite', '-moz-animation' : 'glowing 250ms infinite', '-o-animation' : 'glowing 250ms infinite', 'animation' : 'glowing 250ms infinite'});
    
    setTimeout(function () {
        $(".grid-cell").css({'-webkit-animation' : '', '-moz-animation' : '', '-o-animation' : '', 'animation' : ''});
    }, 750);
 
}

function enlargeWinningRow (winningRow) {
    
    var element1 = '#' + winningRow[0] + ' .icon';
    var element2 = '#' + winningRow[1] + ' .icon';
    var element3 = '#' + winningRow[2] + ' .icon';
    
    $(element1).animate({
        height: '3em',
        width: '3em'
    }, {
        duration: 600,
        queue: false
    });
    
    $(element2).animate({
        height: '3em',
        width: '3em'
    }, {
        duration: 600,
        queue: false
    });
    
    $(element3).animate({
        height: '3em',
        width: '3em'
    }, {
        duration: 600,
        queue: false
    });


}


function checkGameState () {
    gameState = solution(gameBoard);
        
    switch (gameState) {
        case 0:
            console.log("Winner is Noughts!");
            $('#game-msg h3').replaceWith('<h3>Winner is Noughts!</h3>');
            enlargeWinningRow (winningIndices);
            console.log(winningIndices);
            $('.grid-cell').off();
            break;
        case 1:
            console.log("Winner is Crosses!");
            $('#game-msg h3').replaceWith('<h3>Winner is Crosses!</h3>');
            enlargeWinningRow (winningIndices);
            console.log(winningIndices);
            $('.grid-cell').off();
            break;
        case 2:
            console.log("Tie");
            $('#game-msg h3').replaceWith('<h3>Game ended in a tie</h3>');
            $('.grid-cell').off();
            break;
        case 3:
            break;
        case 4:
            $('#game-msg h3').replaceWith('<h3>There is an error in the script, invalid board array!</h3>');
            throw new Error("Invalid board array!");

    }
    
    if(gameState !== 3) {
        $('#game-msg').append('<button id="new-game-btn">New game</button>');
        $( '#new-game-btn' ).click(function( event ) { gameInit()});
    }
}


function solution (board) {
    
    if(!isArrayValid(board)){
        return 4;
    }
    
    console.log("items in board: " + board);
    
    var horizontal = checkHorizontalRows(board);
    
    console.log("horizontals: " + horizontal);
    
    if(horizontal !== null){
        return horizontal;
    }
    
    var vertical = checkVerticalRows(board);
    
    console.log("verticals: " + vertical);
    
    if(vertical !== null){
        return vertical;
    }
    
    var diagonal = checkDiagonalRows(board);
    
    console.log("diagonals: " + diagonal);
    
    if(diagonal !== null){
        return diagonal;
    }
    
    var directions = [horizontal, vertical, diagonal];
    
    if((directions.every(x => x === null)) && turns === 10){
        return 2;
    }
    
    return 3;
     
}


// Check if the board array is valid
function isArrayValid(board) {
    if(board.length !== 9) {
        return false;
    }
    
    for(var i = 0; i < 9; i++) {
        if(board[i] !== '' && board[i] !== 'X' && board[i] !== 'O'){
            return false;
        }
    }
    
    return true;
}


// Below are helper functions to determine any winning rows

function checkHorizontalRows(board){
  
    var startIndex = 0;
    
    for(var i = 0; i < 3; i++){

        var row = [board[startIndex], board[startIndex + 1], board[startIndex + 2]];
        
        
        if(row.every(x => x === 'X')){
            winningIndices = [startIndex, startIndex + 1, startIndex + 2];
            return 1;
        }else if(row.every(x => x === 'O')){
            winningIndices = [startIndex, startIndex + 1, startIndex + 2];
            return 0;
        }
        
        startIndex += 3;
    }
    
    return null;
}

function checkVerticalRows(board){
    
    var startIndex = 0;
    for(var i = 0; i < 3; i++){
        
        var row = [board[startIndex], board[startIndex + 3], board[startIndex + 6]];
        
        if(row.every(x => x === 'X')){
            winningIndices = [startIndex, startIndex + 3, startIndex + 6];
            return 1;
        }else if(row.every(x => x === 'O')){
            winningIndices = [startIndex, startIndex + 3, startIndex + 6];
            return 0;
        }
        
        startIndex += 1;
    }
   
    return null;
}

function checkDiagonalRows(board){
    
    var startIndex = 0;
    for(var i = 0; i < 2; i++){
        
        if (startIndex == 0){
            
            var row = [board[startIndex], board[startIndex + 4], board[startIndex + 8]];
            
            if(row.every(x => x === 'X')){
                winningIndices = [startIndex, startIndex + 4, startIndex + 8];
                return 1;
            }else if(row.every(x => x === 'O')){
                winningIndices = [startIndex, startIndex + 4, startIndex + 8];
                return 0;
            }
            
            startIndex += 2;
            
            continue;
        }
        
        var row = [board[startIndex], board[startIndex + 2], board[startIndex + 4]];
        
        if(row.every(x => x === 'X')){
            winningIndices = [startIndex, startIndex + 2, startIndex + 4];
            return 1;
        }else if(row.every(x => x === 'O')){
            winningIndices = [startIndex, startIndex + 2, startIndex + 4];
            return 0;
        }
        
    }
   
    return null;
}