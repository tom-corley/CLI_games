class Game {
    constructor(p1, p2) {
        // Assigning players
        this.p1 = p1
        this.p2 = p2
        this.players = [p1, p2]

        // Creating 6 (rows) x 7 (columns) grid and set to keep track of full squares
        this.grid = []
        for (let i = 0; i < 6; i++) {
            this.grid.push([0,0,0,0,0,0,0])
        }
        this.free_squares = 42;
        this.full = new Set()

        // 0 for ongoing, 1 for p1 win, 2 for p2 win, 3 for draw (no more squares)
        this.state = 0 
    }

    playGame() {
        let turn = 0
        while (!this.isWinner() && (this.free_squares > 0)) {
            // Some output to user
            ;

            // Player move
            this.playerTurn(this.players[turn])
            this.printGrid()

            // Swap whose turn it is
            turn = 1 - turn;
        }
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
        ; // Generate random square until you get one that is empty (not in this.full), using set
    }

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
        ; // Nice formatted printing of grid
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
    }
}

class HumanPlayer extends Player {
    constructor(name) {
        super(name)
    }
}

class ComputerPlayer extends Player {
    constructor() {
        super("Computer")
        this.type = 1;
    }
}

// Testing game
/*
const red = new HumanPlayer("Red")
const yellow = new HumanPlayer("Yellow")
const game = new Game(red, yellow)
game.playGame()
*/
