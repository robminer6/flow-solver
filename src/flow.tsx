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

function isCircle(entry: FlowSpace) {
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

function isEdge(grid: FlowSpace[][], i: number, j: number, circle?: FlowSpace){
    if (i === 0 || j === 0 || i === grid.length-1 || j === grid[0].length-1){
        return true;
    }
    if (grid[i-1][j] !== FlowSpace.Empty){
        const k : FlowSpace = isCircle(grid[i-1][j]);
        if (k !== FlowSpace.Empty){
            const completedCirc = circleConnect(grid, i-1, j, k);
            if (circle != null && k === isCircle(circle)){
                if (completedCirc){
                    return completedCirc;
                }
            }
            else{
                return completedCirc;
            }
        }
        return true;
    }
    if (grid[i+1][j] !== FlowSpace.Empty){
        const k : FlowSpace = isCircle(grid[i+1][j]);
        if (k !== FlowSpace.Empty){
            const completedCirc = circleConnect(grid, i+1, j, k);
            if (circle != null && k === isCircle(circle)){
                if (completedCirc){
                    return completedCirc;
                }
            }
            else{
                return completedCirc;
            }
        }
        return true;
    }
    if (grid[i][j-1] !== FlowSpace.Empty){
        const k : FlowSpace = isCircle(grid[i][j-1]);
        if (k !== FlowSpace.Empty){
            const completedCirc = circleConnect(grid, i, j-1, k);
            if (circle != null && k === isCircle(circle)){
                if (completedCirc){
                    return completedCirc;
                }
            }
            else{
                return completedCirc;
            }
        }
        return true;
    }
    if (grid[i][j+1] !== FlowSpace.Empty){
        const k : FlowSpace = isCircle(grid[i][j+1]);
        if (k !== FlowSpace.Empty){
            const completedCirc = circleConnect(grid, i, j+1, k);
            if (circle != null && k === isCircle(circle)){
                if (completedCirc){
                    return completedCirc;
                }
            }
            else{
                return completedCirc;
            }
        }
        return true;
    }
    if (grid[i-1][j-1] !== FlowSpace.Empty){
        const k : FlowSpace = isCircle(grid[i-1][j-1]);
        if (k !== FlowSpace.Empty){
            return circleConnect(grid, i-1, j-1, k);
        }
        return true;
    }
    if (grid[i+1][j-1] !== FlowSpace.Empty){
        const k : FlowSpace = isCircle(grid[i+1][j-1]);
        if (k !== FlowSpace.Empty){
            return circleConnect(grid, i+1, j-1, k);
        }
        return true;
    }
    if (grid[i-1][j+1] !== FlowSpace.Empty){
        const k : FlowSpace = isCircle(grid[i-1][j+1]);
        if (k !== FlowSpace.Empty){
            return circleConnect(grid, i-1, j+1, k);
        }
        return true;
    }
    if (grid[i+1][j+1] !== FlowSpace.Empty){
        const k : FlowSpace = isCircle(grid[i+1][j+1]);
        if (k !== FlowSpace.Empty){
            return circleConnect(grid, i+1, j+1, k);
        }
        return true;
    }
    return false;

}

export default class FlowGame {
    grid: FlowSpace[][];

    constructor() {
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
        let i = row;
        let j = col;
        const circle: FlowSpace = this.grid[i][j];
        let pasti = i;
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
        const lastspace: [number, number] = potentialPath[potentialPath.length-1];
        if (i === potentialPath[0][0] && j === potentialPath[0][1]){
            // console.log('full circle');
            return false; // Come full circle.
        }
        if (this.grid[i][j] === circle){
            // console.log("Good")
            potentialPath.push([i,j]);
            return true;
        }
        if (i !== 0 && lastspace[0] !== i-1){
            // Check space above.
            if (isEdge(this.grid, i-1, j, circle) && (this.grid[i-1][j] === FlowSpace.Empty || this.grid[i-1][j] === circle)){
                potentialPath.push([i,j]);
                return this.solveCircleRecurse(i-1, j, potentialPath, solelyEdge, circle);
            }
        }
        if (i !== this.grid.length-1 && lastspace[0] !== i+1){
            // Check space below.
            if (isEdge(this.grid, i+1, j, circle) && (this.grid[i+1][j] === FlowSpace.Empty || this.grid[i+1][j] === circle)){
                potentialPath.push([i,j]);
                return this.solveCircleRecurse(i+1, j, potentialPath, solelyEdge, circle);
            }
        }
        if (j !== 0 && lastspace[1] !== j-1){
            // Check space left.
            if (isEdge(this.grid, i, j-1, circle) && (this.grid[i][j-1] === FlowSpace.Empty || this.grid[i][j-1] === circle)){
                potentialPath.push([i,j]);
                return this.solveCircleRecurse(i, j-1, potentialPath, solelyEdge, circle);
            }
        }
        if (j !== this.grid[0].length-1 && lastspace[1] !== j+1){
            // Check space right.
            if (isEdge(this.grid, i, j+1, circle) && (this.grid[i][j+1] === FlowSpace.Empty || this.grid[i][j+1] === circle)){
                potentialPath.push([i,j]);
                return this.solveCircleRecurse(i, j+1, potentialPath, solelyEdge, circle);
            }
        }
        // console.log(`nowhere to go ${i} ${j}`);
        return false;
    }

    mutateGrid(acceptedPath: [[number, number]], line:FlowSpace){
        for (let i = 1; i < acceptedPath.length-1; i+=1){
            this.grid[acceptedPath[i][0]][acceptedPath[i][1]] = line;
        }
    }

    solveCircle(i: number, j: number, solelyEdge: boolean, line: FlowSpace){
        // console.log(`Attempting to solve circle at ${i} ${j} its a ${this.grid[i][j]}`)
        let paths = 0;
        const potentialPathA: [[number, number]] = [[i,j]];
        const potentialPathB: [[number, number]] = [[i,j]];
        let asuccess: boolean = false;
        let bsuccess: boolean = false;
        if (i !== 0){
            if (isEdge(this.grid, i-1, j, this.grid[i][j]) && this.grid[i-1][j] === FlowSpace.Empty){
                // console.log("attempting to move up");
                paths+=1;
                asuccess = this.solveCircleRecurse(i-1, j, potentialPathA, solelyEdge, this.grid[i][j]);
            }
        }
        if (i!==this.grid.length-1){
            if (isEdge(this.grid, i+1, j, this.grid[i][j]) && this.grid[i+1][j] === FlowSpace.Empty){
                // console.log("Attempting to move down from it.")
                paths+=1;
                if (paths === 1){
                    asuccess = this.solveCircleRecurse(i+1, j, potentialPathA, solelyEdge, this.grid[i][j]);
                }
                else{
                    bsuccess = this.solveCircleRecurse(i+1, j, potentialPathB, solelyEdge, this.grid[i][j]);
                }
            }
        }
        if (j !== 0){
            if (isEdge(this.grid, i, j-1, this.grid[i][j]) && this.grid[i][j-1] === FlowSpace.Empty){
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
            if (isEdge(this.grid, i, j+1, this.grid[i][j]) && this.grid[i][j+1] === FlowSpace.Empty){
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
            this.mutateGrid(potentialPathA, line);
        }
        if (paths === 2){
            if (!asuccess){
                if (!bsuccess){
                    // console.log("Fuck me.");
                    // this.printGrid();
                }
                else{
                    // Just b
                    this.mutateGrid(potentialPathB, line);
                }
            }
            else if (!bsuccess){
                // Just a
                this.mutateGrid(potentialPathA, line);
            }
            else{
                if (potentialPathA.length === potentialPathB.length){
                    console.log("Come on man, this is so sad.");
                    return;
                }
                if (potentialPathA.length < potentialPathB.length){
                    this.mutateGrid(potentialPathA, line);
                }
                else{
                    this.mutateGrid(potentialPathB, line);
                }
            }
        }
    }

    loop(solelyEdge: boolean){
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
        this.printGrid();
        console.log("Solving!")
        this.loop(true);
        this.checkComplete();
    }
}
