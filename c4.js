const readline = require('readline')
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

        // Creating 6 (rows) x 7 (columns) grid and set to keep track of full squares
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

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // 0 for ongoing, 1 for p1 win, 2 for p2 win, 3 for draw (no more squares)
        this.state = 0 
        this.printGrid()
    }

    async playGame() {
        let turn = 0
        while (!this.isWinner() && (this.free_squares > 0) && this.roundCount < this.roundLimit) {
            this.roundCount++;

            console.log(`\nRound: ${this.roundCount}, ${this.players[turn].name}'s turn: `);
            ;

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
        if (player.type == 0) {
            await this.humanTurn(player)
        } else {
            this.computerTurn(player); 
        }
    }

    async humanTurn(player) {
        // Get user input until he picks a valid square, likely to have callbacks
        let user_input;
        while (!isValidColumn(parseInt(user_input))) {
            user_input = await this.rl.question(
                `Enter a column from ${0} to ${this.cols}`,
                answer => resolve(answer)
            )
        }
        this.placeCounter(player, user_input);
    }

    isValidColumn(col) {
        if (col === NaN) {
            console.log("Error: Not a number.");
            return false
        } else if (col < 0 || col >= this.cols) {
            console.log(`Error: Not a valid column, enter a number from ${0} to ${this.cols-1}.`);
            return false;
        } else  if (!this.col_capacity[col]) {
            console.log(`Error: This column is already full, choose another.`);
            return false;
        } else {return true;}
    }

    computerTurn(player) {
        // JS doesnt have tuples so stringigy
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
        this.grid[this.col_capacity[col]-1][col] = player.colour   
        this.col_capacity[col] -= 1
        this.free_squares -= 1;
        if (this.free_squares == 0) {
            this.state = 3;
        }
    }
    // Warwick Wellbeing team:  02476 575570

    finaliseGame() {
        console.log(`Spaces left: ${this.free_squares}`);
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
        this.rl.close()
    }

    printGrid() {
        let str_grid = ""
        let edge = "-".repeat(4*this.cols+1)+"\n"
        str_grid += edge
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
        console.log(str_grid);; // Nice formatted printing of grid
    }

    isWinner() {
        return (this.rowWinner() || this.colWinner() || this.diagWinner())
    }

    rowWinner() { 
        // Check each row, check each diagonal, check each column
        //  return true and update state to winner if connected 4 is found
        // Two pointers approach to rows, loop for each row
        for (let i = 0; i < this.rows; i++) {
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
        for (let i = 0; i < this.cols; i++) {
            //console.log(`Column ${i}`);
            let l = 0;
            let colour;
            while (l < this.rows) {
                // If space is empty, skip to next
                if (this.grid[l][i] === " ") {
                    l += 1
                    continue;
                }

                // Otherwise proceed while direction is same, using the second pointer
                //console.log(`Col: ${i}, checking for strip.`);
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
        return false;
    }

    diagWinner() {
        return false;
    }
}

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

class HumanPlayer extends Player {
    constructor(name) {
        super(name)
    }
}

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
const red = new ComputerPlayer()
const yellow = new ComputerPlayer()
const game = new Game(red, yellow)
game.playGame()
// */
