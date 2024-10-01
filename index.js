const prompt = require("prompt-sync")({ sigint: true });

// Game elements/assets constants
const GRASS = "░";
const HOLE = "O";
const CARROT = "^";
const PLAYER = "*";

// WIN / LOSE / OUT / QUIT messages constants
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[94m';
const RESET = '\x1b[0m';
const WIN = `${GREEN}🎉 👍 You found the carrot!${RESET}`;
const LOST = `${RED}😭 You fell into a hole!${RESET}`;
const OUT = `${RED}😵 You have stepped out of the field!${RESET}`;
const QUIT = `${GREEN}Thank you. You quit the game.${RESET}`;

let ROWS;
let COLS;
const PERCENTAGE = .2;

class Field {
    constructor(field = [[]]) {
        this.field = field;
        this.gamePlay = false;
        this.playerRow = 0;
        this.playerCol = 0;
    }

    static welcomeMsg(msg) {
        console.log(msg);
    }

    static generateField(rows, cols, percentage) {
        const map = [];
        for (let i = 0; i < rows; i++) {
            map[i] = [];
            for (let j = 0; j < cols; j++) {
                map[i][j] = Math.random() > percentage ? GRASS : HOLE;
            }
        }
        return map;
    }

    printField() {
        this.field.forEach(row => console.log(row.join('')));
    }

    updateGame(input) {
        // Quit game if 'q' is pressed
        if (input === 'q') {
            this.quitGame();
            return;
        }
    
        let newRow = this.playerRow;
        let newCol = this.playerCol;
    
        // Move player based on input
        switch (input) {
            case 'w': newRow--; break;
            case 's': newRow++; break;
            case 'a': newCol--; break;
            case 'd': newCol++; break;
            default:
                console.log(`${RED}Invalid key${RESET}`);
                return;
        }
    
        // Check out-of-bounds
        if (newRow < 0 || newCol < 0 || newRow >= ROWS || newCol >= COLS) {
            console.log(OUT);
            this.endGame();
            return;
        }
    
        // Check for carrot
        if (this.field[newRow][newCol] === CARROT) {
            console.log(WIN);
            this.endGame();
            return;
        }
    
        // Check for hole
        if (this.field[newRow][newCol] === HOLE) {
            console.log(LOST);
            this.endGame();
            return;
        }
    
        // Move player on the map
        this.field[this.playerRow][this.playerCol] = GRASS;
        this.field[newRow][newCol] = PLAYER;
        this.playerRow = newRow;
        this.playerCol = newCol;
    }
    

    plantCarrot() {
        const x = Math.floor(Math.random() * ROWS);
        const y = Math.floor(Math.random() * COLS);
        this.field[x][y] = CARROT;
    }

    startGame() {
        this.gamePlay = true;
        this.field[0][0] = PLAYER;
        this.plantCarrot();

        while (this.gamePlay) {
            this.printField();
            console.log(`${GREEN}w(up) | s(down) | a(left) | d(right) | q(quit)${RESET}`);
            const input = prompt('Which way: ');
            this.updateGame(input.toLowerCase());
        }
    }

    endGame() {
        this.gamePlay = false;
        console.log(`${GREEN}Game Over!${RESET}`);
    }

    quitGame() {
        console.log(QUIT);
        this.endGame();
    }

    static fieldSize(text) {
        let num;
        while (true) {
            num = prompt(text);
            if (!isNaN(num) && num >= 5 && num <= 10 && num.trim() !== "") {
                return parseInt(num, 10);
            }
            console.log(`${RED}Invalid! Input must be a number (between 5-10) & no space!${RESET}`);
        }
    }
}

// Prompt user to enter rows and cols (5-10) for field size
ROWS = Field.fieldSize('Enter number of rows: ');
COLS = Field.fieldSize('Enter number of cols: ');

// Instantiate a new instance of Field Class
const createField = Field.generateField(ROWS, COLS, PERCENTAGE);
const gameField = new Field(createField);

Field.welcomeMsg(`${GREEN}Welcome to Find Your Hat!\n**************************************************\n${RESET}`);
gameField.startGame();
