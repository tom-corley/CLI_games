class Game {
    constructor(p1, p2, rows=6, cols=7) {
        // Assigning players and colours
        this.p1 = p1
        this.p1.setColour("R")
        this.p2 = p2
        this.p2.setColour("Y")
        this.players = [p1, p2]

        // Creating 6 (rows) x 7 (columns) grid and set to keep track of full squares
        this.rows = rows
        this.cols = cols
        this.grid = []
        for (let i = 0; i < this.rows; i++) {
            let r = [];
            for (let j = 0; j < this.cols; j++) {
                r.push(0)
            }
            this.grid.push(r)
        }

        console.log(this.grid);
        this.free_squares = this.grid.length * this.grid[0].length;
        this.full = new Set()

        // 0 for ongoing, 1 for p1 win, 2 for p2 win, 3 for draw (no more squares)
        this.state = 0 
    }

    playGame() {
        let turn = 0
        while (!this.isWinner() && (this.free_squares > 0)) {
            console.log(`\n${this.players[turn].name}'s turn: `);
            ;

            // Player move
            this.playerTurn(this.players[turn])
            //this.printGrid()

            // Swap whose turn it is
            turn = 1 - turn;
        }

        this.finaliseGame()
    }

    playerTurn(player) {
        if (player.type == 0) {
            this.humanTurn(player)
        } else {
            this.computerTurn(player); 
        }
    }

    humanTurn(player) {
        ; // Get user input until he picks a valid square, likely to have callbacks
    }

    computerTurn(player) {
        // JS doesnt have tuples so stringigy
        while (true) {
            let row = Math.floor(6 * Math.random());
            let col = Math.floor(7 * Math.random());
            let coord = row+","+col

            if (!this.full.has(coord)) {
                console.log(`Accepted co-ordinates: ${row},${col}`);
                this.placeCounter(player, coord)
                break;
            }
        }
    }

    placeCounter(player, coord) {
        this.full.add(coord)
        this.grid[coord[0]][coord[2]] = player.colour   
        this.free_squares -= 1;
        console.log(this.free_squares);
        if (this.free_squares == 0) {
            this.state = 3;
        }
    }
    // Warwick Wellbeing team:  02476 575570

    finaliseGame() {
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
    }

    printGrid() {
        console.log(this.grid);; // Nice formatted printing of grid
    }

    isWinner() { 
        // Check each row, check each diagonal, check each column
        //  return true and update state to winner if connected 4 is found
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
