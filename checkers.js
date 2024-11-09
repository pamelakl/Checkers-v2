let numOfGames = 0;

let board = new newGame();
board.printVisualBoard();

function Square(color, piece, row, column) {
    this.color = color;
    this.piece = piece;
    this.king = false;
    this.row =  row;
    this.column = column;
}

function newGame(){
    this.turn = 'white-player';
    this.from = undefined;
    this.dest = undefined;
    this.captureMove = false;
    this.win = false;
    numOfGames++;
    this.numOfGame = numOfGames;
    this.board = createBoard();

    this.container = document.createElement('div');
    this.container.classList.add('container');
    document.body.appendChild(this.container);

    this.printVisualBoard = () => {
        const boardObject = document.getElementById(`${this.numOfGame}`);
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                const squareDiv = document.createElement("div");
                squareDiv.className = `${this.board[i][j].color}`;
                squareDiv.id = `${this.numOfGame}-${i}-${j}`;
                if(this.board[i][j].piece){
                    const pieceDiv = document.createElement("div");
                    pieceDiv.className = `${this.board[i][j].piece}`;
                    if(this.board[i][j].piece == 'white-player' && this.board[i][j].king){
                        pieceDiv.classList.add(`white-king`);
                    }
                    else if(this.board[i][j].piece == 'black-player' && this.board[i][j].king){
                        pieceDiv.classList.add('black-king');
                    }
                    squareDiv.appendChild(pieceDiv);
                }
                boardObject.appendChild(squareDiv); 
            }
        }   
        if(this.from!= undefined){
            showChosenPiece(this.from, this.numOfGame);
        }
    }

    this.createResignModal = () => {
        this.resignButton = document.createElement("button");
        this.resignButton.innerHTML = "Resign";
        this.container.appendChild(this.resignButton);

        this.modalResign = document.createElement('div');
        this.modalResign.classList.add('modal');
        this.container.appendChild(this.modalResign);

        this.resignContent = document.createElement('div'); 
        this.resignContent.classList.add('modal-content');
        this.modalResign.appendChild(this.resignContent);

        this.closeResignButton = document.createElement('span'); //create close button
        this.closeResignButton.classList.add('close');
        this.closeResignButton.innerHTML = "&times;"
        this.resignContent.appendChild(this.closeResignButton);

        this.resignText = document.createElement('p');
        this.resignText.innerHTML = "The other player has resigned";
        this.resignContent.appendChild(this.resignText);
    }

    this.createDrawModal = () => {
        this.drawButton = document.createElement('button'); //create button
        this.drawButton.innerHTML = "Request a draw";
        this.container.appendChild(this.drawButton);

        this.drawModal = document.createElement('div');  //create drawModal
        this.drawModal.classList.add('modal');
        this.container.appendChild(this.drawModal);
        
        this.drawModalContent = document.createElement('div'); //create drawModalContant
        this.drawModalContent.classList.add('modal-content');
        this.drawModal.appendChild(this.drawModalContent);

        this.closeButton = document.createElement('span'); //create close button
        this.closeButton.classList.add('close');
        this.closeButton.innerHTML = "&times;"
        this.drawModalContent.appendChild(this.closeButton);

        this.drawText = document.createElement('p');
        this.drawText.innerHTML = "Will you accept a draw?";
        this.drawModalContent.appendChild(this.drawText);

        this.yesButton = document.createElement("button");
        this.yesButton.innerHTML = "yes";
        this.noButton = document.createElement("button");
        this.noButton.innerHTML = "no";
        this.drawModalContent.appendChild(this.yesButton);
        this.drawModalContent.appendChild(this.noButton);

        this.drawResult = document.createElement('div');  //create drawResult
        this.drawResult.classList.add('modal');
        this.container.appendChild(this.drawResult);
        
        this.drawResultContent = document.createElement('div'); //create drawResModalContant
        this.drawResultContent.classList.add('modal-content');
        this.drawResult.appendChild(this.drawResultContent);

        this.closeResButton = document.createElement('span'); //create close button
        this.closeResButton.classList.add('close');
        this.closeResButton.innerHTML = "&times;"
        this.drawResultContent.appendChild(this.closeResButton);

        this.DrawResultText = document.createElement('p');
        this.DrawResultText.innerHTML = "A draw!";
        this.drawResultContent.appendChild(this.DrawResultText);
    
    }  

    this.winnerAnnounce = (winner) => {
        this.winModal = document.createElement('div');
        this.winModal.classList.add('modal');
        this.container.appendChild(this.winModal);

        this.winModalContent = document.createElement('div');
        this.winModalContent.classList.add('modal-content');
        this.winModal.appendChild(this.winModalContent);
        let winCloseButton = document.createElement('span'); 
        winCloseButton.classList.add('close');
        winCloseButton.innerHTML = "&times;"
        this.winModalContent.appendChild(winCloseButton);
        let win = document.createElement('p');
        win.innerHTML = `${winner} is the winner`;
        this.winModalContent.appendChild(win);
        this.winModal.style.display = "block";
    
        winCloseButton.addEventListener('click', () => {
            this.winModal.style.display = "none";
        });
    }

    this.createResignModal();
    this.createDrawModal();
    this.newGameButton = document.createElement('button');
    this.newGameButton.innerHTML = "New Game";
    this.container.appendChild(this.newGameButton);

    this.boardObject = document.createElement("div");
    this.boardObject.id = `${numOfGames}`;
    this.boardObject.className = "board";
    this.container.appendChild(this.boardObject);

    this.boardObject.addEventListener('click', (event) => {
        if(this.win){
            return;
        }
        let clickedObject = event.target;
        if(clickedObject.classList.contains('white-player') || clickedObject.classList.contains('black-player')){
            clickedObject = clickedObject.parentElement;
        }
        let currId = clickedObject.id;
        if(currId.length < 2){
            return;
        }
        let row = Number(currId.substring(currId.indexOf('-')+1, currId.indexOf('-')+2));
        let column = Number(currId.substring(currId.indexOf('-')+3, currId.indexOf('-')+4));
        let square = this.board[row][column]
        this.step(square);
    });

    this.step = (square) => { 
        let squareRow = square.row;
        let squareCol = square.column;
        if(!this.captureMove && (this.board[squareRow][squareCol].piece == this.turn)){
            if(this.from != undefined){
                unshowChosenPiece(this.from, this.numOfGame);
            }
            this.from = this.board[squareRow][squareCol];
            showChosenPiece(this.from, this.numOfGame);
        }
        else if(this.board[squareRow][squareCol].piece == null && this.dest == undefined){
            if(this.captureMove && validContinualMove(this.board[this.from.row][this.from.column], this.board[squareRow][squareCol], this.board, this.turn)){   //שרשור
                this.makeCapture(this.board[this.from.row][this.from.column], this.board[squareRow][squareCol]);
                this.playMove(square);
            }
            else if(!this.captureMove && validMove(this.from, square, this.board, this.turn)){
                if(isACaptureTurn(this.from, square, this.board, this.turn)){
                    this.makeCapture(this.from, square);
                    this.playMove(square);
                }
                else{
                    let possibleCapture = isTherePossibleCapture(this.board, this.turn);
                    if(possibleCapture != false){
                        if(!(possibleCapture.row === this.from.row && possibleCapture.column === this.from.color)){
                            if(!this.win){ 
                                this.board[possibleCapture.row][possibleCapture.column].piece = null;
                            }
                            this.playMove(square);
                        }
                        else{
                            this.board[possibleCapture.row][possibleCapture.column].piece = null;
                            this.turn = this.turn === 'white-player' ? 'black-player' : 'white-player';
                            this.win = this.checkForWin(this.board, this.turn);
                            this.from = undefined;
                            this.captureMove = false;
                            this.dest = undefined;
                            while(this.boardObject.childElementCount > 0){
                                this.boardObject.removeChild(this.boardObject.firstElementChild);
                            }
                            this.printVisualBoard();
                        }
                        
                    }
                    else{
                        this.playMove(square);
                    }
                    this.captureMove = false;
                    
                }
            }
            
        }
    
    }
    this.playMove = (square) => {
        this.dest = square;
        this.dest.piece = this.from.piece;
        this.dest.king = this.from.king;
        this.board[this.from.row][this.from.column].piece = null;
        if(this.dest.piece=='white-player' && (this.dest.row == 0)){
            this.board[this.dest.row][this.dest.column].king = true;
        }
        if(this.dest.piece=='black-player' && (this.dest.row == 7)){
            this.board[this.dest.row][this.dest.column].king = true;
        }
        if(this.captureMove && isThereAnotherCapture(this.dest, this.board, this.turn)){
            this.from = this.dest;
        }
        else{
            this.turn = this.turn === 'white-player' ? 'black-player' : 'white-player';
            this.win = this.checkForWin(this.board, this.turn);
            this.from = undefined;
            this.captureMove = false;
        }
        this.dest = undefined; 
        while(this.boardObject.childElementCount > 0){
            this.boardObject.removeChild(this.boardObject.firstElementChild);
        }
        this.printVisualBoard();
        
    }
    this.makeCapture = (fromSquare, destSquare) => {
        let search = undefined;
        let currSquare;
        for(let i=Math.min(fromSquare.row, destSquare.row)+1; i<Math.max(fromSquare.row, destSquare.row); i++){
            if(destSquare.column > fromSquare.column)
                currSquare = this.board[i][fromSquare.column+Math.abs(i-fromSquare.row)];
            else{
                currSquare = this.board[i][fromSquare.column-Math.abs(i-fromSquare.row)];
            }
            if(currSquare.piece != null && currSquare.piece != this.turn){
                search = currSquare;
            }
        }
        this.board[search.row][search.column].piece = null;
        this.board[search.row][search.column].king = false;
        this.captureMove = true;
    }
    //Resign
    this.resignButton.addEventListener('click', () => {
        if(this.win){
            return;
        }
        this.modalResign.style.display = "block";
        //this.closeGame();
        this.win = true;
    });
    this.closeResignButton.addEventListener('click', () => {
        this.modalResign.style.display = "none";
    })
    window.addEventListener ('click', (event) => {
        if (event.target == this.modalResign) {
            this.modalResign.style.display = "none";
        }
    })

    //Draw
    this.drawButton.addEventListener('click', () => {
        if(this.win){
            return;
        }
        this.drawModal.style.display = "block";
    });
    this.closeButton.addEventListener('click', () => {
        this.drawModal.style.display = "none";
    });
    this.closeResButton.addEventListener('click', () => {
        this.drawResult.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target == this.drawModal) {
            this.drawModal.style.display = "none";
        }
    });
    this.yesButton.addEventListener('click', () =>  {
        this.drawModal.style.display = "none";
        this.drawResult.style.display = "block";
        this.win = true;
    });
    this.noButton.addEventListener('click', () => {
        this.drawModal.style.display = "none";
    });

    //newGame
    this.newGameButton.addEventListener('click', () => {
        while(this.boardObject.childElementCount > 0){
            this.boardObject.removeChild(this.boardObject.firstElementChild);
        }
        this.turn = 'white-player';
        this.from = undefined;
        this.dest = undefined;
        this.captureMove = false;
        this.win = false;
        this.board = createBoard();
        this.printVisualBoard();
    })

    this.closeGame = () => {
        document.body.removeChild(this.resignButton);
        document.body.removeChild(this.drawButton);
        document.body.removeChild(this.newGameButton);
        document.body.removeChild(this.boardObject);
    }

    
    
    this.checkForWin = (board, turn) => {
        if(countPlayers('white-player', board) == 0){
            this.winnerAnnounce("black");
            return true;
        }
        if(countPlayers('black-player', board) == 0){
            this.winnerAnnounce("white");
            return true;
        }
        if(!areTherePossibleMoves(turn, board)){
            this.winnerAnnounce(turn == 'white-player' ? "Black" : "White");
            return true;
        }
        return false;
    }

}
function createBoard(){
    let board = new Array(8);
    for(let i=0; i<8; i++){
        board[i] = new Array(8);
        for(let j=0; j<8; j++){
            let color = (i + j) % 2 == 0 ? "black" : "white";
            let piece = null;
            if (color === "black") {
                if(i < 3) 
                    piece = "black-player";
                if(i > 4) 
                    piece = "white-player";
            }
            board[i][j] = new Square(color, piece, i, j);
        }
    }
    return board;
}


function showChosenPiece(square, numOfGame) {
    const row = square.row;
    const column = square.column
    const squareObject = document.getElementById(`${numOfGame}-${row}-${column}`);
    const piece = squareObject.firstElementChild;
    piece.classList.add('chosen-square');
}

function unshowChosenPiece(square, numOfGame) {
    const row = square.row;
    const column = square.column
    const squareObject = document.getElementById(`${numOfGame}-${row}-${column}`);
    const piece = squareObject.firstElementChild;
    piece.classList.remove('chosen-square');
}

let anotherGameButton = document.getElementById('another-game');

anotherGameButton.addEventListener('click', () => {
    const game = new newGame();
    game.printVisualBoard();
})

const countPlayers = (color, board) => {
    let countPlayers = 0;
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            let currSquareColor = board[i][j].piece;
            if(currSquareColor == color){
                countPlayers++;
            }
        }
    }
    return countPlayers;
}

const validMove = (fromSquare, destSquare, board, turn) => {
    if((turn == 'white-player' && fromSquare.row == (destSquare.row + 1)) || ((turn == 'black-player') && ((fromSquare.row) == (destSquare.row) - 1))){
        if(Math.abs(fromSquare.column - destSquare.column) == 1)
            return true;
    }
    if((turn == 'white-player' && fromSquare.row == (destSquare.row + 2)) || ((turn == 'black-player') && (fromSquare.row == (destSquare.row - 2)))){
        if(Math.abs(fromSquare.column - destSquare.column) == 2){
            if(isACaptureTurn(fromSquare, destSquare, board, turn))
                return true;
        }
    }
    if((fromSquare.king == true) && validKingMove(fromSquare, destSquare, board, turn)){
        return true;
    }
    return false;
}
const isThereValidMove = (fromSquare, destSquare, currTurn, board) => {  
    if((currTurn == 'white-player' && (fromSquare.row == destSquare.row + 1)) || ((currTurn == 'black-player') && (fromSquare.row == destSquare.row - 1))){
        if(Math.abs(fromSquare.column - destSquare.column) == 1)
            return true;
    }
    if((currTurn == 'white-player' && (fromSquare.row == destSquare.row + 2)) || ((currTurn == 'black-player') && (fromSquare.row == destSquare.row - 2))){
        if(Math.abs(fromSquare.column - destSquare.column) == 2){
            if(isACaptureTurn(fromSquare, destSquare, board, currTurn))
                return true;
        }
    }
    if(fromSquare.king == true && validKingMove(fromSquare, destSquare, board, currTurn)){
        return true;
    }
    
    return false;
}

const isACaptureTurn = (fromSquare, destSquare, board, turn) => {
    let currSquare;
    if(fromSquare.king == true){
        if(Math.abs(destSquare.row - fromSquare.row) == Math.abs(destSquare.column - fromSquare.column)){
            let search = undefined;
            for(let i=Math.min(fromSquare.row, destSquare.row)+1; i<Math.max(fromSquare.row, destSquare.row); i++){
                let currSquare;
                if(destSquare.column > fromSquare.column)
                    currSquare = board[i][fromSquare.column+Math.abs(i-fromSquare.row)];
                   // currSquare = document.getElementById(`${i}-${Number(fromID[2])+Math.abs(i-Number(fromID[0]))}`);
                else{
                    currSquare = board[i][fromSquare.column-Math.abs(i-fromSquare.row)];
                    //currSquare = document.getElementById(`${i}-${Number(fromID[2])-Math.abs(i-Number(fromID[0]))}`);
                }
                if(currSquare.piece != null){
                    if(currSquare.piece != turn){  
                        if(search == undefined){
                            search = currSquare;
                        }
                        else{
                            return false;
                        }
                    }
                    else{
                        return false;
                    }
                }
            }
            if(search != undefined){
                return true;
            }
            return false;
        }
    } 
    if(Math.max(fromSquare.row, destSquare.row) - Math.min(fromSquare.row, destSquare.row) == 2){
        currSquare = board[Math.min(fromSquare.row, destSquare.row)+1][Math.min(fromSquare.column, destSquare.column)+1]
        if(currSquare.piece != null){
            if(currSquare.piece != turn){  
                return true;
            }
        }
    }
    return false;

}
const isTherePossibleCapture = (board, turn) => {
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(board[i][j].piece == turn){
                let result = isTherePossibleCaptureFromSquare(board[i][j], board, turn);
                if(result != false){
                   return board[i][j];
                }
            }
        }
    }
    return false;
}
const isTherePossibleCaptureFromSquare = (square, board, turn) => {
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(board[i][j].piece == null & validMove(square, board[i][j], board, turn) && isACaptureTurn(square, board[i][j], board, turn)){
                return board[i][j];
            }
        }
    }
    return false;
}

const isThereAnotherCapture = (fromSquare, board, turn) => {
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(board[i][j].piece == null & validContinualMove(fromSquare, board[i][j], board, turn) && isACaptureTurn(fromSquare, board[i][j], board, turn)){
                return true;
            }
        }
    }
    return false;
}

const validContinualMove = (fromSquare, destSquare, board, turn) => {  
    if(fromSquare.king === true){
        if(validKingMove(fromSquare, destSquare, board, turn) && isACaptureTurn(fromSquare, destSquare, board, turn)){
        return true;
        }
    }
    else if((Math.abs(destSquare.row - fromSquare.row) == 2) & (Math.abs(destSquare.column - fromSquare.column) == 2)){
        if(isACaptureTurn(fromSquare, destSquare, board, turn))
            return true;
    }
    return false;
}
const validKingMove = (fromSquare, destSquare, board, turn) => {
    if(Math.abs(destSquare.row - fromSquare.row) == Math.abs(destSquare.column - fromSquare.column)){
        let search = undefined;
        for(let i=Math.min(fromSquare.row, destSquare.row)+1; i<Math.max(fromSquare.row, destSquare.row); i++){
            let currSquare;
            if(destSquare.column > fromSquare.column)
                currSquare = board[i][fromSquare.column+Math.abs(i-fromSquare.row)];
            else{
                currSquare = board[i][fromSquare.column-Math.abs(i-fromSquare.row)];
            }
            if(currSquare.piece != null){
                if(currSquare.piece != turn){  
                    if(search == undefined){
                        search = currSquare;
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return false;
                }
            }
        } 
        return true;
    }
    return false;
}

const areTherePossibleMoves = (currTurn, board) => {
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(board[i][j].piece == currTurn){
                let result = isTherePossibleMoveFromSquare(board[i][j],board, currTurn);
                if(result != false){
                    return result; 
                }
            }
        }
    }
    return false;
}
const isTherePossibleMoveFromSquare = (fromSquare, board, turn) => {
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(board[i][j].piece == null && isThereValidMove(fromSquare, board[i][j], turn, board))
                return true;
        }
    }
    return false;
}

 

