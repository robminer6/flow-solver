/* eslint-disable max-classes-per-file,prefer-destructuring */
/* eslint-disable no-console */
// const pain2maxval = 3;
const debug = true;
// let yes = false;

function structuredCloner(array: any) {
    return JSON.parse(JSON.stringify(array));
}

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

    forced: boolean;

    edge: boolean;

    constructor(row: number, col: number, forced: boolean, edge: boolean) {
        this.row = row;
        this.col = col;
        this.forced = forced;
        this.edge = edge;
    }
}

enum WallSide {
    Left = -1,
    Right = 1,
}

enum Direction {
    Down,
    Right,
    Up,
    Left,
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
    if (char === "S" || char === "s"){
        return "silver";
    }
    if (char === "W" || char === "w"){
        return "white";
    }
    throw new Error(`Error: unrecognized character ${char}`);
}

function compEdges(walls1: number[][], walls2: number[][]) {
    for (let i = 0; i < walls1.length; i += 1) {
        for (let j = 0; j < walls2.length; j += 1) {
            if (walls1[i][0] === walls2[j][0] && walls1[i][1] === walls2[j][1]) {
                return true;
            }
        }
    }
    return false;
}

export default class FlowGame {
    grid: Tile[][] = [];

    headLocations: { [color: string]: number[][] } = {};

    log: Move[] = [];

    pain: boolean = false;

    pain2: boolean = false;

    pain2val: number = 1;

    solved: boolean = false;

    hints = new Set();

    pain2attempts: [number, number, Tile] = [-1, -1, new Tile("empty", false, 0)];

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
            /* const file =
                "R.G.Y\n"+
                    "..B.O\n"+
        ".....\n"+
        ".G.Y.\n"+
                ".RBO."; */
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
    connectPair(row: number, col: number): boolean {
        const investigate = (newRow: number, newCol: number) => {
            if (this.inBounds(newRow, newCol)) {
                if (
                    this.grid[newRow][newCol].head &&
                    this.grid[newRow][newCol].color === this.grid[row][col].color
                ) {
                    // We connected two circles!
                    delete this.headLocations[this.grid[row][col].color];
                    this.grid[row][col].head = 0;
                    this.grid[newRow][newCol].head = 0;
                    return true;
                }
            }
            return false;
        };
        return (
            investigate(row - 1, col) ||
            investigate(row, col + 1) ||
            investigate(row + 1, col) ||
            investigate(row, col - 1)
        );
    }

    // Returns whether a space on the grid is in-bounds and empty
    isEmpty(row: number, col: number) {
        return this.inBounds(row, col) && this.grid[row][col].color === "empty";
    }

    specialCornerRule(ignoreColor?: string, head_num?: number) : boolean {
        // This function returns true if we were able to apply the special corner heuristic.
        for(let i = 0; i < this.grid.length; i+=1){
            for (let j = 0; j < this.grid[0].length; j+=1){
                if (!this.isEmpty(i,j)){
                    continue;
                }
                let left = 0;
                let right = 0;
                let up = 0;
                let down = 0;
                if (this.isWall(i-1, j)){
                    down=1;
                }
                if (this.isWall(i+1, j)){
                    up+=1;
                }
                if (this.isWall(i, j-1)){
                    right+=1;
                }
                if (this.isWall(i, j+1)){
                    left+=1;
                }
                if (up + down !== 1 || left + right !== 1){
                    // Corner case doesn't apply.
                    continue;
                }
                let inumber;
                let jnumber;
                if (up && right){
                    inumber = -1;
                    jnumber = 1;

                }
                else if (up && left){
                    inumber = -1;
                    jnumber = -1;
                }
                else if (down && right){
                    inumber = 1;
                    jnumber = 1;
                }
                else{
                    // Down and left
                    inumber = 1;
                    jnumber = -1;
                }

                if (this.inBounds(i+inumber*2, j) && this.inBounds(i, j+jnumber*2) && (this.isEmpty(i+inumber*2, j) || this.isEmpty(i, j+jnumber*2))){
                    // Corner case does apply, now we have to see if there's a head near us.
                    let color;
                    if (this.grid[i+inumber*2][j].head){
                        // We found a case!
                        this.printGrid();
                        color = this.grid[i+inumber*2][j].color;
                        if (ignoreColor && color === ignoreColor && this.grid[i+inumber*2][j].head === head_num){
                            continue;
                        }
                        this.grid[i][j+jnumber*2].color = color;
                        this.grid[i][j+jnumber*2].head = this.grid[i+inumber*2][j].head;
                        this.grid[i+inumber*2][j].head = 0;

                        this.headLocations[color][this.grid[i][j+jnumber*2].head-1] = [i, j+jnumber*2];
                    }
                    else if (this.grid[i][j+jnumber*2].head){
                        this.printGrid();
                        color = this.grid[i][j+jnumber*2].color;
                        if (ignoreColor && color === ignoreColor && this.grid[i][j+jnumber*2].head === head_num){
                            continue;
                        }
                        this.grid[i+inumber*2][j].color = color;
                        this.grid[i+inumber*2][j].head = this.grid[i][j+jnumber*2].head;
                        this.grid[i][j+jnumber*2].head = 0;
                        this.headLocations[color][this.grid[i+inumber*2][j].head-1] = [i+inumber*2, j];
                    }
                    else{
                        continue;
                    }
                    this.grid[i+inumber][j].color = color;
                    this.grid[i][j].color = color;
                    this.grid[i][j+jnumber].color = color;
                    // TODO add all of these "moves" to the log
                    return true;
                }

            }
        }
        return false;
    }

    // Determines whether a given move is possible.
    possibleMove(headRow: number, headCol: number, newRow: number, newCol: number): boolean {
        /* Reasons why a move might be impossible:
        1. It's trying to go to a non-empty tile. (done)
        2. It would create a 2x2 of the same color.
        3. It would cause another dot to have no possible moves.
        TODO: Implement all of these checks.
        */
        if (!this.isEmpty(newRow, newCol)) {
            return false;
        }
        return true; // placeholder
    }

    // Determines if any of a tile's neighbors are corners.
    // If true, returns their position. Otherwise, returns [-1, -1].
    cornerMove(row: number, col: number): number[] {
        if (this.isEmpty(row - 1, col)) {
            if (
                !(
                    (this.inBounds(row - 2, col) && this.grid[row - 2][col].head !== 0) ||
                    (this.inBounds(row - 1, col + 1) && this.grid[row - 1][col + 1].head !== 0) ||
                    (this.inBounds(row - 1, col - 1) && this.grid[row - 1][col - 1].head !== 0)
                )
            ) {
                let corner = !this.isEmpty(row - 2, col);
                const right = this.isEmpty(row - 1, col + 1);
                const left = this.isEmpty(row - 1, col - 1);
                if ((left && right) || !(left || right)) {
                    corner = false;
                }
                if (corner) {
                    return [row - 1, col];
                }
            }
        }
        if (this.isEmpty(row, col + 1)) {
            if (
                !(
                    (this.inBounds(row, col + 2) && this.grid[row][col + 2].head !== 0) ||
                    (this.inBounds(row + 1, col + 1) && this.grid[row + 1][col + 1].head !== 0) ||
                    (this.inBounds(row - 1, col + 1) && this.grid[row - 1][col + 1].head !== 0)
                )
            ) {
                let corner = !this.isEmpty(row, col + 2);
                const right = this.isEmpty(row + 1, col + 1);
                const left = this.isEmpty(row - 1, col + 1);
                if ((left && right) || !(left || right)) {
                    corner = false;
                }
                if (corner) {
                    return [row, col + 1];
                }
            }
        }
        if (this.isEmpty(row + 1, col)) {
            if (
                !(
                    (this.inBounds(row + 2, col) && this.grid[row + 2][col].head !== 0) ||
                    (this.inBounds(row + 1, col - 1) && this.grid[row + 1][col - 1].head !== 0) ||
                    (this.inBounds(row + 1, col + 1) && this.grid[row + 1][col + 1].head !== 0)
                )
            ) {
                let corner = !this.isEmpty(row + 2, col);
                const right = this.isEmpty(row + 1, col - 1);
                const left = this.isEmpty(row + 1, col + 1);
                if ((left && right) || !(left || right)) {
                    corner = false;
                }
                if (corner) {
                    return [row + 1, col];
                }
            }
        }
        if (this.isEmpty(row, col - 1)) {
            if (
                !(
                    (this.inBounds(row, col - 2) && this.grid[row][col - 2].head !== 0) ||
                    (this.inBounds(row - 1, col - 1) && this.grid[row - 1][col - 1].head !== 0) ||
                    (this.inBounds(row + 1, col - 1) && this.grid[row + 1][col - 1].head !== 0)
                )
            ) {
                let corner = !this.isEmpty(row, col - 2);
                const right = this.isEmpty(row - 1, col - 1);
                const left = this.isEmpty(row + 1, col - 1);
                if ((left && right) || !(left || right)) {
                    corner = false;
                }
                if (corner) {
                    return [row, col - 1];
                }
            }
        }
        return [-1, -1];
    }

    // Finds whether there is a head that can only make one possible move and makes it.
    // Returns whether a move was made.
    // TODO add moves made to the log.
    makeForcedMove(color?: string, head_num?: number): boolean {
        const heads = Object.values(this.headLocations);
        for (let i = 0; i < heads.length; i += 1) {
            for (let j = 0; j < heads[i].length; j += 1) {
                const row = heads[i][j][0];
                const col = heads[i][j][1];
                const head = this.grid[row][col];

                // Skip color heads
                if (color && this.grid[row][col].color === color && j+1 === head_num) {
                    continue;
                }

                // Connects two heads if possible
                if (this.connectPair(row, col)) {
                    return true;
                }

                // Check if a dot is one space from a corner. If it is, it must go there.
                let move = this.cornerMove(row, col);
                if (move[0] !== -1 && move[1] !== -1) {
                    this.grid[move[0]][move[1]].color = head.color;
                    this.grid[move[0]][move[1]].head = head.head;
                    head.head = 0;
                    this.headLocations[head.color][j] = move;
                    return true;
                }

                // Counts how many possible moves there are for this head
                let foundMove = false;
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
                    this.grid[move[0]][move[1]].head = head.head;
                    head.head = 0;
                    this.headLocations[head.color][j] = move;
                    return true;
                }
                // If it has no possible moves, puzzle is impossible.
                this.printGrid();
                throw new UncompletableError("ya done fuck up");
            }
        }

        if (this.specialCornerRule(color)){
            return true;
        }


        return false;
    }

    /* Takes a position in the grid as input. The input position MUST be a circle.
    Function returns whether the circle has any adjacent connected line segments. Because line segments
    are only placed in the grid when we have a path we're trying, this function returns whether or not a circle
    has a way to get out. */
    circleConnect(row: number, col: number) {
        if (row !== 0) {
            if (this.grid[row - 1][col].color === this.grid[row][col].color) {
                return true;
            }
        }
        if (row !== this.grid.length - 1) {
            if (this.grid[row + 1][col].color === this.grid[row][col].color) {
                return true;
            }
        }
        if (col !== 0) {
            if (this.grid[row][col - 1].color === this.grid[row][col].color) {
                return true;
            }
        }
        if (col !== this.grid.length - 1) {
            if (this.grid[row][col + 1].color === this.grid[row][col].color) {
                return true;
            }
        }
        return false;
    }

    inBounds(row: number, col: number) {
        return !(row < 0 || col < 0 || row >= this.grid.length || col >= this.grid[0].length);
    }

    // Heads are not walls
    isWall(row: number, col: number) {
        if (!this.inBounds(row, col)) {
            return true;
        }
        if (this.grid[row][col].head) {
            /* if (this.checkCirclePath(row, col, k)){
                return true;
            }// Problem for section by section brute force */
            return false;
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

    checkFreedom(row: number, col: number, target?: string) {
        if (!this.inBounds(row, col)) {
            return true; // This shouldn't be called much honestly, but its possible.
        }
        if (target && this.grid[row][col].color === target && this.grid[row][col].circle) {
            return true; // This will likely get called on either paths that will fail eventually, or where we run into a corner with the ending circle next to us
        }
        if (this.grid[row][col].circle) {
            if (this.circleConnect(row, col)) {
                return true;
            }
            let free = 0;
            if (!this.isWall(row - 1, col)) {
                free += 1;
            }
            if (!this.isWall(row + 1, col)) {
                free += 1;
            }
            if (!this.isWall(row, col - 1)) {
                free += 1;
            }
            if (!this.isWall(row, col + 1)) {
                free += 1;
            }
            return free > 1;
        }
        return true;
    }

    // Function only modifies path if it returns true. Function returns true if it found the endpoint
    edgeDash(path: [[number, number]], color: string, direction: Direction) {
        const n = path.length;
        let curRow = path[n - 1][0];
        let curCol = path[n - 1][1];
        const path2: [[number, number]] = [[curRow, curCol]];
        let rowAdd = 0;
        let colAdd = 0;
        if (direction === Direction.Down) {
            rowAdd = 1;
        }
        if (direction === Direction.Right) {
            colAdd = 1;
        }
        if (direction === Direction.Up) {
            rowAdd = -1;
        }
        if (direction === Direction.Left) {
            colAdd = -1;
        }
        let success = true;
        for (let i = 0; i < this.pain2val; i += 1) {
            curRow += rowAdd;
            curCol += colAdd;
            if (this.isWall(curRow, curCol)) {
                return false;
            }
            if (this.grid[curRow][curCol].color !== "empty") {
                if (this.grid[curRow][curCol].color === color && this.grid[curRow][curCol].circle) {
                    success = true;
                    break;
                }
                return false;
            }
        }
        if (success) {
            for (let i = 1; i < path2.length; i += 1) {
                path.push(path2[i]);
            }
            return true;
        }
        return false;
    }

    // Color must be a Circle
    followEdge(
        curRow: number,
        curCol: number,
        wallSide: WallSide,
        color: string,
        given_dir: Direction
    ): boolean {
        if (this.pain) {
            try {
                while (this.makeForcedMove(color, this.grid[curRow][curCol].head)) {
                    // Pass
                }
            } catch (err: any) {
                if (err.name === "UncompletableError") {
                    return false;
                }
            }
        }

        if (!this.grid[curRow][curCol].head) {
            return true; // Other head connected with us, we win.
        }

        const direction = given_dir;
        let newRow = curRow;
        let newCol = curCol;
        let wallRow = curRow;
        let wallCol = curCol;
        let checkRow = curRow;
        let checkCol = curCol;
        if (direction === Direction.Down) {
            newRow += 1;
            wallRow = newRow;
            wallCol = newCol - wallSide;
            checkCol = newCol + wallSide;
        }
        if (direction === Direction.Left) {
            newCol -= 1;
            wallCol = newCol;
            wallRow = newRow - wallSide;
            checkRow = newRow + wallSide;
        }
        if (direction === Direction.Up) {
            newRow -= 1;
            wallRow = newRow;
            wallCol = newCol + wallSide;
            checkCol = newCol - wallSide;
        }
        if (direction === Direction.Right) {
            newCol += 1;
            wallCol = newCol;
            wallRow = newRow + wallSide;
            checkRow = newRow - wallSide;
        }
        // Check if space ahead valid
        if (!this.isWall(newRow, newCol)) {
            if (this.grid[newRow][newCol].head && this.grid[newRow][newCol].color !== color) {
                return false; // Uncompleted head ahead of us, no go.
            }

            // Maybe we weren't allowed to do this.
            if (!this.checkFreedom(checkRow, checkCol, color)) {
                return false; // Found a circle on the space opposite of wallSide that had nowhere to go. This probably shouldn't get called. forcedmove solves it.
            }

            if (this.grid[newRow][newCol].head) {
                // We win, poggers dude.
                if (
                    this.grid[curRow][curCol].head &&
                    this.grid[newRow][newCol].head &&
                    this.grid[curRow][curCol].color === this.grid[newRow][newCol].color
                ) {
                    this.grid[curRow][curCol].head = 0;
                    this.grid[newRow][newCol].head = 0;
                    delete this.headLocations[color];
                    return true;
                }
                console.log("\n");
                console.log("\n");
                this.printGrid();
                throw new Error("fuckity fuck fuck"); // Somehow we won but we didn't.
            }

            // We can move there, lets do it
            this.grid[newRow][newCol] = new Tile(color, false, this.grid[curRow][curCol].head);
            this.headLocations[color][this.grid[curRow][curCol].head - 1] = [newRow, newCol];
            this.grid[curRow][curCol].head = 0;

            this.log.push(new Move(newRow, newCol, false, true));

            /*
            if (this.pain2) {
                // Look away from the wall for pain2val spaces to see if we can find our goal, if we can, try it.
                let tmpDirection;
                if (wallSide === WallSide.Right) {
                    tmpDirection = (direction + 1) % 4;
                } else {
                    tmpDirection = (direction + 3) % 4;
                }
                if (this.edgeDash(path, color, tmpDirection)) {
                    return true;
                }
            }
            */

            // See if we still have wall on the correct side
            if (!this.isWall(wallRow, wallCol)) {
                // Ack, wall has disappeared out from under us. It must have gone to the wallSide

                if (wallSide === WallSide.Left) {
                    return this.followEdge(newRow, newCol, wallSide, color, (direction + 1) % 4);
                }
                return this.followEdge(newRow, newCol, wallSide, color, (direction + 3) % 4);
            }
            return this.followEdge(newRow, newCol, wallSide, color, direction); // Keep moving
        }

        // Space ahead is not enterable, try space opposite wallSide
        if (wallSide === WallSide.Right) {
            return this.followEdge(curRow, curCol, wallSide, color, (direction + 1) % 4);
        }
        return this.followEdge(curRow, curCol, wallSide, color, (direction + 3) % 4);
    }

    solveCircle2(row: number, col: number, walls: number[][]) {
        if (row === 7 && col === 5){
            this.printGrid();
        }
        let success = false;
        // DOWN RIGHT UP LEFT
        const rightWalls = [
            [
                [row, col - 1],
                [row + 1, col - 1],
            ],
            [
                [row + 1, col],
                [row + 1, col + 1],
            ],
            [
                [row, col + 1],
                [row - 1, col + 1],
            ],
            [
                [row - 1, col],
                [row - 1, col - 1],
            ],
        ];
        const leftWalls = [
            [
                [row, col + 1],
                [row + 1, col + 1],
            ],
            [
                [row - 1, col],
                [row - 1, col + 1],
            ],
            [
                [row, col - 1],
                [row - 1, col - 1],
            ],
            [
                [row + 1, col],
                [row + 1, col - 1],
            ],
        ];
        const direction = [
            [row + 1, col],
            [row, col + 1],
            [row - 1, col],
            [row, col - 1],
        ];

        for (let i = 0; i < 4; i += 1) {
            const tryrow = direction[i][0];
            const trycol = direction[i][1];
            if (!this.isWall(tryrow, trycol)) {
                // Make sure that this space is "on the edge", and that at least one of its walls is one of our walls
                const newWalls = this.isEdge2(tryrow, trycol);
                if (compEdges(walls, newWalls)) {
                    // Check if its a space we can actually go to.
                    if (this.grid[tryrow][trycol].color === "empty") {
                        // Can go

                        // Are any of the walls on our right?
                        let wallOneRow = rightWalls[i][0][0];
                        let wallOneCol = rightWalls[i][0][1];
                        let wallTwoRow = rightWalls[i][1][0];
                        let wallTwoCol = rightWalls[i][1][1];
                        if (
                            (this.isWall(wallOneRow, wallOneCol) && (!this.inBounds(wallOneRow, wallOneCol) || this.grid[wallOneRow][wallOneCol].color !== this.grid[row][col].color)) ||
                            (this.isWall(wallTwoRow, wallTwoCol) && (!this.inBounds(wallTwoRow, wallTwoCol) || this.grid[wallTwoRow][wallTwoCol].color !== this.grid[row][col].color))
                        ) {
                            // We go with wall on right
                            const logspot = this.log.length;
                            const gridCopy = structuredCloner(this.grid);
                            const headCopy = structuredCloner(this.headLocations);
                            const potSuc = this.followEdge(
                                row,
                                col,
                                WallSide.Right,
                                this.grid[row][col].color,
                                i
                            );
                            if (potSuc) {
                                success = true;
                                break;
                                // Found a path. For now we're going to pretend like it MUST be correct.
                                // TODO Robby help me think about how to fix this problem later with multiple potential paths it could have succeeded.
                            } else {
                                this.grid = gridCopy; // Undo grid
                                this.headLocations = headCopy; // Undo head
                                while (this.log.length > logspot) {
                                    this.log.pop(); // Undo log
                                }
                            }
                        }
                        // Any walls on left?
                        wallOneRow = leftWalls[i][0][0];
                        wallOneCol = leftWalls[i][0][1];
                        wallTwoRow = leftWalls[i][1][0];
                        wallTwoCol = leftWalls[i][1][1];
                        if (
                            (
                                (this.isWall(wallOneRow, wallOneCol) && (!this.inBounds(wallOneRow, wallOneCol) || this.grid[wallOneRow][wallOneCol].color !== this.grid[row][col].color)) ||
                                (this.isWall(wallTwoRow, wallTwoCol) && (!this.inBounds(wallTwoRow, wallTwoCol) || this.grid[wallTwoRow][wallTwoCol].color !== this.grid[row][col].color))
                            ) &&
                            !success
                        ) {
                            // We go with wall on left
                            const logspot = this.log.length;
                            const gridCopy = structuredCloner(this.grid);
                            const headCopy = structuredCloner(this.headLocations);
                            const potSuc = this.followEdge(
                                row,
                                col,
                                WallSide.Left,
                                this.grid[row][col].color,
                                i
                            );
                            if (potSuc) {
                                success = true;
                                break;
                                // Found a path. For now we're going to pretend like it MUST be correct.
                                // TODO Robby help me think about how to fix this problem later with multiple potential paths it could have succeeded.
                            } else {
                                this.grid = gridCopy; // Undo grid
                                this.headLocations = headCopy; // Undo head
                                while (this.log.length > logspot) {
                                    this.log.pop(); // Undo log
                                }
                            }
                        }
                    }
                    // No can go
                }
            }
        }
        if (success) {
            // console.log(`Was able to solve circle at ${row}, ${col}`);
            return true;
        }
        return false;
    }

    isEdge2(row: number, col: number) {
        const walls = [];
        for (let i = row - 1; i < row + 2; i += 1) {
            for (let j = col - 1; j < col + 2; j += 1) {
                if (this.isWall(i, j)) {
                    walls.push([i, j]);
                }
            }
        }
        return walls;
    }

    // Attempts to solve the grid by calling "solveCircle" on every circle it comes across.
    /* TODO: Integrate with makeForcedMove. Something like:
    while(!Object.keys(this.headLocations).empty) {
        if (!this.makeForcedMove()) {
            Do aj stuff one time
        }
    }
    */
    loop() {
        // Assuming heads have been set to circles at the beginning
        let again = true;
        while (again && Object.values(this.headLocations).length > 0) {
            again = false;
            for (let i = 0; i < this.grid.length; i += 1) {
                for (let j = 0; j < this.grid[0].length; j += 1) {
                    if (this.grid[i][j].head) {
                        const walls = this.isEdge2(i, j);
                        if (walls.length !== 0) {
                            if (this.solveCircle2(i, j, walls)) {
                                while (this.makeForcedMove()) {
                                    // DanceFrog
                                }

                                again = true;
                                if (this.pain) {
                                    this.pain = false;
                                    return;
                                }
                                if (this.pain2) {
                                    this.pain2 = false;
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Solves the grid and prints it out afterwards.
    /* TODO: Integrate the new "head" member variable of Tile into AJ's code.
    It should be updated when a move is made or when two heads are connected.
    The headLocations member variable of our class should also be updated accordingly. */
    solve() {
        while (this.makeForcedMove()) {
            // DanceFrog
        }
        this.printGrid();
        console.log("Solving!");
        this.loop();
        // const savedGrid = this.grid;
        if (!this.checkComplete()) {
            console.log("Pain 1 board below: ");
            this.printGrid();
            while (!this.pain) {
                this.pain = true;
                this.loop();
            }
        }
        /*
        if (!this.checkComplete()){
            console.log("Trying pain 2.");
            this.grid = savedGrid;
            this.pain = false;
            while(this.pain2val < pain2maxval && !this.pain2){
                this.pain2 = true;
                this.loop();
                if (this.pain2 && this.pain2val < pain2maxval){
                    this.pain2val+=1;
                }
            }
        }
        */
        if (this.checkComplete()){
            this.solved = true;
        }
    }

    hint() {
        if (!this.solved){
            this.solve();
        }
        if (!this.solved){
            throw new UncompletableError("fuck");
        }
        let done = false;
        for (let i = 0; i < this.grid.length; i+=1){
            for (let j = 0; j < this.grid[0].length; j+=1){
                if (this.grid[i][j].circle && !this.hints.has(this.grid[i][j].color) ){
                    this.hints.add(this.grid[i][j].color);
                    done = true;
                    break;
                }
            }
            if (done){
                break;
            }
        }
        const tmpGrid = structuredCloner(this.grid);
        for (let i = 0; i < this.grid.length; i+=1){
            for (let j = 0; j < this.grid[0].length; j+=1){
                if (!this.hints.has(tmpGrid[i][j].color)){
                    tmpGrid[i][j].color = "empty";
                    tmpGrid[i][j].head = 0;
                    tmpGrid[i][j].circle = false;
                }
            }
        }
        return tmpGrid;

    }
}
