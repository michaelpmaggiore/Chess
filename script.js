document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    let boardState = initializeBoard();
    let selectedPiece = null;
    let currentPlayer = 'white';
    let everyPossibleBlackMove = []
    renderBoard();

    function initializeBoard() {
        return [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            Array(8).fill(''),
            Array(8).fill(''),
            Array(8).fill(''),
            Array(8).fill(''),
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function renderBoard() {
        chessboard.innerHTML = '';
        let flag = false;
        let flag2 = false;
        boardState.forEach(cell => {
            if (cell.includes("k")){
                flag = true
            }
            if (cell.includes("K")){
                flag2 = true
            }
        })

        if (flag == false){
            alert("White wins! You have taken Black's King!")
            location.reload()
        } else if(flag2 == false){
            alert("Black wins! You have taken White's King!")
            location.reload()
        }


        // if (currentPlayer == 'black'){
        //     makeAIChessMove()
        // } else{
            for (let row = 0; row < 8; row++) {
                if (row % 2 == 0){
                    for (let col = 0; col < 8; col++) {
                        const cell = document.createElement('div');
                        const piece = boardState[row][col];

                        if (piece == "P" || piece == "N" || piece == "B" || piece == "R" || piece == "Q" || piece == "K"){
                            cell.classList.add('cell', 'white');
                        } else{
                            cell.classList.add('cell', 'black');
                        }

                        cell.dataset.row = row;
                        cell.dataset.col = col;
                        cell.textContent = getPieceRepresentation(boardState[row][col]);
                        cell.addEventListener('click', handleCellClick);
                        chessboard.appendChild(cell);
                    }
                } else{
                    for (let col = 0; col < 8; col++) {
                        const cell = document.createElement('div');
                        const piece = boardState[row][col];

                        if (piece == "P" || piece == "N" || piece == "B" || piece == "R" || piece == "Q" || piece == "K"){
                            cell.classList.add('cell2', 'white');
                        } else{
                            cell.classList.add('cell2', 'black');
                        }

                        cell.dataset.row = row;
                        cell.dataset.col = col;
                        cell.textContent = getPieceRepresentation(boardState[row][col]);
                        cell.addEventListener('click', handleCellClick);
                        chessboard.appendChild(cell);
                    }
                }

            }
        // }

    }

    function makeAIChessMove() {
        // console.log(getRandomInt(6));
        currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
        renderBoard()
    }

    function getPieceRepresentation(piece) {
        const pieceSymbols = {
            'P': '♟', 'N': '♞', 'B': '♝', 'R': '♜', 'Q': '♛', 'K': '♚',
            'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
        };
        return pieceSymbols[piece] || '';
    }

    function handleCellClick() {
        let clickedCell = this;
        let clickedRow = parseInt(clickedCell.dataset.row);
        let clickedCol = parseInt(clickedCell.dataset.col);

        let cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            if(isValidMove(clickedRow, clickedCol, cell.dataset.row, cell.dataset.col, false)){
                cell.classList.add('target')
            }
        }       
        );

        let cells2 = document.querySelectorAll('.cell2');
        cells2.forEach(cell => {
            if(isValidMove(clickedRow, clickedCol, cell.dataset.row, cell.dataset.col, false)){
                cell.classList.add('target')
            }
        }       
        );

        if (!selectedPiece) {
            if (isValidPiece(clickedRow, clickedCol)) {
                selectedPiece = { row: clickedRow, col: clickedCol };
                clickedCell.classList.add('selected');
            }
        } else {
            let { row: selectedRow, col: selectedCol } = selectedPiece;

            if (isValidMove(selectedRow, selectedCol, clickedRow, clickedCol, false)) {
                // Move the piece
                boardState[clickedRow][clickedCol] = boardState[selectedRow][selectedCol];
                boardState[selectedRow][selectedCol] = '';
                // renderBoard();

                // Reset selectedPiece
                selectedPiece = null;

                // Switch player
                currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
            } else {
                selectedPiece = null;
                // alert('Invalid Move! Try again.');
            }

            // Remove selection highlight
            const cells = document.querySelectorAll('.cell');

            cells.forEach(cell => cell.classList.remove('selected'));
            cells.forEach(cell => cell.classList.remove('target'));

            const cells2 = document.querySelectorAll('.cell2');

            cells2.forEach(cell => cell.classList.remove('selected'));
            cells2.forEach(cell => cell.classList.remove('target'));

            renderBoard()
        }
    }

    function isValidPiece(row, col) {
        const piece = boardState[row][col];
        let flag = '';
        if (piece == "P" || piece == "N" || piece == "B" || piece == "R" || piece == "Q" || piece == "K"){
            flag = 'white'
        } else{
            flag = 'black'
        }

        if (flag === currentPlayer && piece !== '' && piece !== ' '){
            return true;
        } else{
            return false;
        }
    }

    function isValidMove(startRow, startCol, endRow, endCol, flag) {
        const startPiece = boardState[startRow][startCol];
        const endPiece = boardState[endRow][endCol];
        endPiece.toUpperCase();

        // Ensure the player is moving their own piece
        if (((currentPlayer == 'white' && startPiece.toLowerCase() == startPiece) ||
            (currentPlayer == 'black' && startPiece.toUpperCase() == startPiece)) && flag == false) {
            return false;
        }

        // Validate specific piece movements
        switch (startPiece.toLowerCase()) {
            case 'p':
                return isValidPawnMove(startRow, startCol, endRow, endCol, endPiece);
            case 'r':
                return isValidRookMove(startRow, startCol, endRow, endCol, endPiece);
            case 'n':
                return isValidKnightMove(startRow, startCol, endRow, endCol, endPiece);
            case 'b':
                return isValidBishopMove(startRow, startCol, endRow, endCol, endPiece);
            case 'q':
                return isValidQueenMove(startRow, startCol, endRow, endCol, endPiece);
            case 'k':
                if (flag == true){
                    return true;
                } else{
                    return isValidKingMove(startRow, startCol, endRow, endCol, endPiece);
                }
            default:
                return false;
        }
    }

    function isValidPawnMove(startRow, startCol, endRow, endCol, endPiece) {

        if ((((currentPlayer == "black") && (endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k")) || ((currentPlayer == "white") && (endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K")) || ((startRow == endRow) && (startCol == endCol)))){
            return false
        } else{
            const direction = (currentPlayer == 'white') ? -1 : 1;

            // Move one square forward
            if (startCol == endCol && startRow + direction == endRow && boardState[endRow][endCol] == '') {
                return true;
            }

            // Move two squares forward on the first move
            if (startCol == endCol && startRow + direction * 2 == endRow
                && boardState[endRow][endCol] == '' && (startRow == 1 || startRow == 6)) {
                    const infrontPiece = boardState[startRow-1][startCol]
                    if (infrontPiece == "P" || infrontPiece == "N" || infrontPiece == "B" || infrontPiece == "R" || infrontPiece == "Q" || infrontPiece == "K" || endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k"){
                        return false;
                    }
                return true;
            }

            // Capture diagonally
            if (Math.abs(startCol - endCol) == 1 && startRow + direction == endRow &&
                boardState[endRow][endCol] !== '' && (((boardState[endRow][endCol] !== 'black' && (currentPlayer == 'black')) || (boardState[endRow][endCol] !== 'white' && (currentPlayer == 'white'))))) {
                    return true;
            }
            return false;
        }
    }

    function isValidRookMove(startRow, startCol, endRow, endCol, endPiece) {
        // Move horizontally or vertically
        if ((((currentPlayer == "black") && (endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k")) || ((currentPlayer == "white") && (endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K")) || ((startRow == endRow) && (startCol == endCol)))){
            return false
        } else{
            let k = 0;
            if (endRow > startRow){
                // console.log(startRow+1)
                // console.log(boardState[startRow])
                // console.log(boardState)

                for (let i = startRow+1; i <= endRow; i++){

                    const endPiece = boardState[i][startCol]
                    if (currentPlayer == "white"){
                        if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K")){
                            return false;
                        } else if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k") && k == 0){
                            k = 1;
                        } else if (k == 1){
                            k = 0;
                            return false;
                        }
                    } else if (currentPlayer == "black"){

                        if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k")){
   
                            return false;
                        } else if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && k == 0){
                            k = 1;
                        } else if (k == 1){

                            k = 0;
                            return false;
                        }
                    }
                }
            } else if (endRow < startRow){

                for (let i = startRow-1; i >= endRow; i--){
                    const endPiece = boardState[i][startCol]
                    if (currentPlayer == "white"){
                        if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K")){
                            return false;
                        } else if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k") && k == 0){
                            k = 1;
                        } else if (k == 1){
                            k = 0;
                            return false;
                        }
                    } else if (currentPlayer == "black"){
                        if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k")){
                            return false;
                        } else if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && k == 0){
                            k = 1;
                        } else if (k == 1){
                            k = 0;
                            return false;
                        }
                    }
                }
            } else if (endCol > startCol){
                for (let i = startCol+1; i <= endCol; i++){
                    const endPiece = boardState[startRow][i]
                    if (currentPlayer == "white"){
                        if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K")){
                            return false;
                        } else if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k") && k == 0){
                            k = 1;
                        } else if (k == 1){
                            k = 0;
                            return false;
                        }
                    } else if (currentPlayer == "black"){
                        if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k")){
                            return false;
                        } else if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && k == 0){
                            k = 1;
                        } else if (k == 1){
                            k = 0;
                            return false;
                        }
                    }
                } 
            } else if (endCol < startCol){
                for (let i = startCol-1; i >= endCol; i--){
                    const endPiece = boardState[startRow][i]
                    if (currentPlayer == "white"){
                        if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K")){
                            return false;
                        } else if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k") && k == 0){
                            k = 1;
                        } else if (k == 1){
                            k = 0;
                            return false;
                        }
                    } else if (currentPlayer == "black"){
                        if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k")){
                            return false;
                        } else if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && k == 0){
                            k = 1;
                        } else if (k == 1){
                            k = 0;
                            return false;
                        }
                    }
                } 
            }

            k = 0;

            return startRow == endRow || startCol == endCol;
        }
        
    }

    function isValidKnightMove(startRow, startCol, endRow, endCol, endPiece) {
        // Move in an L-shape (two squares in one direction and one square perpendicular)
        if (((currentPlayer == "black") && (endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k")) || ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && (currentPlayer == "white"))){
 
            return false
        } else{

            const rowDiff = Math.abs(startRow - endRow);
            const colDiff = Math.abs(startCol - endCol);
            return (rowDiff == 2 && colDiff == 1) || (rowDiff == 1 && colDiff == 2);
        }

    }

    function isValidBishopMove(startRow, startCol, endRow, endCol, endPiece) {
        // Move diagonally
        if (((currentPlayer == "black") && (endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k")) || ((currentPlayer == "white") && (endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K" || ((startRow == endRow) && (startCol == endCol))))){
            return false
        } else{
            let k = 0;
            if (endRow > startRow && endCol > startCol){ /* If going diagonal bottom right*/
                for (let i = startRow+1; i <= endRow; i++) {
                    for (let j = startCol+1; j <= endCol; j++) {
                        const endPiece = boardState[i][j]
                        if (currentPlayer == "white"){
                            if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                return false;
                            } else if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k") && k == 0 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 1;
                            } else if (k == 1 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 0;
                                return false;
                            }
                        } else if (currentPlayer == "black"){
                            if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k") && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                return false;
                            } else if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && k == 0 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 1;
                            } else if (k == 1 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 0;
                                return false;
                            }
                        }

                    }
                }
            } else if (endRow > startRow && endCol < startCol){ /* If going diagonal bottom left*/
                for (let i = startRow+1; i <= endRow; i++) {
                    for (let j = startCol-1; j >= endCol; j--) {
                        const endPiece = boardState[i][j]
                        if (currentPlayer == "white"){
                            if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                return false;
                            } else if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k") && k == 0 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 1;
                            } else if (k == 1 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 0;
                                return false;
                            }
                        } else if (currentPlayer == "black"){
                            if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k") && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                return false;
                            } else if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && k == 0 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 1;
                            } else if (k == 1 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 0;
                                return false;
                            }
                        }

                    }
                }
            } else if (endRow < startRow && endCol > startCol){ /* If going diagonal top right*/
                for (let i = startRow-1; i >= endRow; i--) {
                    for (let j = startCol+1; j <= endCol; j++) {
                        const endPiece = boardState[i][j]
                        if (currentPlayer == "white"){
                            if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                return false;
                            } else if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k") && k == 0 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 1;
                            } else if (k == 1 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 0;
                                return false;
                            }
                        } else if (currentPlayer == "black"){
                            if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k") && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                return false;
                            } else if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && k == 0 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 1;
                            } else if (k == 1 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 0;
                                return false;
                            }
                        }
                    }
                }
            } else if (endRow < startRow && endCol < startCol){ /* If going diagonal top left*/
                for (let i = startRow-1; i >= endRow; i--) {
                    for (let j = startCol-1; j >= endCol; j--) {
                        const endPiece = boardState[i][j]
                        if (currentPlayer == "white"){
                            if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                return false;
                            } else if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k") && k == 0 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 1;
                            } else if (k == 1 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 0;
                                return false;
                            }
                        } else if (currentPlayer == "black"){
                            if ((endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k") && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                return false;
                            } else if ((endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K") && k == 0 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 1;
                            } else if (k == 1 && Math.abs(i - endRow) == Math.abs(j - endCol)){
                                k = 0;
                                return false;
                            }
                        }
                    }
                }
            }
            k = 0;
            return Math.abs(startRow - endRow) === Math.abs(startCol - endCol);
        }
    }

    function isValidQueenMove(startRow, startCol, endRow, endCol, endPiece) {
        // Move horizontally, vertically, or diagonally
        if ((((currentPlayer == "black") && (endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k")) || ((currentPlayer == "white") && (endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K")) || ((startRow == endRow) && (startCol == endCol)))){
            return false
        } else{
            return isValidRookMove(startRow, startCol, endRow, endCol) || isValidBishopMove(startRow, startCol, endRow, endCol);
        }
    }

    function isValidKingMove(startRow, startCol, endRow, endCol, endPiece) {
        everyPossibleBlackMove = []
        // Go through every cell and if it's a black player, then save the possible moves that player's piece can go to.
        if (currentPlayer == "white"){
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                if (boardState[cell.dataset.row][cell.dataset.col] == "p" || boardState[cell.dataset.row][cell.dataset.col] == "n" || boardState[cell.dataset.row][cell.dataset.col] == "b" || boardState[cell.dataset.row][cell.dataset.col] == "r" || boardState[cell.dataset.row][cell.dataset.col] == "q" || boardState[cell.dataset.row][cell.dataset.col] == "k"){
                    // const cells2 = document.querySelectorAll('.cell');
                    // console.log(boardState[cell.dataset.row][cell.dataset.col])
                    cells.forEach(cell3 => {
                        if(isValidMove(parseInt(cell.dataset.row), parseInt(cell.dataset.col), parseInt(cell3.dataset.row), parseInt(cell3.dataset.col), true)){
                            everyPossibleBlackMove.push(cell)
                        }
                    }       
                    );
            

                }

            })

            const cells4 = document.querySelectorAll('.cell2');
            cells4.forEach(cell => {
                if (boardState[cell.dataset.row][cell.dataset.col] == "p" || boardState[cell.dataset.row][cell.dataset.col] == "n" || boardState[cell.dataset.row][cell.dataset.col] == "b" || boardState[cell.dataset.row][cell.dataset.col] == "r" || boardState[cell.dataset.row][cell.dataset.col] == "q" || boardState[cell.dataset.row][cell.dataset.col] == "k"){
                    cells4.forEach(cell5 => {
                        if (isValidMove(parseInt(cell.dataset.row), parseInt(cell.dataset.col), parseInt(cell5.dataset.row), parseInt(cell5.dataset.col), true)){
                            everyPossibleBlackMove.push(cell)
                        }
                        });
                }    
            });
        }
            // console.log(everyPossibleBlackMove)
        // Move one square in any direction and make sure we can actually move into that tile that is not guarded.
        if ((((currentPlayer == "black") && (endPiece == "p" || endPiece == "n" || endPiece == "b" || endPiece == "r" || endPiece == "q" || endPiece == "k")) || ((currentPlayer == "white") && (endPiece == "P" || endPiece == "N" || endPiece == "B" || endPiece == "R" || endPiece == "Q" || endPiece == "K")) || ((startRow == endRow) && (startCol == endCol)))){
            return false
        } else{
            console.log(everyPossibleBlackMove)
            // everyPossibleBlackMove.forEach(move => {
            //     if (move.dataset.row == 5 && move.dataset.col == 4){
            //         console.log("TEST")
            //     }
            //     if (move.dataset.row == endRow && move.dataset.col == endCol){
            //         return false;
            //     }
            // })
            const rowDiff = Math.abs(startRow - endRow);
            const colDiff = Math.abs(startCol - endCol);
            return (rowDiff <= 1 && colDiff <= 1);        
        }

    }
    });
