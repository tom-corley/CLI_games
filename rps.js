const readline = require('readline/promises')

class Game {
    constructor(turns, user, computer) {
        this.user = user
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })
        this.computer = computer
        this.turns = turns
        this.total_turns = turns
        this.score = [0,0]
    }
    
    async get_user_input() {
        let user_move;
        let input = await this.rl.question("Enter r,p,s for rock, paper, or scissors respectively: ")
        if (input == 'r') {
            user_move = 0
        } else if (input == 'p') {
            user_move = 1;
        } else if (input == 's') {
            user_move = 2;
        } else {
            console.log("Invalid input");
            return this.get_user_input(this.rl)
        }
        return user_move;
        
    }
    
    async again() {
        let input = await this.rl.question("Play again? [y/n]: ")
        if (input == "y") {
            return true
        } else if (input == 'n') {
            return false
        } else {
            console.log("Invalid input...");
            return this.again()
        }
    }
    async end_game() {
        this.rl.close()
    }

    async play() {
        const moves = ["rock", "paper", "scissors"]
        let user_move;
        let computer_move;
        console.log(`Starting game with ${this.turns} rounds`);

        while (this.turns) {
            console.log(`\nRound ${1 + (this.total_turns - this.turns)}/${this.total_turns} - Current Score: ${this.score}`);

            user_move = await this.get_user_input()

            console.log(`You played ${moves[user_move]}`);
 
            computer_move = Math.floor(Math.random() * 3);
            console.log(`Computer played ${moves[computer_move]}`);
            
            // Draw
            if (user_move == computer_move) {
                console.log("Draw - Try again")
                continue;
            }
            // User wins
            else if ((user_move == 1 && computer_move == 0)
                    || (user_move == 2 && computer_move == 1)
                    || (user_move == 0 && computer_move == 2)) {
                        console.log("You win!!!");
                        this.turns -= 1
                        this.score[0] += 1
            // Computer wins
            } else {
                console.log("Computer wins!!");
                this.turns -= 1; 
                this.score[1] += 1
            }
        }

        console.log(`\n=====\nFinal Score: \n\tUser: ${this.score[0]}\n\tComputer: ${this.score[1]}`);
        if (this.score[0] > this.score[1]) {
            console.log("User wins!!!");
        } else if (this.score[0] < this.score[1]) {
            console.log("Computer wins :(");
        } else {
            console.log("Draw");
        }
        if (await this.again()) {
            this.turns = this.total_turns
            this.score = [0,0]
            await this.play()
        }
        this.end_game();

    }
}

class Player {
    constructor(name) {
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
    }
}

const tom = new HumanPlayer("Tom");
const computer = new ComputerPlayer();
const game = new Game(3, tom, computer)
game.play()

