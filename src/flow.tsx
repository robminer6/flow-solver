/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
// const pain2maxval = 3;
const leroymaxval = 3;
const debug = false;

class Tile {
    color: string;

    circle: boolean;

    head: boolean;

    constructor(color: string, circle: boolean, head: boolean) {
        this.color = color;
        this.circle = circle;
        this.head = head;
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

    pain: boolean = false;

    pain2: boolean = false;

    pain2val: number = 1;

    pain2attempts: [number, number, Tile] = [-1, -1, new Tile("empty", false, false)];

    // Constructs our grid, usually by reading from a string array.
    constructor(arr?: string[][]) {
        if (arr) {
            // Constructs grid based on an array of strings. Used when reading from a file.
            for (let i = 0; i < arr.length; i += 1) {
                this.grid.push([]);
                for (let j = 0; j < arr[i].length; j += 1) {
                    const color = colorCharToString(arr[i][j]);
                    this.grid[i].push(
                        new Tile(color, arr[i][j] !== ".", arr[i][j] !== arr[i][j].toLowerCase())
                    );
                    this.headLocations[color] = [];
                    this.headLocations[color].push([i, j]);
                }
            }
        } else if (debug) {
            const file =
                ".C...B.RY\n" +
                ".M.G..R..\n" +
                "........C\n" +
                "..YM...G.\n" +
                "...B.....\n" +
                ".........\n" +
                ".........\n" +
                ".O.....O.\n" +
                ".........";
            const lines = file.split(/\r?\n/);
            const board: string[][] = [];
            lines.forEach((line) => {
                board.push(line.split(""));
            });
            for (let i = 0; i < board.length; i += 1) {
                this.grid.push([]);
                for (let j = 0; j < board[i].length; j += 1) {
                    const color = colorCharToString(board[i][j]);
                    this.grid[i].push(
                        new Tile(
                            color,
                            board[i][j] !== ".",
                            board[i][j] !== board[i][j].toLowerCase()
                        )
                    );
                    this.headLocations[color] = [];
                    this.headLocations[color].push([i, j]);
                }
            }
        }
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

    // Circles are only walls if they are FULLY complete
    isWall(row: number, col: number) {
        if (!this.inBounds(row, col)) {
            return true;
        }
        if (this.grid[row][col].circle) {
            if (this.circleConnect(row, col)) {
                return true;
            }
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
                    // TODO: AJ did you forget to check for 2x2 here?
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
            if (col !== this.grid[0].length && pastCol !== col + 1) {
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
        for (let i = 0; i < this.grid.length; i += 1) {
            let linetoprint = "";
            for (let j = 0; j < this.grid[0].length; j += 1) {
                if (this.grid[i][j].circle) {
                    linetoprint += `${this.grid[i][j].toString().substring(0, 3)}C `;
                } else {
                    linetoprint += `${this.grid[i][j].toString().substring(0, 3)}  `;
                }
            }
            console.log(linetoprint);
        }
    }

    // Takes in an acceptedPath and the line segment to change it to and changes the grid
    // to fill in the spaces with the correct line segments.
    mutateGrid(acceptedPath: [[number, number]], line: Tile) {
        for (let i = 1; i < acceptedPath.length - 1; i += 1) {
            this.grid[acceptedPath[i][0]][acceptedPath[i][1]] = line;
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

    LEEEEROOOOOYJENKINNNNNS(path: [[number, number]], color: string, direction: Direction) {
        const n = path.length;
        let i = 0;
        let curRow = path[n - 1][0];
        let curCol = path[n - 1][1];
        let leftRow = curRow;
        let leftCol = curCol;
        let rightRow = curRow;
        let rightCol = curCol;
        let rowAdd = 0;
        let colAdd = 0;
        if (direction === Direction.Down) {
            rowAdd = 1;
            leftCol = curCol + 1;
            rightCol = curCol - 1;
        }
        if (direction === Direction.Right) {
            colAdd = 1;
            leftRow = curRow - 1;
            rightRow = curRow + 1;
        }
        if (direction === Direction.Up) {
            rowAdd = -1;
            leftCol = curCol - 1;
            rightCol = curCol + 1;
        }
        if (direction === Direction.Left) {
            colAdd = -1;
            leftRow = curRow - 1;
            rightRow = curRow + 1;
        }
        curRow += rowAdd;
        curCol += colAdd;
        leftRow += rowAdd;
        leftCol += colAdd;
        rightRow += rowAdd;
        rightCol += colAdd;
        while (
            this.inBounds(curRow, curCol) &&
            this.inBounds(leftRow, leftCol) &&
            this.inBounds(rightRow, rightCol) &&
            i < leroymaxval
        ) {
            path.push([curRow, curCol]);
            if (this.grid[curRow][curCol].color === color && this.grid[curRow][curCol].circle) {
                return true;
            }
            if (this.isWall(curRow, curCol) || this.grid[curRow][curCol].circle) {
                return false;
            }
            if (this.grid[leftRow][leftCol].color === color && this.grid[leftRow][leftCol].circle) {
                path.push([leftRow, leftCol]);
                return true;
            }
            if (
                this.grid[rightRow][rightCol].color === color &&
                this.grid[rightRow][rightCol].circle
            ) {
                path.push([rightRow, rightCol]);
                return true;
            }
            curRow += rowAdd;
            curCol += colAdd;
            leftRow += rowAdd;
            leftCol += colAdd;
            rightRow += rowAdd;
            rightCol += colAdd;
            i += 1;
        }
        return false;
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
        path: [[number, number]],
        wallSide: WallSide,
        color: string,
        given_dir: Direction
    ): boolean {
        const n = path.length;
        const curRow = path[n - 1][0];
        const curCol = path[n - 1][1];
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
            if (this.grid[newRow][newCol].circle && this.grid[newRow][newCol].color !== color) {
                if (!this.pain) {
                    return false; // Found an uncompleted circle ahead of us, no go.
                }
                // Turn away from the wall and LEEEEERROOOOOOOY JENKINNNNNNNNS ourselves until we either win or hit another problem
                let tmpDirection;
                if (wallSide === WallSide.Right) {
                    tmpDirection = (direction + 1) % 4;
                } else {
                    tmpDirection = (direction + 3) % 4;
                }
                return this.LEEEEROOOOOYJENKINNNNNS(path, color, tmpDirection);
            }

            // We can move there, lets do it
            path.push([newRow, newCol]);

            // Can move there, so we're going to
            if (
                this.grid[path[path.length - 1][0]][path[path.length - 1][1]].color === color &&
                this.grid[path[path.length - 1][0]][path[path.length - 1][1]].circle
            ) {
                // we win
                return true;
            }

            // Maybe we weren't allowed to do this.
            if (!this.checkFreedom(checkRow, checkCol, color)) {
                return false; // Found a circle on the space opposite of wallSide that had nowhere to go.
            }

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

            // See if we still have wall on the correct side
            if (!this.isWall(wallRow, wallCol)) {
                // Ack, wall has disappeared out from under us. It must have gone to the wallSide

                if (wallSide === WallSide.Left) {
                    return this.followEdge(path, wallSide, color, (direction + 1) % 4);
                }
                return this.followEdge(path, wallSide, color, (direction + 3) % 4);
            }
            return this.followEdge(path, wallSide, color, direction); // Keep moving
        }

        // Space ahead is not enterable, try space opposite wallSide
        if (wallSide === WallSide.Right) {
            return this.followEdge(path, wallSide, color, (direction + 1) % 4);
        }
        return this.followEdge(path, wallSide, color, (direction + 3) % 4);
    }

    solveCircle2(row: number, col: number, line: Tile, walls: number[][]) {
        let paths = 0;
        const potentialPaths: [[[number, number]]] = [[[row, col]]];
        const successes: [boolean] = [false];
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
                    if (
                        this.grid[tryrow][trycol].color === "empty" ||
                        (this.grid[tryrow][trycol].circle &&
                            this.grid[tryrow][trycol].color === line.color)
                    ) {
                        // Can go

                        // Are any of the walls on our right?
                        if (
                            this.isWall(rightWalls[i][0][0], rightWalls[i][0][1]) ||
                            this.isWall(rightWalls[i][1][0], rightWalls[i][1][1])
                        ) {
                            paths += 1;
                            // We go with wall on right
                            const potPath: [[number, number]] = [[row, col]];
                            const potSuc = this.followEdge(
                                potPath,
                                WallSide.Right,
                                this.grid[row][col].color,
                                i
                            );
                            potentialPaths.push(potPath);
                            successes.push(potSuc);
                        }
                        // Any walls on left?
                        if (
                            this.isWall(leftWalls[i][0][0], leftWalls[i][0][1]) ||
                            this.isWall(leftWalls[i][1][0], leftWalls[i][1][1])
                        ) {
                            paths += 1;
                            // We go with wall on left
                            const potPath: [[number, number]] = [[row, col]];
                            const potSuc = this.followEdge(
                                potPath,
                                WallSide.Left,
                                this.grid[row][col].color,
                                i
                            );
                            potentialPaths.push(potPath);
                            successes.push(potSuc);
                        }
                    }
                    // No can go
                }
            }
        }
        if (paths === 0) {
            return false;
        }
        if (paths > 2) {
            console.log("huh");
        }
        let shortestpath = -1;
        let shortestindex = -1;
        // All paths generated, lets check em out.
        for (let i = 1; i < successes.length; i += 1) {
            const potPathRowEnd = potentialPaths[i][potentialPaths[i].length - 1][0];
            const potPathColEnd = potentialPaths[i][potentialPaths[i].length - 1][1];
            if (
                successes[i] &&
                this.grid[potPathRowEnd][potPathColEnd].circle &&
                this.grid[potPathRowEnd][potPathColEnd].color === line.color &&
                !(potPathRowEnd === row && potPathColEnd === col)
            ) {
                // We did it reddit!
                if (potentialPaths[i].length - 1 < shortestpath || shortestpath === -1) {
                    shortestpath = potentialPaths[i].length - 1;
                    shortestindex = i;
                }
            }
        }
        if (shortestindex === -1) {
            return false;
        }
        this.mutateGrid(potentialPaths[shortestindex], line);
        // console.log(`Was able to solve circle at ${row}, ${col}`);
        return true;
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
    loop() {
        let again = true;
        while (again) {
            again = false;
            for (let i = 0; i < this.grid.length; i += 1) {
                for (let j = 0; j < this.grid[0].length; j += 1) {
                    const line = new Tile(this.grid[i][j].color, false, false);
                    if (this.grid[i][j].circle && !this.checkCirclePath(i, j)) {
                        const walls = this.isEdge2(i, j);
                        if (walls.length !== 0) {
                            if (this.solveCircle2(i, j, line, walls)) {
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
    solve() {
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
        this.checkComplete();
    }
}
