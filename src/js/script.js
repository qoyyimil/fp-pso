document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("game-board");
    const gameOverMessage = document.getElementById("game-over-message");
    const restartButton = document.getElementById("restart-button");
    const resetScoreButton = document.getElementById("reset-score-button"); // Elemen baru untuk reset skor

    let currentPlayer = "X";
    let gameOver = false;
    let scoreX = 0;
    let scoreO = 0;
    let gameMode = 'playerVsComputer'; // Default mode: player vs computer

    const scoreXElement = document.getElementById("scoreX");
    const scoreOElement = document.getElementById("scoreO");
    const vsComputerRadio = document.getElementById('vsComputer');
    const vsPlayerRadio = document.getElementById('vsPlayer');

    // Fungsi untuk mengupdate tampilan skor di HTML
    function updateScoreDisplay() {
        scoreXElement.textContent = scoreX;
        scoreOElement.textContent = scoreO;
    }

    // Inisialisasi papan permainan
    function initializeBoard() {
        board.innerHTML = ''; // Hapus sel lama
        for (let i = 0; i < 9; i++) {
            board.appendChild(createCell());
        }
        updateScoreDisplay(); // Pastikan skor ditampilkan saat inisialisasi
    }

    function createCell() {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", handleCellClick);
        return cell;
    }

    function handleCellClick(event) {
        // Jika game sudah berakhir atau sel sudah terisi, jangan lakukan apa-apa
        if (gameOver || event.target.textContent !== "") {
            return;
        }

        // Untuk mode 'playerVsComputer', pastikan hanya player X yang bisa klik (awal giliran)
        // Giliran O (komputer) akan dihandle oleh computerMove.
        // Jika currentPlayer adalah 'O' di mode komputer, berarti giliran komputer, jangan izinkan klik manual.
        if (gameMode === 'playerVsComputer' && currentPlayer === "O") {
            return;
        }

        event.target.textContent = currentPlayer; // Tempatkan simbol pemain saat ini

        if (checkWinner()) {
            gameOverMessage.textContent = `${currentPlayer} wins!`;
            gameOverMessage.style.display = "block";
            gameOver = true;
            animateWinner();
            // Tombol restart akan muncul secara otomatis setelah gameOver menjadi true
            return;
        }

        if (checkDraw()) {
            gameOverMessage.textContent = "It's a draw!";
            gameOverMessage.style.display = "block";
            gameOver = true;
            restartButton.style.display = "block";
            return;
        }

        // Pergantian Giliran
        if (gameMode === 'playerVsComputer') {
            currentPlayer = "O"; // Ganti ke giliran komputer
            if (!gameOver) { // Pastikan tidak memanggil computerMove jika game sudah berakhir
                setTimeout(computerMove, 500);
            }
        } else { // gameMode === 'playerVsPlayer'
            currentPlayer = currentPlayer === "X" ? "O" : "X"; // Ganti pemain (X menjadi O, O menjadi X)
        }
    }

    function computerMove() {
        const cells = document.querySelectorAll(".cell");
        let availableCells = [];

        cells.forEach((cell) => {
            if (cell.textContent === "") {
                availableCells.push(cell);
            }
        });

        if (availableCells.length > 0) {
            const bestMove = findBestMove();
            bestMove.textContent = "O"; // Komputer selalu bermain sebagai O

            if (checkWinner()) {
                gameOverMessage.textContent = "O wins!";
                gameOverMessage.style.display = "block";
                gameOver = true;
                animateWinner();
                restartButton.style.display = "block";
            } else {
                currentPlayer = "X"; // Kembali ke giliran pemain (X)
            }

            if (checkDraw() && !gameOver) { // Pastikan tidak ada pemenang sebelum menyatakan seri
                gameOverMessage.textContent = "It's a draw!";
                gameOverMessage.style.display = "block";
                gameOver = true;
                restartButton.style.display = "block";
            }
        }
    }

    function checkWinner() {
        const cells = document.querySelectorAll(".cell");

        const winCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Baris
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Kolom
            [0, 4, 8], [2, 4, 6]             // Diagonal
        ];

        for (const combo of winCombinations) {
            const [a, b, c] = combo;
            if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[b].textContent === cells[c].textContent) {
                highlightWinner(cells[a], cells[b], cells[c]);
                // Update skor
                if (cells[a].textContent === 'X') {
                    scoreX++;
                } else { // cells[a].textContent === 'O'
                    scoreO++;
                }
                updateScoreDisplay(); // Perbarui tampilan skor
                return true;
            }
        }
        return false;
    }

    function highlightWinner(cellA, cellB, cellC) {
        cellA.style.backgroundColor = "#8bc34a";
        cellB.style.backgroundColor = "#8bc34a";
        cellC.style.backgroundColor = "#8bc34a";
    }

    function animateWinner() {
        const winningCells = document.querySelectorAll(".cell[style*='background-color: rgb(139, 195, 74)']");

        winningCells.forEach(cell => {
            cell.style.transition = "transform 0.5s ease-in-out";
            cell.style.transform = "scale(1.2)";
        });
    }

    function checkDraw() {
        const cells = document.querySelectorAll(".cell");
        for (const cell of cells) {
            if (cell.textContent === "") {
                return false; // Ada sel kosong, bukan seri
            }
        }
        return true; // Semua sel terisi dan tidak ada pemenang
    }

    function findBestMove() {
        const cells = document.querySelectorAll(".cell");

        const winCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        // 1. Cek apakah komputer bisa menang
        for (const combo of winCombinations) {
            const [a, b, c] = combo;
            const combination = [cells[a], cells[b], cells[c]];
            if (combination.filter(cell => cell.textContent === "O").length === 2 && combination.some(cell => cell.textContent === "")) {
                return combination.find(cell => cell.textContent === "");
            }
        }

        // 2. Cek apakah pemain bisa menang (dan blokir)
        for (const combo of winCombinations) {
            const [a, b, c] = combo;
            const combination = [cells[a], cells[b], cells[c]];
            if (combination.filter(cell => cell.textContent === "X").length === 2 && combination.some(cell => cell.textContent === "")) {
                return combination.find(cell => cell.textContent === "");
            }
        }

        // 3. Ambil pusat jika kosong
        const center = cells[4];
        if (center.textContent === "") {
            return center;
        }

        // 4. Pilih sel kosong secara acak sebagai fallback
        const availableCells = Array.from(cells).filter(cell => cell.textContent === "");
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    // Fungsi restartGame() yang dipanggil oleh tombol "Play Again"
    window.restartGame = function () {
        currentPlayer = "X"; // Selalu mulai dengan X
        gameOver = false;
        gameOverMessage.style.display = "none";
        
        // Reset warna sel dan teks
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.textContent = "";
            cell.style.backgroundColor = "#f9f9f9"; // Warna default
            cell.style.transform = "scale(1)"; // Reset animasi kemenangan
            cell.style.transition = ""; // Hapus transisi animasi
        });
    };

    // Fungsi untuk mereset skor
    window.resetScores = function () { // Dibuat global agar bisa diakses dari onclick di HTML
        scoreX = 0;
        scoreO = 0;
        updateScoreDisplay(); // Perbarui tampilan skor setelah reset
        restartGame(); // Juga restart game setelah reset skor
    };

    // Event listener untuk pilihan mode
    vsComputerRadio.addEventListener('change', () => {
        gameMode = 'playerVsComputer';
        restartGame(); // Reset game saat mode berubah
    });

    vsPlayerRadio.addEventListener('change', () => {
        gameMode = 'playerVsPlayer';
        restartGame(); // Reset game saat mode berubah
    });

    // Event listener untuk tombol reset skor
    if (resetScoreButton) { // Pastikan tombol ada sebelum menambahkan event listener
        resetScoreButton.addEventListener('click', resetScores);
    }

    // Inisialisasi papan saat DOM siap
    initializeBoard();
});