enum FlowSpace {
    Empty = "Empty",
    YellowCircle = "YellowCircle",
    RedCircle= "RedCircle",
    BlueCircle= "BlueCircle",
    CyanCircle= "CyanCircle",
    OrangeCircle= "OrangeCircle",
    ForestCircle= "ForestCircle",
    LimeCircle= "LimeCircle",
    MagentaCircle= "MagentaCircle",
    PurpleCircle= "PurpleCircle",
    Yellow= "Yellow",
    Red= "Red",
    Blue= "Blue",
    Cyan= "Cyan",
    Orange= "Orange",
    Forest= "Forest",
    Lime= "Lime",
    Magenta= "Magenta",
    Purple= "Purple"
};

function isCircle(entry: FlowSpace){
        if (entry === FlowSpace.OrangeCircle){
            return FlowSpace.Orange;
        }
        if (entry === FlowSpace.RedCircle){
            return FlowSpace.Red;
        }
        if (entry === FlowSpace.BlueCircle){
            return FlowSpace.Blue;
        }
        if (entry === FlowSpace.ForestCircle){
            return FlowSpace.Forest;
        }
        if (entry === FlowSpace.YellowCircle){
            return FlowSpace.Yellow;
        }
        if (entry === FlowSpace.CyanCircle){
            return FlowSpace.Cyan;
        }
        if (entry === FlowSpace.LimeCircle){
            return FlowSpace.Lime;
        }
        if (entry === FlowSpace.MagentaCircle){
            return FlowSpace.Magenta;
        }
        if (entry === FlowSpace.PurpleCircle){
            return FlowSpace.Purple;
        }
        return FlowSpace.Empty; //Failure condition
}

export default class FlowGame{
    grid: FlowSpace[][];
    constructor(){
        this.grid = [
            [FlowSpace.RedCircle, FlowSpace.Empty, FlowSpace.ForestCircle, FlowSpace.Empty, FlowSpace.YellowCircle],
            [FlowSpace.Empty, FlowSpace.Empty, FlowSpace.BlueCircle, FlowSpace.Empty, FlowSpace.OrangeCircle],
            [FlowSpace.Empty, FlowSpace.Empty, FlowSpace.Empty, FlowSpace.Empty, FlowSpace.Empty],
            [FlowSpace.Empty, FlowSpace.ForestCircle, FlowSpace.Empty, FlowSpace.YellowCircle, FlowSpace.Empty],
            [FlowSpace.Empty, FlowSpace.RedCircle, FlowSpace.BlueCircle, FlowSpace.OrangeCircle, FlowSpace.Empty]
        ]; //Unsolved default puzzle
        this.checkComplete();
        this.grid = [
            [FlowSpace.RedCircle, FlowSpace.Forest, FlowSpace.ForestCircle, FlowSpace.Yellow, FlowSpace.YellowCircle],
            [FlowSpace.Red, FlowSpace.Forest, FlowSpace.BlueCircle, FlowSpace.Yellow, FlowSpace.OrangeCircle],
            [FlowSpace.Red, FlowSpace.Forest, FlowSpace.Blue, FlowSpace.Yellow, FlowSpace.Orange],
            [FlowSpace.Red, FlowSpace.ForestCircle, FlowSpace.Blue, FlowSpace.YellowCircle, FlowSpace.Orange],
            [FlowSpace.Red, FlowSpace.RedCircle, FlowSpace.BlueCircle, FlowSpace.OrangeCircle, FlowSpace.Orange]
        ]; // Solved default puzzle
        this.checkComplete();
    }

    checkCirclePath(i: number, j: number, line: FlowSpace){
        let circle: FlowSpace = this.grid[i][j];
        let pasti = i;
        let pastj = j;
        while(this.grid[i][j] !== circle || (i === pasti && j === pastj)){
            let nexti = -1;
            let nextj = -1;
            if (i !== 0 && pasti !== i-1){
                //Check square above
                if (this.grid[i-1][j] === line || this.grid[i-1][j] === circle){
                    nexti = i-1;
                    nextj = j;
                }
            }
            if (i !== this.grid.length-1 && pasti !== i+1){
                //Check square below
                if (this.grid[i+1][j] === line|| this.grid[i+1][j] === circle){
                    if (nexti !== -1){
                        console.log("No 2x2 allowed! Space:" + i + " " + j);
                        return false;
                    }
                    nexti = i+1;
                    nextj = j;
                }
            }
            if (j !== 0 && pastj !== j-1){
                //Check square left
                if (this.grid[i][j-1] === line || this.grid[i][j-1] === circle){
                    if (nexti !== -1){
                        console.log("No 2x2 allowed! Space:" + i + " " + j);
                        return false;
                    }
                    nexti = i;
                    nextj = j-1;
                }
            }
            if (j !== this.grid[0].length && pastj !== j+1){
                //Check square right
                if (this.grid[i][j+1] === line || this.grid[i][j+1] === circle){
                    if (nexti !== -1){
                        console.log("No 2x2 allowed! Space:" + i + " " + j);
                        return false;
                    }
                    nexti = i;
                    nextj = j+1;
                }
            }
            if (nexti === -1){
                console.log("Couldn't find next space! Space: " + i + " " + j);
                return false;
            }
            pasti = i;
            pastj = j;
            i = nexti;
            j = nextj;
        }
        return true;
    }

    checkComplete(){
        console.log("Checking grid.");
        this.printGrid();
        for(let i = 0; i < this.grid.length; i++){
            for (let j = 0; j < this.grid[0].length; j++){
                let k: FlowSpace = isCircle(this.grid[i][j]);
                if (k !== FlowSpace.Empty){
                    if (!this.checkCirclePath(i, j, k)){
                        return false;
                    }
                }
            }
        }
        console.log("We done did it gamers!");
        return true;
    }
    printGrid(){
        for(let i = 0; i < this.grid.length; i++){
            let linetoprint = "";
            for(let j = 0; j < this.grid[0].length; j++){
                if (isCircle(this.grid[i][j]) !== FlowSpace.Empty){
                    linetoprint += this.grid[i][j].toString().substring(0,3) + "C ";
                }
                else{
                    linetoprint += this.grid[i][j].toString().substring(0,3) + "  ";
                }
            }
            console.log(linetoprint);
        }
    }
    solve(){

    }

}