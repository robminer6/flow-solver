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

function isCircle(entry: FlowSpace) : FlowSpace{
    // This function takes a FlowSpace as input and if the entry is a circle, returns the
    // corresponding line flow space. Else, returns FlowSpace.Empty as a failure condition.
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

function circleConnect(grid: FlowSpace[][], i: number, j: number, line: FlowSpace){
    /*
    This function takes in the grid as input, along with a position and the corresponding line color.
    The input position MUST be a Circle FlowSpace.
    Function returns whether the circle has any adjacent connected line segments. Because line segments
    are only placed in the grid when we have a complete path, this function returns whether or not a circle
    has a solution found for it already.
     */
    if (i !== 0){
        if (grid[i-1][j] === line){
            return true;
        }
    }
    if (i !== grid.length-1){
        if (grid[i+1][j] === line){
            return true;
        }
    }
    if (j !== 0){
        if (grid[i][j-1] === line){
            return true;
        }
    }
    if (j !== grid.length-1){
        if (grid[i][j+1] === line){
            return true;
        }
    }
    return false;
}

function isEdge(grid: FlowSpace[][], i: number, j: number){
    /*
    This function is a mess, I'm sorry.
    This function takes the grid as input along with any position within the grid and an optional Circle
    FlowSpace
    The function returns whether or not the position given is "on the edge"
    "On the edge" is defined as touching the edge of the grid, or a completed line or circle.
     */
    if (i === 0 || j === 0 || i === grid.length-1 || j === grid[0].length-1){
        return true; // Check if we're physically on the literal edge of the grid.
    }
    if (grid[i-1][j] !== FlowSpace.Empty){ // Space above isn't empty, lets see if it counts as an edge piece
        const k : FlowSpace = isCircle(grid[i-1][j]); // If it is a circle, we'll get a non Empty enum back
        if (k !== FlowSpace.Empty){ // If we enter this if statement, the space above us is a circle
            const completedCirc = circleConnect(grid, i-1, j, k); // Check if the circle is completed already
            if (completedCirc){
                return true; // If it's complete, this counts as edge. If not, we still might be edge elsewhere, so don't return false yet.
            }
        }
        else {
            return true; // Space above us is a completed line, return true.
        }
    }
    if (grid[i+1][j] !== FlowSpace.Empty){ // Repeat for space below
        const k : FlowSpace = isCircle(grid[i+1][j]);
        if (k !== FlowSpace.Empty){
            const completedCirc = circleConnect(grid, i+1, j, k);
            if (completedCirc){
                return completedCirc;
            }
        }
        else{
            return true;
        }
    }
    if (grid[i][j-1] !== FlowSpace.Empty){ // Repeat for space left
        const k : FlowSpace = isCircle(grid[i][j-1]);
        if (k !== FlowSpace.Empty){
            const completedCirc = circleConnect(grid, i, j-1, k);
            if (completedCirc){
                return completedCirc;
            }
        }
        else{
            return true;
        }
    }
    if (grid[i][j+1] !== FlowSpace.Empty){ // Repeat for space right
        const k : FlowSpace = isCircle(grid[i][j+1]);
        if (k !== FlowSpace.Empty){
            const completedCirc = circleConnect(grid, i, j+1, k);
            if (completedCirc){
                return completedCirc;
            }
        }
        else {
            return true;
        }
    }
    if (grid[i-1][j-1] !== FlowSpace.Empty){ // If above left corner is either a line piece or a completed circle, return true.
        const k : FlowSpace = isCircle(grid[i-1][j-1]);
        if (k !== FlowSpace.Empty){
            if (circleConnect(grid, i-1, j-1, k)){
                return true;
            }
        }
        else {
            return true; // Space above left is a completed line
        }
    }
    if (grid[i+1][j-1] !== FlowSpace.Empty){ // Below left corner
        const k : FlowSpace = isCircle(grid[i+1][j-1]);
        if (k !== FlowSpace.Empty){
            if (circleConnect(grid, i+1, j-1, k)){
                return true;
            }
        }
        else {
            return true;
        }
    }
    if (grid[i-1][j+1] !== FlowSpace.Empty){ // Above right corner
        const k : FlowSpace = isCircle(grid[i-1][j+1]);
        if (k !== FlowSpace.Empty){
            if(circleConnect(grid, i-1, j+1, k)){
                return true;
            }
        }
        else {
            return true;
        }
    }
    if (grid[i+1][j+1] !== FlowSpace.Empty){ // Below right corner
        const k : FlowSpace = isCircle(grid[i+1][j+1]);
        if (k !== FlowSpace.Empty){
            if (circleConnect(grid, i+1, j+1, k)){
                return true;
            }
        }
        else {
            return true;
        }
    }
    return false;

}

export default class FlowGame {
    grid: FlowSpace[][];

    constructor() {
        /*
        This constructor currently just makes a basic grid without taking in input.
         */
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
        ]; // Unsolved default puzzle
        // this.checkComplete();
        /*
        this.grid = [
            [
                FlowSpace.RedCircle,
                FlowSpace.Green,
                FlowSpace.GreenCircle,
                FlowSpace.Yellow,
                FlowSpace.YellowCircle,
            ],
            [
                FlowSpace.Red,
                FlowSpace.Green,
                FlowSpace.BlueCircle,
                FlowSpace.Yellow,
                FlowSpace.OrangeCircle,
            ],
            [
                FlowSpace.Red,
                FlowSpace.Green,
                FlowSpace.Blue,
                FlowSpace.Yellow,
                FlowSpace.Orange,
            ],
            [
                FlowSpace.Red,
                FlowSpace.GreenCircle,
                FlowSpace.Blue,
                FlowSpace.YellowCircle,
                FlowSpace.Orange,
            ],
            [
                FlowSpace.Red,
                FlowSpace.RedCircle,
                FlowSpace.BlueCircle,
                FlowSpace.OrangeCircle,
                FlowSpace.Orange,
            ],
        ]; // Solved default puzzle
        this.checkComplete();

         */
    }

    checkCirclePath(row: number, col: number, line: FlowSpace) {
        /*
        This function is given a row and column as input and a line.
        The given row and col MUST be a circle.
        This function returns whether the given circle is fully connected to its pair.
         */
        let i = row;
        let j = col;
        const circle: FlowSpace = this.grid[i][j];
        let pasti = i; // These variables help us determine what our past square was, so we don't go there
        let pastj = j;
        while (this.grid[i][j] !== circle || (i === pasti && j === pastj)) {
            let nexti = -1;
            let nextj = -1;
            if (i !== 0 && pasti !== i - 1) {
                // Check square above
                if (
                    this.grid[i - 1][j] === line ||
                    this.grid[i - 1][j] === circle
                ) {
                    nexti = i - 1;
                    nextj = j;
                }
            }
            if (i !== this.grid.length - 1 && pasti !== i + 1) {
                // Check square below
                if (
                    this.grid[i + 1][j] === line ||
                    this.grid[i + 1][j] === circle
                ) {
                    if (nexti !== -1) {
                        console.log(`No 2x2 allowed! Space:${i} ${j}`);
                        return false;
                    }
                    nexti = i + 1;
                    nextj = j;
                }
            }
            if (j !== 0 && pastj !== j - 1) {
                // Check square left
                if (
                    this.grid[i][j - 1] === line ||
                    this.grid[i][j - 1] === circle
                ) {
                    if (nexti !== -1) {
                        console.log(`No 2x2 allowed! Space:${i} ${j}`);
                        return false;
                    }
                    nexti = i;
                    nextj = j - 1;
                }
            }
            if (j !== this.grid[0].length && pastj !== j + 1) {
                // Check square right
                if (
                    this.grid[i][j + 1] === line ||
                    this.grid[i][j + 1] === circle
                ) {
                    if (nexti !== -1) {
                        console.log(`No 2x2 allowed! Space:${i} ${j}`);
                        return false;
                    }
                    nexti = i;
                    nextj = j + 1;
                }
            }
            if (nexti === -1) {
                return false;
            }
            pasti = i;
            pastj = j;
            i = nexti;
            j = nextj;
        }
        return true;
    }

    checkComplete() {
        // This function loops through the grid and returns whether its been solved (call checkCirclePath on every circle)
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

    printGrid() {
        /*
        Prints the grid. This is basically the only function name that's self descriptive.
         */
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

    solveCircleRecurse(i: number, j: number, potentialPath: [[number, number]], solelyEdge: boolean, circle: FlowSpace): boolean {
        /*
        This is a recursive function which attempts to calculate a solution to a circle.
        When the function is originally called, potentialPath will have the starting circle location as its only element
        and i and j will be an edge space adjacent to it.
        This function will return whether or not it has found a valid path to the other circle, and will modify
        potentialPath along the way.
         */
        const lastspace: [number, number] = potentialPath[potentialPath.length-1];
        if (i === potentialPath[0][0] && j === potentialPath[0][1]){
            // console.log('full circle');
            return false; // Come full circle.
        }
        if (this.grid[i][j] === circle){
            // If our current position is at the other circle, we win!
            // console.log("Good")
            potentialPath.push([i,j]);
            return true;
        }
        if (i !== 0 && lastspace[0] !== i-1){
            // Check space above and don't go there if we just came from there.
            if (isEdge(this.grid, i-1, j) && (this.grid[i-1][j] === FlowSpace.Empty || this.grid[i-1][j] === circle)){
                // If the space above us is on the edge and the space is either Empty or our finishing Circle, go there.
                potentialPath.push([i,j]); // Add current space to potentialPath and call self again.
                return this.solveCircleRecurse(i-1, j, potentialPath, solelyEdge, circle);
            }
        }
        if (i !== this.grid.length-1 && lastspace[0] !== i+1){
            // Check space below.
            if (isEdge(this.grid, i+1, j) && (this.grid[i+1][j] === FlowSpace.Empty || this.grid[i+1][j] === circle)){
                potentialPath.push([i,j]);
                return this.solveCircleRecurse(i+1, j, potentialPath, solelyEdge, circle);
            }
        }
        if (j !== 0 && lastspace[1] !== j-1){
            // Check space left.
            if (isEdge(this.grid, i, j-1) && (this.grid[i][j-1] === FlowSpace.Empty || this.grid[i][j-1] === circle)){
                potentialPath.push([i,j]);
                return this.solveCircleRecurse(i, j-1, potentialPath, solelyEdge, circle);
            }
        }
        if (j !== this.grid[0].length-1 && lastspace[1] !== j+1){
            // Check space right.
            if (isEdge(this.grid, i, j+1) && (this.grid[i][j+1] === FlowSpace.Empty || this.grid[i][j+1] === circle)){
                potentialPath.push([i,j]);
                return this.solveCircleRecurse(i, j+1, potentialPath, solelyEdge, circle);
            }
        }
        // console.log(`nowhere to go ${i} ${j}`);
        return false; // Couldn't find another space to go to.
    }

    mutateGrid(acceptedPath: [[number, number]], line:FlowSpace){
        // This function takes in an acceptedPath and the line segment to change it to and changes the grid
        // To fill in the spaces with the correct line segments
        for (let i = 1; i < acceptedPath.length-1; i+=1){
            this.grid[acceptedPath[i][0]][acceptedPath[i][1]] = line;
        }
    }

    solveCircle(i: number, j: number, solelyEdge: boolean, line: FlowSpace){
        // console.log(`Attempting to solve circle at ${i} ${j} its a ${this.grid[i][j]}`)
        // This function sets up the solveCircleRecurse function by finding how many paths there are to follow
        let paths = 0;
        const potentialPathA: [[number, number]] = [[i,j]];
        const potentialPathB: [[number, number]] = [[i,j]];
        let asuccess: boolean = false;
        let bsuccess: boolean = false;
        if (i !== 0){
            if (isEdge(this.grid, i-1, j) && this.grid[i-1][j] === FlowSpace.Empty){
                // console.log("attempting to move up as a starting edge");
                paths+=1; // Can only have 1 path at this point
                asuccess = this.solveCircleRecurse(i-1, j, potentialPathA, solelyEdge, this.grid[i][j]);
            }
        }
        if (i!==this.grid.length-1){
            if (isEdge(this.grid, i+1, j) && this.grid[i+1][j] === FlowSpace.Empty){
                // console.log("Attempting to move down from it.")
                paths+=1;
                if (paths === 1){ // If this is the first path we're trying, assign this to A
                    asuccess = this.solveCircleRecurse(i+1, j, potentialPathA, solelyEdge, this.grid[i][j]);
                }
                else{ // Else assign to B
                    bsuccess = this.solveCircleRecurse(i+1, j, potentialPathB, solelyEdge, this.grid[i][j]);
                }
            }
        }
        if (j !== 0){
            if (isEdge(this.grid, i, j-1) && this.grid[i][j-1] === FlowSpace.Empty){
                // console.log("attempt move left")
                paths+=1;
                if (paths === 1){
                    asuccess = this.solveCircleRecurse(i, j-1, potentialPathA, solelyEdge, this.grid[i][j]);
                }
                else{
                    bsuccess = this.solveCircleRecurse(i, j-1, potentialPathB, solelyEdge, this.grid[i][j]);
                }
            }
        }
        if (j !== this.grid[0].length-1){
            if (isEdge(this.grid, i, j+1) && this.grid[i][j+1] === FlowSpace.Empty){
                // console.log('attempt move right');
                paths+=1;
                if (paths === 1){
                    asuccess = this.solveCircleRecurse(i, j+1, potentialPathA, solelyEdge, this.grid[i][j]);
                }
                else{
                    bsuccess = this.solveCircleRecurse(i, j+1, potentialPathB, solelyEdge, this.grid[i][j]);
                }
            }
        }
        if (paths === 1){
            // Well we better hope potential path A did us good.
            if (!asuccess){
                // fuck.
                // this.printGrid();
                // console.log("Fuck");
                return;
            }
            this.mutateGrid(potentialPathA, line); // A succeeded, mutate the grid for this solution.
        }
        if (paths === 2){
            if (!asuccess){
                if (!bsuccess){
                    // console.log("Fuck me.");
                    // this.printGrid();
                }
                else{
                    // Just b succeeded, so mutate grid.
                    this.mutateGrid(potentialPathB, line);
                }
            }
            else if (!bsuccess){
                // Just a succeeded, mutate grid
                this.mutateGrid(potentialPathA, line);
            }
            else{
                if (potentialPathA.length === potentialPathB.length){
                    console.log("Come on man, this is so sad.");
                    // A and B have equal lengths. Oh no.
                    return;
                }
                if (potentialPathA.length < potentialPathB.length){
                    this.mutateGrid(potentialPathA, line); // A was better.
                }
                else{
                    this.mutateGrid(potentialPathB, line); // B was better.
                }
            }
        }
    }

    loop(solelyEdge: boolean){
        /*
        This function attempts to solve the grid, by calling "solveCircle" on every circle it comes across.
         */
        for (let i = 0; i < this.grid.length; i+=1){
            for (let j = 0; j < this.grid[0].length; j+=1){
                if (isEdge(this.grid, i, j) || !solelyEdge){
                    const k : FlowSpace = isCircle(this.grid[i][j]);
                    if (k !== FlowSpace.Empty && !this.checkCirclePath(i, j, k)){
                        // Need to solve circle
                        this.solveCircle(i, j, solelyEdge, k);
                    }
                }
            }
        }
    }

    solve() {
        /*
        This function solves the grid and prints it out afterwards.
         */
        this.printGrid();
        console.log("Solving!")
        this.loop(true);
        this.checkComplete();
    }
}
