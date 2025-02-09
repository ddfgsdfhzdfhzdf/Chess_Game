class Piece {
    constructor(color) {
        this.color = color;
    }

    isValidMove(board, start, end) {
        throw new Error("This method should be implemented by subclasses");
    }
}

class King extends Piece {
    constructor(color) {
        super(color);
        this.symbol = color === 'white' ? '♔' : '♚';
    }

    isValidMove(board, start, end) {
        return Math.abs(start[0] - end[0]) <= 1 && Math.abs(start[1] - end[1]) <= 1;
    }
}

class Queen extends Piece {
    constructor(color) {
        super(color);
        this.symbol = color === 'white' ? '♕' : '♛';
    }

    isValidMove(board, start, end) {
        return this.isValidDiagonalMove(board, start, end) || this.isValidStraightMove(board, start, end);
    }

    isValidDiagonalMove(board, start, end) {
        return Math.abs(start[0] - end[0]) === Math.abs(start[1] - end[1]);
    }

    isValidStraightMove(board, start, end) {
        return start[0] === end[0] || start[1] === end[1];
    }
}

class Bishop extends Piece {
    constructor(color) {
        super(color);
        this.symbol = color === 'white' ? '♗' : '♝';
    }

    isValidMove(board, start, end) {
        return this.isValidDiagonalMove(board, start, end);
    }

    isValidDiagonalMove(board, start, end) {
        return Math.abs(start[0] - end[0]) === Math.abs(start[1] - end[1]);
    }
}

class Knight extends Piece {
    constructor(color) {
        super(color);
        this.symbol = color === 'white' ? '♘' : '♞';
    }

    isValidMove(board, start, end) {
        return (Math.abs(start[0] - end[0]), Math.abs(start[1] - end[1])) in [[1, 2], [2, 1]];
    }
}

class Rook extends Piece {
    constructor(color) {
        super(color);
        this.symbol = color === 'white' ? '♖' : '♜';
    }

    isValidMove(board, start, end) {
        return this.isValidStraightMove(board, start, end);
    }

    isValidStraightMove(board, start, end) {
        return start[0] === end[0] || start[1] === end[1];
    }
}

class Pawn extends Piece {
    constructor(color) {
        super(color);
        this.symbol = color === 'white' ? '♙' : '♟';
    }

    isValidMove(board, start, end) {
        const direction = this.color === 'white' ? 1 : -1;
        if (start[0] + direction === end[0] && start[1] === end[1]) {
            return true;
        }
        if (start[0] + direction === end[0] && Math.abs(start[1] - end[1]) === 1 && board[end[0]][end[1]] !== null) {
            return true;
        }
        return false;
    }
}

class Board {
    constructor() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.setupPieces();
    }

    setupPieces() {
        for (let i = 0; i < 8; i++) {
            this.board[1][i] = new Pawn('white');
            this.board[6][i] = new Pawn('black');
        }

        const placement = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

        for (let i = 0; i < 8; i++) {
            this.board[0][i] = new placement[i]('white');
            this.board[7][i] = new placement[i]('black');
        }
    }

    movePiece(start, end) {
        const piece = this.board[start[0]][start[1]];
        if (piece && piece.isValidMove(this.board, start, end)) {
            this.board[end[0]][end[1]] = piece;
            this.board[start[0]][start[1]] = null;
            return true;
        }
        return false;
    }

    display() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const square = document.createElement('div');
                square.classList.add('square', (r + c) % 2 === 0 ? 'white' : 'black');
                if (this.board[r][c]) {
                    square.textContent = this.board[r][c].symbol;
                }
                boardElement.appendChild(square);
            }
        }
    }
}

class Game {
    constructor() {
        this.board = new Board();
        this.turn = 'white';
        this.selectedPiece = null;
        this.init();
    }

    init() {
        this.board.display();
        this.addEventListeners();
    }

    addEventListeners() {
        const boardElement = document.getElementById('board');
        boardElement.addEventListener('click', (event) => {
            const index = Array.from(boardElement.children).indexOf(event.target);
            const row = Math.floor(index / 8);
            const col = index % 8;

            if (this.selectedPiece) {
                const [startRow, startCol] = this.selectedPiece;
                if (this.board.movePiece([startRow, startCol], [row, col])) {
                    this.switchTurn();
                } else {
                    alert('Invalid move, try again.');
                }
                this.selectedPiece = null;
            } else {
                if (this.board.board[row][col] && this.board.board[row][col].color === this.turn) {
                    this.selectedPiece = [row, col];
                }
            }

            this.board.display();
        });
    }

    switchTurn() {
        this.turn = this.turn === 'white' ? 'black' : 'white';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
