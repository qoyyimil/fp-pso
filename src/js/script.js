// --- BAGIAN GLOBAL DAN FUNGSI YANG DI-EXPORT UNTUK PENGUJIAN ---

// Variabel state game yang akan diakses dan dimodifikasi oleh fungsi-fungsi
// yang diekspor maupun oleh DOMContentLoaded.
// Variabel ini perlu diekspor agar dapat diakses/diatur ulang oleh Jest di test.
export let currentPlayer = "X";
export let gameOver = false;
export let scoreX = 0;
export let scoreO = 0;
export let gameMode = 'playerVsComputer';

// Helper untuk mendapatkan semua elemen sel dari DOM.
// Fungsi ini perlu di-mock di test environment karena berinteraksi dengan DOM.
export function getCells() {
    return Array.from(document.querySelectorAll(".cell"));
}

// Fungsi yang menguji apakah ada pemenang.
// Fungsi ini di-export agar dapat diuji oleh Jest.
// Fungsi ini HANYA mengembalikan boolean (true/false) dan TIDAK melakukan update DOM atau skor.
export function checkWinner() {
    const cells = getCells(); // Menggunakan helper getCells
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Baris
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Kolom
        [0, 4, 8], [2, 4, 6]             // Diagonal
    ];

    for (const combo of winCombinations) {
        const [a, b, c] = combo;
        if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[b].textContent === cells[c].textContent) {
            // Logika highlight dan update skor TIDAK di sini.
            // Ini akan ditangani oleh DOMContentLoaded berdasarkan hasil return `true`.
            return true;
        }
    }
    return false;
}

// Fungsi yang menguji apakah permainan seri.
// Fungsi ini di-export agar dapat diuji oleh Jest.
export function checkDraw() {
    const cells = getCells(); // Menggunakan helper getCells
    for (const cell of cells) {
        if (cell.textContent === "") {
            return false; // Ada sel kosong, bukan seri
        }
    }
    return true; // Semua sel terisi dan tidak ada pemenang
}

// Fungsi AI komputer.
// Fungsi ini di-export agar dapat diuji oleh Jest.
// Fungsi ini mengembalikan elemen DOM (cell) yang harus dipilih oleh AI.
export function findBestMove() {
    const cells = getCells(); // Menggunakan helper getCells

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
    if (availableCells.length > 0) {
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }
    return null; // Tidak ada sel kosong
}


// --- BAGIAN DOMContentLoaded (Interaksi dengan HTML dan Modifikasi State Game) ---
document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("game-board");
    const gameOverMessage = document.getElementById("game-over-message");
    const restartButton = document.getElementById("restart-button");
    const resetScoreButton = document.getElementById("reset-score-button");

    // Variabel state game yang di-export di atas, digunakan di sini.
    // JANGAN deklarasikan ulang dengan 'let' di sini.
    // Misal, baris di bawah ini harus DIHAPUS:
    // let currentPlayer = "X";
    // let gameOver = false;
    // let scoreX = 0;
    // let scoreO = 0;
    // let gameMode = 'playerVsComputer';

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
        // Mengakses variabel global yang di-export (currentPlayer, gameOver, gameMode)
        if (gameOver || event.target.textContent !== "") {
            return;
        }

        if (gameMode === 'playerVsComputer' && currentPlayer === "O") {
            return;
        }

        event.target.textContent = currentPlayer; // Tempatkan simbol pemain saat ini

        // Panggil checkWinner dari fungsi yang sudah diekspor
        if (checkWinner()) { // checkWinner() sekarang mengembalikan boolean murni
            gameOverMessage.textContent = `${currentPlayer} wins!`;
            gameOverMessage.style.display = "block";
            gameOver = true; // Update global gameOver
            animateWinner();
            // --- LOGIKA UPDATE SKOR DI SINI ---
            if (currentPlayer === 'X') {
                scoreX++;
            } else {
                scoreO++;
            }
            updateScoreDisplay(); // Perbarui tampilan skor setelah kemenangan
            return; // Penting: keluar setelah pemenang ditemukan
        }

        // Panggil checkDraw dari fungsi yang sudah diekspor
        if (checkDraw()) { // checkDraw() sekarang mengembalikan boolean murni
            gameOverMessage.textContent = "It's a draw!";
            gameOverMessage.style.display = "block";
            gameOver = true; // Update global gameOver
            restartButton.style.display = "block";
            return; // Penting: keluar setelah seri
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
        // Panggil findBestMove dari fungsi yang sudah diekspor
        const chosenCell = findBestMove(); // findBestMove mengembalikan elemen div langsung
        if (chosenCell) { // Pastikan ada sel yang ditemukan (bisa null jika papan penuh)
            chosenCell.textContent = "O"; // Komputer bermain sebagai O

            // Setelah komputer bergerak, cek pemenang atau seri lagi
            if (checkWinner()) {
                gameOverMessage.textContent = "O wins!";
                gameOverMessage.style.display = "block";
                gameOver = true;
                animateWinner();
                // Update skor untuk komputer
                scoreO++; // Karena komputer adalah O
                updateScoreDisplay();
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

    // Fungsi restartGame() yang dipanggil oleh tombol "Play Again"
    // window.restartGame tetap di sini karena dipanggil langsung dari HTML (onclick)
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
    // window.resetScores tetap di sini karena dipanggil langsung dari HTML (onclick)
    window.resetScores = function () {
        scoreX = 0;
        scoreO = 0;
        updateScoreDisplay(); // Perbarui tampilan skor setelah reset
        restartGame(); // Juga restart game setelah reset skor
    };

    // Event listener untuk pilihan mode
    vsComputerRadio.addEventListener('change', () => {
        gameMode = 'playerVsComputer'; // Update global gameMode
        restartGame(); // Reset game saat mode berubah
    });

    vsPlayerRadio.addEventListener('change', () => {
        gameMode = 'playerVsPlayer'; // Update global gameMode
        restartGame(); // Reset game saat mode berubah
    });

    // Event listener untuk tombol reset skor
    if (resetScoreButton) {
        resetScoreButton.addEventListener('click', resetScores);
    }

    // Inisialisasi papan saat DOM siap
    initializeBoard();
});