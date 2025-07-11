// Required import for user input
const readline = require('readline')

// Game class
class Game {
    constructor(p1 = new ComputerPlayer(), p2= new ComputerPlayer(), rows=6, cols=7, win_req=4) {
        // Assigning players and colours
        this.p1 = p1
        this.p1.setColour("R")
        this.p2 = p2
        this.p2.setColour("Y")
        this.players = [p1, p2]
        this.win_req = win_req
        this.roundCount = 0;
        this.roundLimit = 1000;

        // Creating grid and column capacity and free_squares
        this.rows = rows
        this.cols = cols
        this.grid = []
        for (let i = 0; i < this.rows; i++) {
            let r = [];
            for (let j = 0; j < this.cols; j++) {
                r.push(" ")
            }
            this.grid.push(r)
        }
        this.col_capacity = [];
        for (let i = 0; i < this.cols; i++) {
            this.col_capacity.push(this.rows)
        }
        this.free_squares = this.grid.length * this.grid[0].length;

        // Setting up input interface
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // initialising game state: 0 for ongoing, 1 for p1 win, 2 for p2 win, 3 for draw (no more squares)
        this.state = 0
        
        // Printing blank grid to console
        this.printGrid()
    }

    async playGame() {
        // Give player 1 first turn
        let turn = 0
        while (!this.isWinner() && (this.free_squares > 0) && this.roundCount < this.roundLimit) {
            // Increment round count and output information to console
            this.roundCount++;
            console.log(`\nRound: ${this.roundCount}, ${this.players[turn].name}'s turn: `);

            // Player move
            await this.playerTurn(this.players[turn])
            this.printGrid()

            // Swap whose turn it is
            turn = 1 - turn;
            //console.log(`Turn set to ${turn}`);
        }

        this.finaliseGame()
    }

    async playerTurn(player) {
        // Based on player type call the humanTurn or computerTurn method
        if (player.type == 0) {
            await this.humanTurn(player)
        } else {
            await this.computerTurn(player); 
        }
    }

    async humanTurn(player) {
        // Keep trying user input until user inputs a valid column, short circuit skips first valid column check
        let col;
        let sc = true;
        while (sc || !this.isValidColumn(parseInt(col))) {
            sc = false;
            col = await this.getUserColumn()
        }

        // Place counter in the validated inputted column
        this.placeCounter(player, col);
    }

    async getUserColumn() {
        // Promise logic to get user input
        return new Promise((resolve) => {
            this.rl.question(
                `Enter a column from ${0} to ${this.cols}: `,
                (answer) => {resolve(answer)
            
            })
        })
    }

    isValidColumn(col) {
        // Fist check if parseInt failed
        if (col === NaN) {
            console.log("Error: Not a number.");
            return false
        // Then if the number is in the required range
        } else if (col < 0 || col >= this.cols) {
            console.log(`Error: Not a valid column, enter a number from ${0} to ${this.cols-1}`);
            return false;
        // Then if there are still spaces in that column
        } else  if (!this.col_capacity[col]) {
            console.log(`Error: This column is already full, choose another.`);
            return false;
        // If passes all above, good to place a counter
        } else {return true;}
    }

    async computerTurn(player) {
        // Simulate thinking time
        await this.sleep(1000)

        // Choose random column until one has enough space
        while (true) {
            let col = Math.floor(this.cols * Math.random());
            if (this.col_capacity[col]) {
                console.log(`Accepted column: ${col}`);
                this.placeCounter(player, col)
                break;
            }
        }
    }

    placeCounter(player, col) {
        // Update grid, column capacity, and number of free squares
        this.grid[this.col_capacity[col]-1][col] = player.colour   
        this.col_capacity[col] -= 1
        this.free_squares -= 1;

        // Check for draw
        if (this.free_squares == 0) {
            this.state = 3;
        }
    }

    finaliseGame() {
        // Print closing message
        let end_str = "Game Finished: "
        if (this.state == 0) {
            throw "Game ended prematurely";
        } else if (this.state == 1) {
            end_str += "Player 1 wins!!!"
        } else if (this.state == 2) {
            end_str += "Player 2 wins!!!"
        } else {
            end_str += "Draw!!!"
        }
        console.log(end_str);

        // Close user input interface
        this.rl.close()
    }

    printGrid() {
        // Create top row structure
        let str_grid = ""
        let edge = "-".repeat(4*this.cols+1)+"\n"
        str_grid += edge

        // Create each row then an edge
        for (let i = 0; i < this.rows; i++) {
            let str_row = "| "
            for (let j = 0; j < this.cols; j++) {
                str_row += this.grid[i][j] 
                str_row += " | "
            }
            str_grid += str_row
            str_grid += "\n"
            str_grid += edge 
        }

        // Print Final grid
        console.log(str_grid);; // Nice formatted printing of grid
    }

    isWinner() {
        // Check for 4 horizontally, vertically, or diagonally
        return (this.rowWinner() || this.colWinner() || this.diagWinner())
    }

    rowWinner() { 
        // Loop through each row
        for (let i = 0; i < this.rows; i++) {
            // Two pointers approach for each row
            let l = 0;
            let colour;
            while (l < this.cols) {
                // If space is empty, skip to next
                if (this.grid[i][l] === " ") {
                    l += 1
                    continue;
                }

                // Otherwise proceed while direction is same, using the second pointer
                colour = this.grid[i][l]
                let strip_len = 1
                let r = l + 1
                while (r < this.grid[0].length && this.grid[i][r] === colour) {
                    strip_len += 1
                    //console.log(strip_len);
                    r += 1
                }

                // Report win if necessary
                if (strip_len == 4) {
                    console.log(`Winning Row: ${i}`);
                    if (colour == "R") {
                        this.state = 1
                    }
                    else {
                        this.state = 2
                    }
                    return true;
                }

                // Otherwise set left pointer to right pointer
                l = r
            }
        }
        return false;
    }

    colWinner() {
        // Loop through columns
        for (let i = 0; i < this.cols; i++) {
            // Two pointer approach on each column
            let l = 0;
            let colour;
            while (l < this.rows) {
                // If space is empty, skip to next
                if (this.grid[l][i] === " ") {
                    l += 1
                    continue;
                }

                // Otherwise proceed while direction is same, using the second pointer
                colour = this.grid[l][i]
                let strip_len = 1
                let r = l + 1
                while (r < this.rows && this.grid[r][i] === colour) {
                    strip_len += 1
                    r += 1
                }

                // Report win if necessary
                if (strip_len == 4) {
                    console.log(`Winning Column: ${i}`);
                    if (colour == "R") {
                        this.state = 1
                    }
                    else {
                        this.state = 2
                    }
                    return true;
                }

                // Otherwise set left pointer to right pointer
                l = r
            }
        }
        // Default behaviour, no 4 vertically found
        return false;
    }

    diagWinner() {
        // TODO
        return false;
    }

    async sleep(ms) {
        // To simulate computer "thinking"
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// General Player Class
class Player {
    constructor(name) {
        this.type = 0;
        this.name = name;
        this.colour = "";
    }

    setColour(colour) {
        this.colour = colour;
    }
}

// Human Player Class
class HumanPlayer extends Player {
    constructor(name) {
        super(name)
    }
}

// Computer Player Class
class ComputerPlayer extends Player {
    static instances = 0;
    constructor() {
        ComputerPlayer.instances += 1
        super("Computer("+ComputerPlayer.instances+")")
        this.type = 1;
    }
}

// Testing game
// /*
const red = new HumanPlayer("Tom")
const yellow = new ComputerPlayer()
const game = new Game(red, yellow)
game.playGame()
// */
