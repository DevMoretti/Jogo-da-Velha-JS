class Jogador {
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
    }
}
class Jogada {
    constructor(player, position) {
        this.player = player;
        this.position = position;
    }
}
class JogoDaVelha {
    constructor() {
        this.playerText = document.getElementById("playerText");
        this.restartBtn = document.getElementById("restartBtn");
        this.startBtn = document.getElementById("startBtn");
        this.player1NameInput = document.getElementById("player1-name");
        this.player2NameInput = document.getElementById("player2-name");
        this.player1Display = document.getElementById("player1");
        this.player2Display = document.getElementById("player2");
        this.boxes = Array.from(document.getElementsByClassName("box"));
        this.drawsText = document.getElementById("draws");
        this.historyList = document.getElementById("history-list");
        this.currentPlayer = null;
        this.players = [null, null]; 
        this.spaces = Array(9).fill(null);
        this.winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]
        ];
        this.gameOver = false;
        this.xPoints = 0;
        this.oPoints = 0;
        this.draws = 0;
        this.history = [];
        this.addEventListeners();
}
addEventListeners() {
        this.boxes.forEach(box => box.addEventListener("click", (e) => this.boxClicked(e)));
        this.restartBtn.addEventListener("click", () => this.restartGame());
        this.startBtn.addEventListener("click", () => this.startGame());
}
startGame() {
        const player1Name = this.player1NameInput.value || "Jogador 1";
        const player2Name = this.player2NameInput.value || "Jogador 2";

        this.players[0] = new Jogador(player1Name, "X");
        this.players[1] = new Jogador(player2Name, "O");

        this.currentPlayer = this.players[0];
        this.updatePlayerDisplay();
        this.loadPoints();
        this.playerText.innerText = `É a vez de ${this.currentPlayer.name} (${this.currentPlayer.symbol})`;
}
updatePlayerDisplay() {
        if (this.players[0] && this.players[1]) {
            this.player1Display.innerHTML = `${this.players[0].name} (X) - <span id="x-points">${this.xPoints}</span>`;
            this.player2Display.innerHTML = `${this.players[1].name} (O) - <span id="o-points">${this.oPoints}</span>`;
            this.drawsText.innerText = this.draws;
        }
}

boxClicked(e) {
        if (this.gameOver || !this.currentPlayer) return;

        const id = e.target.id;
        if (!this.spaces[id]) {
            this.spaces[id] = this.currentPlayer.symbol;
            e.target.innerText = this.currentPlayer.symbol;

            if (this.playerHasWon()) {
                this.playerText.innerText = `${this.currentPlayer.name} Ganhou!`;
                this.updateScore();
                this.addHistory(`${this.currentPlayer.name} venceu`);
                this.gameOver = true;
            } else if (this.isDraw()) {
                this.playerText.innerText = "Empate!";
                this.draws++; 
                this.addHistory("Empate");
                this.gameOver = true;
                this.savePoints();
                this.updatePlayerDisplay();
            } else {
                this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
                this.playerText.innerText = `É a vez de ${this.currentPlayer.name} (${this.currentPlayer.symbol})`;
            }
        }
}

playerHasWon() {
        for (const combo of this.winningCombos) {
            const [a, b, c] = combo;
            if (this.spaces[a] && this.spaces[a] === this.spaces[b] && this.spaces[a] === this.spaces[c]) {
                return true;
            }
        }
        return false;
}

isDraw() {
        return this.spaces.every(space => space !== null);
}

updateScore() {
        if (this.currentPlayer.symbol === "X") {
            this.xPoints++;
        } else {
            this.oPoints++;
        }
        this.savePoints();
        this.updatePlayerDisplay();
}

savePoints() {
        localStorage.setItem("xPoints", this.xPoints);
        localStorage.setItem("oPoints", this.oPoints);
        localStorage.setItem("draws", this.draws);
}

loadPoints() {
        this.xPoints = parseInt(localStorage.getItem("xPoints")) || 0;
        this.oPoints = parseInt(localStorage.getItem("oPoints")) || 0;
        this.draws = parseInt(localStorage.getItem("draws")) || 0;
        this.updatePlayerDisplay();
}

addHistory(result) {
        this.history.push(result);
        this.saveHistory();
        this.updateHistoryDisplay();
}

    saveHistory() {
        localStorage.setItem("history", JSON.stringify(this.history));
    }

loadHistory() {
        this.history = JSON.parse(localStorage.getItem("history")) || [];
        this.updateHistoryDisplay();}

updateHistoryDisplay() {
        this.historyList.innerHTML = '';
        this.history.forEach(record => {
            const li = document.createElement('li');
            li.innerText = record;
            this.historyList.appendChild(li);
        });}

restartGame() {
        this.spaces.fill(null);
        this.boxes.forEach(box => box.innerText = "");
        this.playerText.innerText = `JOGO DA VELHA`;
        this.currentPlayer = this.players[0];
        this.gameOver = false;
        this.playerText.innerText = `É a vez de ${this.currentPlayer.name} (${this.currentPlayer.symbol})`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const jogoDaVelha = new JogoDaVelha();
    jogoDaVelha.loadHistory();
    jogoDaVelha.loadPoints();
});
