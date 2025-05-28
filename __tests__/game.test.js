import { checkWinner, checkDraw, findBestMove, getCells } from '../src/js/script.js';

const createMockCells = (values) => {
    const cells = [];
    for (let i = 0; i < 9; i++) {
        const cell = {
            textContent: values[i] || '', // Simulasikan textContent dari elemen div
            style: {} // Tambahkan properti style jika fungsi yang diuji memerlukannya
        };
        cells.push(cell);
    }
    return cells;
};

const originalQuerySelectorAll = document.querySelectorAll; // Simpan yang asli

beforeEach(() => {
    document.querySelectorAll = jest.fn((selector) => {
        if (selector === ".cell") {
            return createMockCells([]);
        }
        return originalQuerySelectorAll(selector);
    });
});

afterEach(() => {
    document.querySelectorAll = originalQuerySelectorAll;
});


describe('Game Logic Tests', () => {

    // --- Tes untuk checkWinner ---
    test('checkWinner should return true for a horizontal win by X', () => {
        // Atur mock DOM untuk tes spesifik ini
        document.querySelectorAll.mockImplementation((selector) => {
            if (selector === ".cell") {
                return createMockCells(['X', 'X', 'X', '', '', '', '', '', '']);
            }
            return originalQuerySelectorAll(selector);
        });
        expect(checkWinner()).toBe(true);
    });

    test('checkWinner should return true for a vertical win by O', () => {
        document.querySelectorAll.mockImplementation((selector) => {
            if (selector === ".cell") {
                return createMockCells(['O', '', '', 'O', '', '', 'O', '', '']);
            }
            return originalQuerySelectorAll(selector);
        });
        expect(checkWinner()).toBe(true);
    });

    test('checkWinner should return true for a diagonal win by X', () => {
        document.querySelectorAll.mockImplementation((selector) => {
            if (selector === ".cell") {
                return createMockCells(['X', '', '', '', 'X', '', '', '', 'X']);
            }
            return originalQuerySelectorAll(selector);
        });
        expect(checkWinner()).toBe(true);
    });

    test('checkWinner should return false if no winner', () => {
        document.querySelectorAll.mockImplementation((selector) => {
            if (selector === ".cell") {
                return createMockCells(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', '']);
            }
            return originalQuerySelectorAll(selector);
        });
        expect(checkWinner()).toBe(false);
    });

    // --- Tes untuk checkDraw ---
    test('checkDraw should return true if all cells are filled and no winner', () => {
        document.querySelectorAll.mockImplementation((selector) => {
            if (selector === ".cell") {
                return createMockCells(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']);
            }
            return originalQuerySelectorAll(selector);
        });
        expect(checkDraw()).toBe(true);
    });

    test('checkDraw should return false if there are empty cells', () => {
        document.querySelectorAll.mockImplementation((selector) => {
            if (selector === ".cell") {
                return createMockCells(['X', 'O', 'X', 'O', '', 'O', 'O', 'X', 'X']);
            }
            return originalQuerySelectorAll(selector);
        });
        expect(checkDraw()).toBe(false);
    });

    // --- Tes untuk findBestMove (AI) ---
    test('findBestMove should block opponent (X) if they are about to win', () => {
        // Papan: X X _
        document.querySelectorAll.mockImplementation((selector) => {
            if (selector === ".cell") {
                return createMockCells(['X', 'X', '', '', '', '', '', '', '']);
            }
            return originalQuerySelectorAll(selector);
        });
        const chosenCell = findBestMove();
        expect(chosenCell.textContent).toBe(''); // Sel yang dipilih AI harus kosong
        const expectedCell = createMockCells(['X', 'X', '', '', '', '', '', '', ''])[2];
        expect(chosenCell).toEqual(expectedCell); // Memastikan AI memilih sel yang benar untuk diblokir
    });

    test('findBestMove should choose winning move if available', () => {
        document.querySelectorAll.mockImplementation((selector) => {
            if (selector === ".cell") {
                return createMockCells(['O', 'O', '', '', '', '', '', '', '']);
            }
            return originalQuerySelectorAll(selector);
        });
        const chosenCell = findBestMove();
        expect(chosenCell.textContent).toBe('');
        const expectedCell = createMockCells(['O', 'O', '', '', '', '', '', '', ''])[2];
        expect(chosenCell).toEqual(expectedCell); // Memastikan AI memilih sel yang menang
    });

    test('findBestMove should choose center if available', () => {
        document.querySelectorAll.mockImplementation((selector) => {
            if (selector === ".cell") {
                return createMockCells(['', '', '', '', '', '', '', '', '']);
            }
            return originalQuerySelectorAll(selector);
        });
        const chosenCell = findBestMove();
        expect(chosenCell.textContent).toBe('');
        const expectedCell = createMockCells(['', '', '', '', '', '', '', '', ''])[4]; // Index 4 adalah tengah
        expect(chosenCell).toEqual(expectedCell); // Memastikan AI memilih sel tengah
    });

    test('findBestMove should return a random available cell if no strategic moves', () => {
        document.querySelectorAll.mockImplementation((selector) => {
            if (selector === ".cell") {
                return createMockCells(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', '']);
            }
            return originalQuerySelectorAll(selector);
        });
        const chosenCell = findBestMove();
        expect(chosenCell.textContent).toBe('');
        const expectedCell = createMockCells(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', ''])[8]; // Hanya index 8 yang kosong
        expect(chosenCell).toEqual(expectedCell);
    });

    test('findBestMove should return null if no available cells', () => {
        document.querySelectorAll.mockImplementation((selector) => {
            if (selector === ".cell") {
                return createMockCells(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']);
            }
            return originalQuerySelectorAll(selector);
        });
        const chosenCell = findBestMove();
        expect(chosenCell).toBeNull(); // AI tidak bisa bergerak
    });
});