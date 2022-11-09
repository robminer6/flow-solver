/* eslint-disable no-console */
import { readFileSync } from "fs";

const prefix = "./src/__tests__/unsolved_boards/";
const file = "bonus_9x9_24.txt";
const debug = true;
const pain2maxval = 3;
// This enum represents each possible type of space on a board
enum FlowSpace {
    Empty = "Empty",
    YellowCircle = "YellowCircle",
    RedCircle = "RedCircle",
    BlueCircle = "BlueCircle",
    CyanCircle = "CyanCircle",
    OrangeCircle = "OrangeCircle",
    GreenCircle = "GreenCircle",
    LimeCircle = "LimeCircle",
    MagentaCircle = "MagentaCircle",
    PurpleCircle = "PurpleCircle",
    Yellow = "Yellow",
    Red = "Red",
    Blue = "Blue",
    Cyan = "Cyan",
    Orange = "Orange",
    Green = "Green",
    Lime = "Lime",
    Magenta = "Magenta",
    Purple = "Purple",
}

enum WallSide{
    Left = -1,
    Right = 1
}

enum Direction{
    Down,
    Right,
    Up,
    Left,
}

// Converts the character representation of a space to its enum version
function stringToFlowSpace(space: string) {
    if (space === ".") {
        return FlowSpace.Empty;
    }
    if (space === "Y") {
        return FlowSpace.YellowCircle;
    }
    if (space === "R") {
        return FlowSpace.RedCircle;
    }
    if (space === "B") {
        return FlowSpace.BlueCircle;
    }
    if (space === "C") {
        return FlowSpace.CyanCircle;
    }
    if (space === "O") {
        return FlowSpace.OrangeCircle;
    }
    if (space === "G") {
        return FlowSpace.GreenCircle;
    }
    if (space === "L") {
        return FlowSpace.LimeCircle;
    }
    if (space === "M") {
        return FlowSpace.MagentaCircle;
    }
    if (space === "P") {
        return FlowSpace.PurpleCircle;
    }
    if (space === "y") {
        return FlowSpace.Yellow;
    }
    if (space === "r") {
        return FlowSpace.Red;
    }
    if (space === "b") {
        return FlowSpace.Blue;
    }
    if (space === "c") {
        return FlowSpace.Cyan;
    }
    if (space === "o") {
        return FlowSpace.Orange;
    }
    if (space === "g") {
        return FlowSpace.Green;
    }
    if (space === "l") {
        return FlowSpace.Lime;
    }
    if (space === "m") {
        return FlowSpace.Magenta;
    }
    if (space === "p") {
        return FlowSpace.Purple;
    }
    throw new Error(`Error: unrecognized character ${space}`);
}

// Takes a FlowSpace as input and if the entry is a circle, returns the
// corresponding line flow space. Else, returns FlowSpace.Empty as a failure condition.
function isCircle(entry: FlowSpace): FlowSpace {
    if (entry === FlowSpace.OrangeCircle) {
        return FlowSpace.Orange;
    }
    if (entry === FlowSpace.RedCircle) {
        return FlowSpace.Red;
    }
    if (entry === FlowSpace.BlueCircle) {
        return FlowSpace.Blue;
    }
    if (entry === FlowSpace.GreenCircle) {
        return FlowSpace.Green;
    }
    if (entry === FlowSpace.YellowCircle) {
        return FlowSpace.Yellow;
    }
    if (entry === FlowSpace.CyanCircle) {
        return FlowSpace.Cyan;
    }
    if (entry === FlowSpace.LimeCircle) {
        return FlowSpace.Lime;
    }
    if (entry === FlowSpace.MagentaCircle) {
        return FlowSpace.Magenta;
    }
    if (entry === FlowSpace.PurpleCircle) {
        return FlowSpace.Purple;
    }
    return FlowSpace.Empty; // Failure condition
}

/* Takes in the grid as input, along with a position and the corresponding line color.
The input position MUST be a Circle FlowSpace.
Function returns whether the circle has any adjacent connected line segments. Because line segments
are only placed in the grid when we have a path we're trying, this function returns whether or not a circle
has a way to get out */
function circleConnect(
    grid: FlowSpace[][],
    i: number,
    j: number,
    line: FlowSpace
) {
    if (i !== 0) {
        if (grid[i - 1][j] === line) {
            return true;
        }
    }
    if (i !== grid.length - 1) {
        if (grid[i + 1][j] === line) {
            return true;
        }
    }
    if (j !== 0) {
        if (grid[i][j - 1] === line) {
            return true;
        }
    }
    if (j !== grid.length - 1) {
        if (grid[i][j + 1] === line) {
            return true;
        }
    }
    return false;
}

function compEdges(walls1: number[][], walls2: number[][]){
    for (let i = 0; i < walls1.length; i+=1){
        for (let j = 0; j < walls2.length; j+=1){
            if (walls1[i][0] === walls2[j][0] && walls1[i][1] === walls2[j][1]){
                return true;
            }
        }
    }
    return false;
}

export default class FlowGame {
    grid: FlowSpace[][];

    pain: boolean = false;

    pain2: boolean = false;

    pain2val: number = 1;

    // Constructs our grid, usually by reading from a string array.
    constructor(arr?: string[][]) {
        if (arr) {
            // Constructs grid based on an array of strings. Used when reading from a file.
            this.grid = [];
            for (let i = 0; i < arr.length; i += 1) {
                this.grid.push([]);
                arr[i].forEach((square) => {
                    this.grid[i].push(stringToFlowSpace(square));
                });
            }
        } else if (debug){
                const contents = readFileSync(prefix + file, "utf-8");
                const lines = contents.split(/\r?\n/);
                const board: string[][] = [];
                lines.forEach((line) => {
                    board.push(line.split(""));
                });
                this.grid = [];
                for (let i = 0; i < board.length; i += 1) {
                    this.grid.push([]);
                    board[i].forEach((square) => {
                        this.grid[i].push(stringToFlowSpace(square));
                    });
                }

            }
            else {
                // TODO: Change this. Creates a sample grid.
                this.grid = [
                    [
                        FlowSpace.RedCircle,
                        FlowSpace.Empty,
                        FlowSpace.GreenCircle,
                        FlowSpace.Empty,
                        FlowSpace.YellowCircle,
                    ],
                    [
                        FlowSpace.Empty,
                        FlowSpace.Empty,
                        FlowSpace.BlueCircle,
                        FlowSpace.Empty,
                        FlowSpace.OrangeCircle,
                    ],
                    [
                        FlowSpace.Empty,
                        FlowSpace.Empty,
                        FlowSpace.Empty,
                        FlowSpace.Empty,
                        FlowSpace.Empty,
                    ],
                    [
                        FlowSpace.Empty,
                        FlowSpace.GreenCircle,
                        FlowSpace.Empty,
                        FlowSpace.YellowCircle,
                        FlowSpace.Empty,
                    ],
                    [
                        FlowSpace.Empty,
                        FlowSpace.RedCircle,
                        FlowSpace.BlueCircle,
                        FlowSpace.OrangeCircle,
                        FlowSpace.Empty,
                    ],
                ];
        }
    }

    inBounds(row: number, col: number){
        return !(row < 0 || col < 0 || row >= this.grid.length || col >= this.grid[0].length);
    }

    // Circles are only walls if they are FULLY complete
    isWall(row:number, col: number){
        if (!this.inBounds(row, col)){
            return true;
        }
        const k = isCircle(this.grid[row][col]);
        if (k !== FlowSpace.Empty){
            if (this.checkCirclePath(row, col, k)){
                return true;
            }// Problem for section by section brute force
            return false;
        }
        return this.grid[row][col] !== FlowSpace.Empty;
    }

    // Returns whether the given circle is fully connected to its pair.
    checkCirclePath(rowParam: number, colParam: number, line: FlowSpace) {
        let row = rowParam;
        let col = colParam;
        const circle: FlowSpace = this.grid[row][col];
        let pastRow = row; // These variables help us determine what our past square was so we don't go there
        let pastCol = col;
        while (
            this.grid[row][col] !== circle ||
            (row === pastRow && col === pastCol)
        ) {
            let nextRow = -1;
            let nextCol = -1;
            if (row !== 0 && pastRow !== row - 1) {
                // Check square above
                if (
                    this.grid[row - 1][col] === line ||
                    this.grid[row - 1][col] === circle
                ) {
                    nextRow = row - 1;
                    nextCol = col;
                }
            }
            if (row !== this.grid.length - 1 && pastRow !== row + 1) {
                // Check square below
                if (
                    this.grid[row + 1][col] === line ||
                    this.grid[row + 1][col] === circle
                ) {
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
                if (
                    this.grid[row][col - 1] === line ||
                    this.grid[row][col - 1] === circle
                ) {
                    if (nextRow !== -1) {
                        console.log(`No 2x2 allowed! Space:${row} ${col}`);
                        return false;
                    }
                    nextRow = row;
                    nextCol = col - 1;
                }
            }
            if (col !== this.grid[0].length && pastCol !== col + 1) {
                // Check square right
                if (
                    this.grid[row][col + 1] === line ||
                    this.grid[row][col + 1] === circle
                ) {
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
                const k: FlowSpace = isCircle(this.grid[i][j]);
                if (k !== FlowSpace.Empty) {
                    if (!this.checkCirclePath(i, j, k)) {
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
        for (let i = 0; i < this.grid.length; i += 1) {
            let linetoprint = "";
            for (let j = 0; j < this.grid[0].length; j += 1) {
                if (isCircle(this.grid[i][j]) !== FlowSpace.Empty) {
                    linetoprint += `${this.grid[i][j]
                        .toString()
                        .substring(0, 3)}C `;
                } else {
                    linetoprint += `${this.grid[i][j]
                        .toString()
                        .substring(0, 3)}  `;
                }
            }
            console.log(linetoprint);
        }
    }

    // Takes in an acceptedPath and the line segment to change it to and changes the grid
    // to fill in the spaces with the correct line segments.
    mutateGrid(acceptedPath: [[number, number]], line: FlowSpace) {
        for (let i = 1; i < acceptedPath.length - 1; i += 1) {
            this.grid[acceptedPath[i][0]][acceptedPath[i][1]] = line;
        }
    }

    checkFreedom(row: number, col: number, color?: FlowSpace){
        if (!this.inBounds(row, col)){
            return true; // This shouldn't be called much honestly, but its possible.
        }
        if (color && this.grid[row][col] === color){
            return true; // This will likely get called on either paths that will fail eventually, or where we run into a corner with the ending circle next to us
        }
        if (isCircle(this.grid[row][col]) !== FlowSpace.Empty){
            if (circleConnect(this.grid, row, col, isCircle(this.grid[row][col]))){
                return true;
            }
            let free = 0;
            if (!this.isWall(row-1, col)){
                free+=1;
            }
            if (!this.isWall( row+1, col)){
                free+=1;
            }
            if (!this.isWall(row, col-1)){
                free+=1;
            }
            if (!this.isWall( row, col+1)){
                free+=1;
            }
            return free > 1;
        }
        return true;
    }

    LEEEEROOOOOYJENKINNNNNS(path: [[number, number]], color: FlowSpace, direction: Direction){
        const n = path.length;
        let curRow = path[n-1][0];
        let curCol = path[n-1][1];
        let leftRow = curRow;
        let leftCol = curCol;
        let rightRow = curRow;
        let rightCol = curCol;
        let rowAdd = 0;
        let colAdd = 0;
        if (direction === Direction.Down){
            rowAdd = 1;
            leftCol = curCol+1;
            rightCol = curCol-1;
        }
        if (direction === Direction.Right){
            colAdd = 1;
            leftRow = curRow-1;
            rightRow = curRow+1;
        }
        if (direction === Direction.Up){
            rowAdd = -1;
            leftCol = curCol-1;
            rightCol = curCol+1;
        }
        if (direction === Direction.Left){
            colAdd = -1;
            leftRow = curRow-1;
            rightRow = curRow+1;
        }
        curRow+=rowAdd;
        curCol+=colAdd;
        leftRow+=rowAdd;
        leftCol+=colAdd;
        rightRow+=rowAdd;
        rightCol+=colAdd;
        path.push([curRow, curCol]);
        while (this.inBounds(curRow, curCol) && this.inBounds(leftRow, leftCol) && this.inBounds(rightRow, rightCol)){
            if (this.grid[curRow][curCol] === color){
                return true;
            }
            if (this.grid[leftRow][leftCol] === color){
                path.push([leftRow, leftCol]);
                return true;
            }
            if (this.grid[rightRow][rightCol] === color){
                path.push([rightRow, rightCol]);
                return true;
            }
            curRow+=rowAdd;
            curCol+=colAdd;
            leftRow+=rowAdd;
            leftCol+=colAdd;
            rightRow+=rowAdd;
            rightCol+=colAdd;
        }
        return false;
    }

    // Color must be a Circle
    followEdge(path: [[number, number]], wallSide: WallSide, color: FlowSpace, given_dir: Direction): boolean{
        const n = path.length;
        const curRow = path[n-1][0];
        const curCol = path[n-1][1];
        let direction = given_dir;
        let newRow = curRow;
        let newCol = curCol;
        let wallRow = curRow;
        let wallCol = curCol;
        let checkRow = curRow;
        let checkCol = curCol;
        if (direction === Direction.Down){
            newRow += 1;
            wallRow = newRow;
            wallCol = newCol - wallSide;
            checkCol = newCol + wallSide;
        }
        if (direction === Direction.Left){
            newCol -= 1;
            wallCol = newCol;
            wallRow = newRow - wallSide;
            checkRow = newRow + wallSide
        }
        if (direction === Direction.Up){
            newRow -= 1;
            wallRow = newRow;
            wallCol = newCol + wallSide;
            checkCol = newCol - wallSide;
        }
        if (direction === Direction.Right){
            newCol+=1;
            wallCol = newCol;
            wallRow = newRow + wallSide;
            checkRow = newRow - wallSide;
        }
        // Check if space ahead valid
        if (!this.isWall(newRow, newCol)){
            // We can move there, lets do it
            path.push([newRow, newCol]);

            if (isCircle(this.grid[newRow][newCol]) !== FlowSpace.Empty && isCircle(this.grid[newRow][newCol]) !== isCircle(color)){
                if (!this.pain) {
                    return false; // Found an uncompleted circle ahead of us, no go.
                }
                // Turn away from the wall and LEEEEERROOOOOOOY JENKINNNNNNNNS ourselves until we either win or hit another problem
                if (wallSide === WallSide.Right){
                    direction = (direction+3)%4;
                }
                else{
                    direction = (direction+1)%4;
                }
                return this.LEEEEROOOOOYJENKINNNNNS(path, color, direction);
            }

            // Can move there, so we're going to
            if (this.grid[path[path.length-1][0]][path[path.length-1][1]] === color){
                // we win
                return true;
            }

            // Maybe we weren't allowed to do this.
            if (!this.checkFreedom(checkRow, checkCol, color)){
                return false; // Found a circle on the space opposite of wallSide that had nowhere to go.
            }

            // See if we still have wall on the correct side
            if (!this.isWall(wallRow, wallCol)){
                // Ack, wall has disappeared out from under us. It must have gone to the wallSide
                /*
                path.push([wallRow, wallCol]);
                if (this.grid[path[path.length-1][0]][path[path.length-1][1]] === color){
                    // we win
                    return true;
                }
                */
                if (wallSide === WallSide.Left){
                    return this.followEdge(path, wallSide, color, (direction+1)%4);
                }
                return this.followEdge(path, wallSide, color, (direction+3)%4);
            }
            return this.followEdge(path, wallSide, color, direction); // Keep moving
        }

        // Space ahead is not enterable, try space opposite wallSide
        if (wallSide === WallSide.Right){
            return this.followEdge(path, wallSide, color, (direction+1)%4);
        }
        return this.followEdge(path, wallSide, color, (direction+3)%4);
    }

    solveCircle2(row: number, col: number, line: FlowSpace, walls: number[][]){
        let paths = 0;
        const potentialPaths: [[[number, number]]] = [[[row, col]]];
        const successes: [boolean] = [false];
        // DOWN RIGHT UP LEFT
        const rightWalls = [[[row, col-1], [row+1, col-1]], [[row+1, col], [row+1, col+1]], [[row, col+1], [row-1, col+1]], [[row-1, col], [row-1, col-1]]];
        const leftWalls = [[[row, col+1], [row+1, col+1]], [[row-1, col], [row-1, col+1]], [[row, col-1], [row-1, col-1]], [[row+1, col], [row+1, col-1]]];
        const direction = [[row+1, col], [row, col+1], [row-1, col], [row, col-1]];

        for (let i = 0; i < 4; i+=1) {
            const tryrow = direction[i][0];
            const trycol = direction[i][1];
            if (!this.isWall(tryrow, trycol)) {
                // Make sure that this space is "on the edge", and that at least one of its walls is one of our walls
                const newWalls = this.isEdge2(tryrow, trycol);
                if (compEdges(walls, newWalls)) {
                    // Check if its a space we can actually go to.
                    const k = isCircle(this.grid[tryrow][trycol]);
                    if (k === FlowSpace.Empty || k === line) {
                        // Can go

                        // Are any of the walls on our right?
                        if (this.isWall(rightWalls[i][0][0], rightWalls[i][0][1]) || this.isWall(rightWalls[i][1][0], rightWalls[i][1][1])){
                            paths += 1;
                            // We go with wall on right
                            const potPath: [[number, number]] = [[row, col]];
                            const potSuc = this.followEdge(potPath, WallSide.Right, this.grid[row][col], i);
                            potentialPaths.push(potPath);
                            successes.push(potSuc);
                        }
                        // Any walls on left?
                        if (this.isWall(leftWalls[i][0][0], leftWalls[i][0][1]) || this.isWall(leftWalls[i][1][0], leftWalls[i][1][1])){
                            paths += 1
                            // We go with wall on left
                            const potPath: [[number, number]] = [[row, col]];
                            const potSuc = this.followEdge(potPath, WallSide.Left, this.grid[row][col], i);
                            potentialPaths.push(potPath);
                            successes.push(potSuc);
                        }
                    }
                    // No can go
                }
            }
        }
        if (paths === 0){
            return false;
        }
        if (paths > 2){
            console.log("huh");
        }
        let shortestpath = -1;
        let shortestindex = -1;
        // All paths generated, lets check em out.
        for (let i = 1; i < successes.length; i+=1) {
            const potPathRowEnd = potentialPaths[i][potentialPaths[i].length-1][0];
            const potPathColEnd = potentialPaths[i][potentialPaths[i].length-1][1];
            if (successes[i] && isCircle(this.grid[potPathRowEnd][potPathColEnd]) === line && !(potPathRowEnd === row && potPathColEnd === col)){
                // We did it reddit!
                if (potentialPaths[i].length-1 < shortestpath || shortestpath === -1){
                    shortestpath = potentialPaths[i].length-1;
                    shortestindex = i;
                }
            }
        }
        if (shortestindex === -1){
            return false;
        }
        this.mutateGrid(potentialPaths[shortestindex], line);
        console.log(`Was able to solve circle at ${row}, ${col}`);
        return true;

    }

    isEdge2(row: number, col: number){
        const walls = [];
        for (let i = row-1; i < row+2; i+=1){
            for (let j = col-1; j < col+2; j+=1){
                if (this.isWall(i, j)){
                    walls.push([i,j])
                }
            }
        }
        return walls;
    }

    // Attempts to solve the grid by calling "solveCircle" on every circle it comes across.
    loop() {
        let again = true;

        while (again) {
            again = false;
            for (let i = 0; i < this.grid.length; i += 1) {
                for (let j = 0; j < this.grid[0].length; j += 1) {
                    const k = isCircle(this.grid[i][j]);
                    if (k !== FlowSpace.Empty) {
                        const walls = this.isEdge2(i, j);
                        if (walls.length !== 0) {
                            if (this.solveCircle2(i, j, k, walls)){
                                again = true;
                                if (this.pain){
                                    this.pain = false;
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
    solve() {
        this.printGrid();
        console.log("Solving!");
        this.loop();
        const savedGrid = this.grid;
        if (!this.checkComplete()){
            while(!this.pain) {
                this.pain = true;
                this.loop();
            }
        }

        if (!this.checkComplete()){
            this.grid = savedGrid;
            this.pain = false;
            while(this.pain2val < pain2maxval && !this.pain2){
                this.pain2 = true;
                this.loop();
                if (this.pain2){
                    this.pain2val+=1;
                }
            }
        }
        this.checkComplete();
    }
}
