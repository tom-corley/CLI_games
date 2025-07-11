class Game {
    constructor(p1, p2) {
        // Assigning players
        this.p1 = p1
        this.p2 = p2

        // Creating 6 (rows) x 7 (columns) grid and set to keep track of full squares
        this.grid = []
        for (let i = 0; i < 6; i++) {
            this.grid.push([0,0,0,0,0,0,0])
        }
        this.free_squares = 42;
        this.full = new Set()
    }

    playGame() {
        let turn = 0
        while (!this.winner() && (this.free_squares > 0)) {
            // Some output to user
            ;

            // Actual move
            this.playerTurn(turn)

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
        ; // Generate random square until you get one that is empty
    }

    finaliseGame() {
        ; // Output to user etc
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

//const g = new Game()