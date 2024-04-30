//TODO: Générer les div par le JS et laisser uniquement la div game,
//TODO: Les alertes doivent-être afficher dans la page et non par une alerte.
//TODO: Gérer le bug des couleur du player lorsque je undo.

class Puissance4 {

    constructor(element_id, rows=6, cols=7) {
        this.rows = rows;
        this.cols = cols;
        this.board = Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            this.board[i] = Array(this.cols).fill(0);
        }

        this.player1Score = 0;
        this.player2Score = 0;

        localStorage.setItem('player1', this.player1Score);
        localStorage.setItem('player2', this.player2Score);
        this.scoreElement = document.querySelector('#score');
        this.turn = 1;
        this.moves = 0;
        this.winner = null;
        this.history = [];
        this.element = document.querySelector(element_id);

        this.resetElement = document.querySelector('#reset');
        this.undoMoveElement = document.querySelector('#undo-move');
        this.currentPlayerElement = document.querySelector('#get-current-player');
        this.countPlayerMoveElement = document.querySelector('#count-move');
        this.bgColorCurrentPlayer = document.querySelector('#bg-color-current-player');

        this.element.addEventListener('click', (event) => this.handle_click(event));
        this.undoMoveElement.addEventListener('click', (event) => this.undoMove(event));

        this.resetElement.addEventListener('click', (event) => {
            event.preventDefault();
            this.reset();
            this.render();
        })

        this.render();
    }

    render() {
        let table = document.createElement('table');
        for (let i = this.rows - 1; i >= 0; i--) {
            let tr = table.appendChild(document.createElement('tr'));
            for (let j = 0; j < this.cols; j++) {
                let td = tr.appendChild(document.createElement('td'));
                let colour = this.board[i][j];
                if (colour)
                    td.className = 'player' + colour + ' falling-piece';
                td.dataset.column = j;
            }
        }
        this.element.innerHTML = '';
        this.element.appendChild(table);
        this.currentPlayerElement.innerText = "Player => " + this.turn;
        this.scoreElement.innerHTML = `Total Win [Player 1]: ${localStorage.getItem('player1')} - [Player 2]: ${localStorage.getItem('player2')}`;
    }

    set(row, column, player) {
        this.currentPlayerElement.style.color = this.turn == 1 ? 'orange' : 'red';
        this.board[row][column] = player;
        this.moves++;
    }

    play(column) {
        let row;
        for (let i = 0; i < this.rows; i++) {
            if (this.board[i][column] == 0) {
                row = i;
                break;
            }
        }
        if (row === undefined) {
            return null;
        } else {
            this.set(row, column, this.turn);
            this.history.push({ row, column, player: this.turn });
            return row;
        }
    }

    undoMove() {
        if (this.moves === 0 || this.history.length === 0) {
            return;
        }

        let lastMove = this.history.pop();

        this.board[lastMove.row][lastMove.column] = 0;
        this.moves--;
        this.turn = 3 - this.turn;
        this.render();
    }

    handle_click(event) {
        if (this.winner !== null) {
            if (window.confirm("Game over!\n\nDo you want to restart? player"+this.winner + " won !!")) {
                this.reset();
                this.render();
            }
            return;
        }

        let column = event.target.dataset.column;
        if (column !== undefined) {
            column = parseInt(column);
            let row = this.play(parseInt(column));

            if (row === null) {
                window.alert("Column is full!");
            } else {
                if (this.win(row, column, this.turn)) {
                    this.winner = this.turn;
                } else if (this.moves >= this.rows * this.columns) {
                    this.winner = 0;
                }
                this.turn = 3 - this.turn;

                switch (this.winner) {
                    case 0:
                        window.alert("Null game!!");
                        break;
                    case 1:
                        localStorage.setItem('player1', parseInt(localStorage.getItem('player1')) + 1);
                        window.alert("Player 1 wins");
                        break;
                    case 2:
                        localStorage.setItem('player2', parseInt(localStorage.getItem('player2')) + 1);
                        window.alert("Player 2 wins");
                        break;
                }

                this.render()
            }
        }
    }

    win(row, column, player) {
        // Horizontal
        let count = 0;
        for (let j = 0; j < this.cols; j++) {
            count = (this.board[row][j] == player) ? count+1 : 0;
            if (count >= 4) return true;
        }
        // Vertical
        count = 0;
        for (let i = 0; i < this.rows; i++) {
            count = (this.board[i][column] == player) ? count+1 : 0;
            if (count >= 4) return true;
        }
        // Diagonal
        count = 0;
        let shift = row - column;
        for (let i = Math.max(shift, 0); i < Math.min(this.rows, this.cols + shift); i++) {
            count = (this.board[i][i - shift] == player) ? count+1 : 0;
            if (count >= 4) return true;
        }
        // Anti-diagonal
        count = 0;
        shift = row + column;
        for (let i = Math.max(shift - this.cols + 1, 0); i < Math.min(this.rows, shift + 1); i++) {
            count = (this.board[i][shift - i] == player) ? count+1 : 0;
            if (count >= 4) return true;
        }

        return false;
    }

    reset() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = 0;
            }
        }
        this.move = 0;
        this.winner = null;
    }
}

let p4 = new Puissance4('#game', 8, 8);