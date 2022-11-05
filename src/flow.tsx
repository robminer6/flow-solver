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
are only placed in the grid when we have a complete path, this function returns whether or not a circle
has a solution found for it already. */
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

/* This function is a mess, I'm sorry.
This function takes the grid as input along with any position within the grid.
The function returns whether or not the position given is "on the edge."
"On the edge" is defined as touching the edge of the grid, or a completed line or circle. */
function isEdge(grid: FlowSpace[][], row: number, col: number) {
    // Check if we're physically on the literal edge of the grid.
    if (
        row === 0 ||
        col === 0 ||
        row === grid.length - 1 ||
        col === grid[0].length - 1
    ) {
        return true;
    }
    if (grid[row - 1][col] !== FlowSpace.Empty) {
        // Space above isn't empty, let's see if it counts as an edge piece
        const upSpace: FlowSpace = isCircle(grid[row - 1][col]);
        if (upSpace !== FlowSpace.Empty) {
            // If we enter this if statement, the space above us is a circle
            const completedCirc = circleConnect(grid, row - 1, col, upSpace);
            if (completedCirc) {
                // If it's complete, this counts as an edge.
                return true;
            }
            // If not, we still might be edge elsewhere, so don't return false yet.
        } else {
            // Space above us is a completed line, return true.
            return true;
        }
    }
    // Repeat for space below
    if (grid[row + 1][col] !== FlowSpace.Empty) {
        const downSpace: FlowSpace = isCircle(grid[row + 1][col]);
        if (downSpace !== FlowSpace.Empty) {
            const completedCirc = circleConnect(grid, row + 1, col, downSpace);
            if (completedCirc) {
                return completedCirc;
            }
        } else {
            return true;
        }
    }
    // Repeat for space left
    if (grid[row][col - 1] !== FlowSpace.Empty) {
        const leftSpace: FlowSpace = isCircle(grid[row][col - 1]);
        if (leftSpace !== FlowSpace.Empty) {
            const completedCirc = circleConnect(grid, row, col - 1, leftSpace);
            if (completedCirc) {
                return completedCirc;
            }
        } else {
            return true;
        }
    }
    // Repeat for space right
    if (grid[row][col + 1] !== FlowSpace.Empty) {
        const rightSpace: FlowSpace = isCircle(grid[row][col + 1]);
        if (rightSpace !== FlowSpace.Empty) {
            const completedCirc = circleConnect(grid, row, col + 1, rightSpace);
            if (completedCirc) {
                return completedCirc;
            }
        } else {
            return true;
        }
    }
    if (grid[row - 1][col - 1] !== FlowSpace.Empty) {
        // If above left corner is either a line piece or a completed circle, return true.
        const upLeftSpace: FlowSpace = isCircle(grid[row - 1][col - 1]);
        if (upLeftSpace !== FlowSpace.Empty) {
            if (circleConnect(grid, row - 1, col - 1, upLeftSpace)) {
                return true;
            }
        } else {
            // Space above left is a completed line
            return true;
        }
    }
    if (grid[row + 1][col - 1] !== FlowSpace.Empty) {
        // Below left corner
        const downLeftSpace: FlowSpace = isCircle(grid[row + 1][col - 1]);
        if (downLeftSpace !== FlowSpace.Empty) {
            if (circleConnect(grid, row + 1, col - 1, downLeftSpace)) {
                return true;
            }
        } else {
            return true;
        }
    }
    if (grid[row - 1][col + 1] !== FlowSpace.Empty) {
        // Above right corner
        const upRightSpace: FlowSpace = isCircle(grid[row - 1][col + 1]);
        if (upRightSpace !== FlowSpace.Empty) {
            if (circleConnect(grid, row - 1, col + 1, upRightSpace)) {
                return true;
            }
        } else {
            return true;
        }
    }
    if (grid[row + 1][col + 1] !== FlowSpace.Empty) {
        // Below right corner
        const downRightSpace: FlowSpace = isCircle(grid[row + 1][col + 1]);
        if (downRightSpace !== FlowSpace.Empty) {
            if (circleConnect(grid, row + 1, col + 1, downRightSpace)) {
                return true;
            }
        } else {
            return true;
        }
    }
    return false;
}

export default class FlowGame {
    grid: FlowSpace[][];

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
        } else {
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

    /* Attempts to recursively calculate a solution to a circle.
    When the function is originally called, potentialPath will have the starting circle location as its only element
    and i and j will be an edge space adjacent to it.
    This function will return whether or not it has found a valid path to the other circle, and will modify
    potentialPath along the way. */
    solveCircleRecurse(
        row: number,
        col: number,
        potentialPath: [[number, number]],
        solelyEdge: boolean,
        circle: FlowSpace
    ): boolean {
        const lastspace: [number, number] =
            potentialPath[potentialPath.length - 1];
        if (row === potentialPath[0][0] && col === potentialPath[0][1]) {
            // console.log('full circle');
            return false; // Come full circle.
        }
        if (this.grid[row][col] === circle) {
            // If our current position is at the other circle, we win!
            // console.log("Good")
            potentialPath.push([row, col]);
            return true;
        }
        if (row !== 0 && lastspace[0] !== row - 1) {
            // Check space above and don't go there if we just came from there.
            if (
                isEdge(this.grid, row - 1, col) &&
                (this.grid[row - 1][col] === FlowSpace.Empty ||
                    this.grid[row - 1][col] === circle)
            ) {
                // If the space above us is on the edge and the space is either Empty or our finishing Circle, go there.
                // Add current space to potentialPath and call self again.
                potentialPath.push([row, col]);
                return this.solveCircleRecurse(
                    row - 1,
                    col,
                    potentialPath,
                    solelyEdge,
                    circle
                );
            }
        }
        if (row !== this.grid.length - 1 && lastspace[0] !== row + 1) {
            // Check space below.
            if (
                isEdge(this.grid, row + 1, col) &&
                (this.grid[row + 1][col] === FlowSpace.Empty ||
                    this.grid[row + 1][col] === circle)
            ) {
                potentialPath.push([row, col]);
                return this.solveCircleRecurse(
                    row + 1,
                    col,
                    potentialPath,
                    solelyEdge,
                    circle
                );
            }
        }
        if (col !== 0 && lastspace[1] !== col - 1) {
            // Check space left.
            if (
                isEdge(this.grid, row, col - 1) &&
                (this.grid[row][col - 1] === FlowSpace.Empty ||
                    this.grid[row][col - 1] === circle)
            ) {
                potentialPath.push([row, col]);
                return this.solveCircleRecurse(
                    row,
                    col - 1,
                    potentialPath,
                    solelyEdge,
                    circle
                );
            }
        }
        if (col !== this.grid[0].length - 1 && lastspace[1] !== col + 1) {
            // Check space right.
            if (
                isEdge(this.grid, row, col + 1) &&
                (this.grid[row][col + 1] === FlowSpace.Empty ||
                    this.grid[row][col + 1] === circle)
            ) {
                potentialPath.push([row, col]);
                return this.solveCircleRecurse(
                    row,
                    col + 1,
                    potentialPath,
                    solelyEdge,
                    circle
                );
            }
        }
        // console.log(`nowhere to go ${i} ${j}`);
        return false; // Couldn't find another space to go to.
    }

    // Takes in an acceptedPath and the line segment to change it to and changes the grid
    // to fill in the spaces with the correct line segments.
    mutateGrid(acceptedPath: [[number, number]], line: FlowSpace) {
        for (let i = 1; i < acceptedPath.length - 1; i += 1) {
            this.grid[acceptedPath[i][0]][acceptedPath[i][1]] = line;
        }
    }

    // This function sets up the solveCircleRecurse function by finding how many paths there are to follow
    solveCircle(
        row: number,
        col: number,
        solelyEdge: boolean,
        line: FlowSpace
    ) {
        // console.log(`Attempting to solve circle at ${i} ${j} its a ${this.grid[i][j]}`)
        let paths = 0;
        const potentialPathA: [[number, number]] = [[row, col]];
        const potentialPathB: [[number, number]] = [[row, col]];
        let asuccess: boolean = false;
        let bsuccess: boolean = false;
        if (row !== 0) {
            if (
                isEdge(this.grid, row - 1, col) &&
                this.grid[row - 1][col] === FlowSpace.Empty
            ) {
                // Can only have 1 path at this point
                // console.log("attempting to move up as a starting edge");
                paths += 1;
                asuccess = this.solveCircleRecurse(
                    row - 1,
                    col,
                    potentialPathA,
                    solelyEdge,
                    this.grid[row][col]
                );
            }
        }
        if (row !== this.grid.length - 1) {
            if (
                isEdge(this.grid, row + 1, col) &&
                this.grid[row + 1][col] === FlowSpace.Empty
            ) {
                // console.log("Attempting to move down from it.")
                paths += 1;
                if (paths === 1) {
                    // If this is the first path we're trying, assign this to A
                    asuccess = this.solveCircleRecurse(
                        row + 1,
                        col,
                        potentialPathA,
                        solelyEdge,
                        this.grid[row][col]
                    );
                } else {
                    // Else assign to B
                    bsuccess = this.solveCircleRecurse(
                        row + 1,
                        col,
                        potentialPathB,
                        solelyEdge,
                        this.grid[row][col]
                    );
                }
            }
        }
        if (col !== 0) {
            if (
                isEdge(this.grid, row, col - 1) &&
                this.grid[row][col - 1] === FlowSpace.Empty
            ) {
                // console.log("attempt move left")
                paths += 1;
                if (paths === 1) {
                    asuccess = this.solveCircleRecurse(
                        row,
                        col - 1,
                        potentialPathA,
                        solelyEdge,
                        this.grid[row][col]
                    );
                } else {
                    bsuccess = this.solveCircleRecurse(
                        row,
                        col - 1,
                        potentialPathB,
                        solelyEdge,
                        this.grid[row][col]
                    );
                }
            }
        }
        if (col !== this.grid[0].length - 1) {
            if (
                isEdge(this.grid, row, col + 1) &&
                this.grid[row][col + 1] === FlowSpace.Empty
            ) {
                // console.log('attempt move right');
                paths += 1;
                if (paths === 1) {
                    asuccess = this.solveCircleRecurse(
                        row,
                        col + 1,
                        potentialPathA,
                        solelyEdge,
                        this.grid[row][col]
                    );
                } else {
                    bsuccess = this.solveCircleRecurse(
                        row,
                        col + 1,
                        potentialPathB,
                        solelyEdge,
                        this.grid[row][col]
                    );
                }
            }
        }
        if (paths === 1) {
            // Well we better hope potential path A did us good.
            if (!asuccess) {
                // fuck.
                // this.printGrid();
                // console.log("Fuck");
                return;
            }
            // A succeeded, mutate the grid for this solution.
            this.mutateGrid(potentialPathA, line);
        }
        if (paths === 2) {
            if (!asuccess) {
                if (!bsuccess) {
                    // console.log("Fuck me.");
                    // this.printGrid();
                } else {
                    // Just b succeeded, so mutate grid.
                    this.mutateGrid(potentialPathB, line);
                }
            } else if (!bsuccess) {
                // Just A succeeded, mutate grid
                this.mutateGrid(potentialPathA, line);
            } else {
                if (potentialPathA.length === potentialPathB.length) {
                    console.log("Come on man, this is so sad.");
                    // A and B have equal lengths. Oh no.
                    return;
                }
                if (potentialPathA.length < potentialPathB.length) {
                    this.mutateGrid(potentialPathA, line); // A was better.
                } else {
                    this.mutateGrid(potentialPathB, line); // B was better.
                }
            }
        }
    }

    // Attempts to solve the grid by calling "solveCircle" on every circle it comes across.
    loop(solelyEdge: boolean) {
        for (let i = 0; i < this.grid.length; i += 1) {
            for (let j = 0; j < this.grid[0].length; j += 1) {
                if (isEdge(this.grid, i, j) || !solelyEdge) {
                    const k: FlowSpace = isCircle(this.grid[i][j]);
                    if (
                        k !== FlowSpace.Empty &&
                        !this.checkCirclePath(i, j, k)
                    ) {
                        // Need to solve circle
                        this.solveCircle(i, j, solelyEdge, k);
                    }
                }
            }
        }
    }

    // Solves the grid and prints it out afterwards.
    solve() {
        this.printGrid();
        console.log("Solving!");
        this.loop(true);
        this.checkComplete();
    }
}
