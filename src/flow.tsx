/* eslint-disable max-classes-per-file,prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable */
const debug = true;

// Deep copies an array
function structuredCloner(array: any) {
    return JSON.parse(JSON.stringify(array));
}

// Error thrown when board is uncompletable
class UncompletableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UncompletableError";
    }
}

class Tile {
    color: string;

    circle: boolean;

    head: number;

    constructor(color: string, circle: boolean, head: number) {
        this.color = color;
        this.circle = circle;
        this.head = head;
    }
}

class Move {
    row: number;

    col: number;

    headnum: number;

    constructor(row: number, col: number, headnum: number) {
        this.row = row;
        this.col = col;
        this.headnum = headnum;
    }
}

// Converts the character representation of a color to its string version
function colorCharToString(char: string) {
    if (char === ".") {
        return "empty";
    }
    if (char === "Y" || char === "y") {
        return "yellow";
    }
    if (char === "R" || char === "r") {
        return "red";
    }
    if (char === "B" || char === "b") {
        return "blue";
    }
    if (char === "C" || char === "c") {
        return "cyan";
    }
    if (char === "O" || char === "o") {
        return "orange";
    }
    if (char === "G" || char === "g") {
        return "green";
    }
    if (char === "L" || char === "l") {
        return "lime";
    }
    if (char === "M" || char === "m") {
        return "magenta";
    }
    if (char === "P" || char === "p") {
        return "purple";
    }
    if (char === "A" || char === "a") {
        return "auburn";
    }
    if (char === "S" || char === "s") {
        return "silver";
    }
    if (char === "W" || char === "w") {
        return "white";
    }
    throw new Error(`Error: unrecognized character ${char}`);
}

export default class FlowGame {
    grid: Tile[][] = [];

    headLocations: { [color: string]: number[][] } = {};

    solved: boolean = false;

    // Constructs our grid, usually by reading from a string array.
    constructor(arr?: string[][]) {
        if (arr) {
            // Constructs grid based on an array of strings. Used when reading from a file.
            for (let i = 0; i < arr.length; i += 1) {
                this.grid.push([]);
                for (let j = 0; j < arr[i].length; j += 1) {
                    const color = colorCharToString(arr[i][j]);
                    if (color === "empty") {
                        this.grid[i].push(new Tile(color, false, 0));
                    } else if (this.headLocations[color]) {
                        this.headLocations[color].push([i, j]);
                        this.grid[i].push(new Tile(color, true, 2));
                    } else {
                        this.grid[i].push(new Tile(color, true, 1));
                        this.headLocations[color] = [];
                        this.headLocations[color].push([i, j]);
                    }
                }
            }
        } else if (debug) {
            const file =
                "..........\n" +
                ".YA.......\n" +
                "..RC......\n" +
                "......R...\n" +
                "..........\n" +
                "OY.S..A...\n" +
                "...G..MW.O\n" +
                ".P.BGS....\n" +
                "..B...P.M.\n" +
                "C...W.....";

            const lines = file.split(/\r?\n/);
            const board: string[][] = [];
            lines.forEach((line) => {
                board.push(line.split(""));
            });
            for (let i = 0; i < board.length; i += 1) {
                this.grid.push([]);
                for (let j = 0; j < board[i].length; j += 1) {
                    const color = colorCharToString(board[i][j]);
                    if (color === "empty") {
                        this.grid[i].push(new Tile(color, false, 0));
                        continue;
                    }
                    if (this.headLocations[color]) {
                        this.headLocations[color].push([i, j]);
                        this.grid[i].push(new Tile(color, true, 2));
                        continue;
                    }
                    this.grid[i].push(new Tile(color, true, 1));
                    this.headLocations[color] = [];
                    this.headLocations[color].push([i, j]);
                }
            }
        }
    }

    // Investigates a head to see if it touches its partner. Connects them if so.
    // Returns whether a pair was connected.
    connectPair(row: number, col: number) {}

    // Returns whether a space on the grid is in-bounds and empty
    isEmpty(row: number, col: number) {
        return this.inBounds(row, col) && this.grid[row][col].color === "empty";
    }

    specialCornerRule() {
        // This function returns true if we were able to apply the special corner heuristic.
        // TODO implement the special corner rule
    }

    // Determines whether a given move is possible.
    possibleMove(headRow: number, headCol: number, newRow: number, newCol: number): boolean {
        /* Reasons why a move might be impossible:
        1. It's trying to go to a non-empty tile. (done)
        2. It would create a 2x2 of the same color.
        */
        // TODO implement
        if (!this.isEmpty(newRow, newCol)) {
            return false;
        }
        return true;
    }

    // Makes all possible forced moves
    // eslint-disable-next-line consistent-return
    makeForcedMoves() {
        const heads = Object.values(this.headLocations);
        for (let i = 0; i < heads.length; i += 1) {
            for (let j = 0; j < heads[i].length; j += 1) {
                const row = heads[i][j][0];
                const col = heads[i][j][1];
                const head = this.grid[row][col];

                // Connects two heads if possible
                // TODO implement

                // Check if a head is one or two spaces from a corner. If it is, it must go there.
                this.specialCornerRule();

                // Counts how many possible moves there are for this head
                let foundMove = false;
                let move = [-1, -1];
                if (this.possibleMove(row, col, row - 1, col)) {
                    move = [row - 1, col];
                    foundMove = true;
                }
                if (this.possibleMove(row, col, row, col + 1)) {
                    if (!foundMove) {
                        move = [row, col + 1];
                        foundMove = true;
                    } else {
                        continue;
                    }
                }
                if (this.possibleMove(row, col, row + 1, col)) {
                    if (!foundMove) {
                        move = [row + 1, col];
                        foundMove = true;
                    } else {
                        continue;
                    }
                }
                if (this.possibleMove(row, col, row, col - 1)) {
                    if (!foundMove) {
                        move = [row, col - 1];
                        foundMove = true;
                    } else {
                        continue;
                    }
                }
                // If we found exactly one possible move
                if (foundMove) {
                    this.grid[move[0]][move[1]].color = head.color;
                    this.headLocations[head.color][j] = move;
                }
                // If it has no possible moves, puzzle is impossible.
                throw new UncompletableError(`no possible moves for ${head.color} ${j + 1}`);
            }
        }
    }

    inBounds(row: number, col: number) {
        return !(row < 0 || col < 0 || row >= this.grid.length || col >= this.grid[0].length);
    }

    // Heads are walls
    isWall(row: number, col: number) {
        if (!this.inBounds(row, col)) {
            return true;
        }
        return this.grid[row][col].color !== "empty";
    }

    // Returns whether the given circle is fully connected to its pair.
    checkCirclePath(rowParam: number, colParam: number) {
        let row = rowParam;
        let col = colParam;
        const startingCircle: Tile = this.grid[row][col];
        let pastRow = row; // These variables help us determine what our past square was so we don't go there
        let pastCol = col;
        while (
            this.grid[row][col].color !== startingCircle.color ||
            !this.grid[row][col].circle ||
            (row === pastRow && col === pastCol)
        ) {
            let nextRow = -1;
            let nextCol = -1;
            if (row !== 0 && pastRow !== row - 1) {
                // Check square above
                if (this.grid[row - 1][col].color === startingCircle.color) {
                    nextRow = row - 1;
                    nextCol = col;
                }
            }
            if (row !== this.grid.length - 1 && pastRow !== row + 1) {
                // Check square below
                if (this.grid[row + 1][col].color === startingCircle.color) {
                    if (nextRow !== -1) {
                        console.log(`No 2x2 allowed! Space:${row} ${col}`);
                        return false;
                    }
                    nextRow = row + 1;
                    nextCol = col;
                }
            }
            if (col !== 0 && pastCol !== col - 1) {
                // Check square left
                if (this.grid[row][col - 1].color === startingCircle.color) {
                    if (nextRow !== -1) {
                        console.log(`No 2x2 allowed! Space:${row} ${col}`);
                        return false;
                    }
                    nextRow = row;
                    nextCol = col - 1;
                }
            }
            if (col !== this.grid[0].length - 1 && pastCol !== col + 1) {
                // Check square right
                if (this.grid[row][col + 1].color === startingCircle.color) {
                    if (nextRow !== -1) {
                        console.log(`No 2x2 allowed! Space:${row} ${col}`);
                        return false;
                    }
                    nextRow = row;
                    nextCol = col + 1;
                }
            }
            if (nextRow === -1) {
                return false;
            }
            pastRow = row;
            pastCol = col;
            row = nextRow;
            col = nextCol;
        }
        return true;
    }

    // Loops through the grid and returns whether it has been solved.
    checkComplete() {
        console.log("Checking grid.");
        this.printGrid();
        for (let i = 0; i < this.grid.length; i += 1) {
            for (let j = 0; j < this.grid[0].length; j += 1) {
                if (this.grid[i][j].circle) {
                    if (!this.checkCirclePath(i, j)) {
                        return false;
                    }
                }
            }
        }
        console.log("We done did it gamers!");
        return true;
    }

    // Pretty prints the grid.
    printGrid() {
        console.log("\n");
        for (let i = 0; i < this.grid.length; i += 1) {
            let linetoprint = "";
            for (let j = 0; j < this.grid[0].length; j += 1) {
                if (this.grid[i][j].color === "empty") {
                    linetoprint += ".  ";
                } else if (this.grid[i][j].circle) {
                    linetoprint += `${this.grid[i][j].color[0].toUpperCase()}  `;
                } else {
                    linetoprint += `${this.grid[i][j].color[0]}  `;
                }
            }
            console.log(linetoprint);
        }
    }

    // Solves the grid and prints it out afterwards.
    solve() {
        // TODO initialize log
        console.log("Solving!");
        while (Object.values(this.headLocations).length > 0) {
            // While heads still exist
            try {
                this.makeForcedMoves();
            } catch {
                // Puzzle currently unsolvable, back up a log state
                // TODO actually back up a log state
            } finally {
                // We made all the forced moves we could, now go make a guess
                // TODO make a guess
            }
        }
        console.log("Solved!");
        this.printGrid();
    }
}
