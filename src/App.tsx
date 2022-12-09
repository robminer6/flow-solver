/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { Button } from "@mui/material";

import { ReactComponent as FlowDot } from "./assets/flow-dot.svg";
import FlowGame from "./flow";

import "./App.css";

function FlowDotBet(props: {
    colorCode: string;
    position: number;
    update: Function;
    type: string;
    rotation: number;
}) {
    const onClick = () => {
        if (props.type === "dot") {
            props.update(props.position);
        }
    };
    const angle = `rotate(${props.rotation})`;
    switch (props.type) {
        case "pipe":
            return (
                <svg width="40" height="40" transform={`rotate(${props.rotation})`}>
                    <rect width="40" height="40" stroke="white" />
                    <rect fill={props.colorCode} x="13" width="14" height="40" />
                </svg>
            );
        case "tip":
            return (
                <svg width="40" height="40" transform={`rotate(${props.rotation})`}>
                    <rect width="40" height="40" stroke="white" />
                    <path
                        fill={props.colorCode}
                        d="M35,20c0,8.28-6.72,15-15,15s-15-6.72-15-15c0-5.75,3.24-10.75,8-13.27V0h14V6.73c4.76,2.52,8,7.52,8,13.27Z"
                    />
                </svg>
            );
        case "corner":
            return (
                <svg width="40" height="40" transform={`rotate(${props.rotation})`}>
                    <rect width="40" height="40" stroke="white" />
                    <path
                        fill={props.colorCode}
                        d="M27,0V16.94c0,5.56-4.5,10.06-10.06,10.06H0V13H13V0h14Z"
                    />
                </svg>
            );
        default:
            return (
                <svg width="40" height="40" onClick={onClick} className="gridBox">
                    <rect width="40" height="40" stroke="white" />
                    <circle fill={props.colorCode} cx="20" cy="20" r="15" />
                </svg>
            );
    }
}

function translateTwoD(height: number, width: number, tempSolved: Array<string>) {
    const dotType = new Array(270).fill({ type: "Dot", angle: 0 });
    for (let i = 0; i < height; i += 1) {
        for (let j = 0; j < width; j += 1) {
            const tempDict = {
                count: 0,
                up: false,
                down: false,
                left: false,
                right: false,
            };
            // Up
            if (tempSolved[i][j] !== "E") {
                if (i !== 0) {
                    if (tempSolved[i - 1][j] === tempSolved[i][j]) {
                        tempDict.count += 1;
                        tempDict.up = true;
                    }
                }
                // Down
                if (i !== height - 1) {
                    if (tempSolved[i + 1][j] === tempSolved[i][j]) {
                        tempDict.count += 1;
                        tempDict.down = true;
                    }
                }
                // Left
                if (j !== 0) {
                    if (tempSolved[i][j - 1] === tempSolved[i][j]) {
                        tempDict.count += 1;
                        tempDict.left = true;
                    }
                }
                // Right
                if (j !== width - 1) {
                    if (tempSolved[i][j + 1] === tempSolved[i][j]) {
                        tempDict.count += 1;
                        tempDict.right = true;
                    }
                }
                // Must be a tip
                if (tempDict.count === 1) {
                    if (tempDict.up) {
                        dotType[i * height + j] = { type: "tip", angle: 0 };
                    } else if (tempDict.down) {
                        dotType[i * height + j] = { type: "tip", angle: 180 };
                    } else if (tempDict.left) {
                        dotType[i * height + j] = { type: "tip", angle: 270 };
                    } else if (tempDict.right) {
                        dotType[i * height + j] = { type: "tip", angle: 90 };
                    } else {
                        dotType[i * height + j] = { type: "dot", angle: 0 };
                    }
                } else {
                    // Pipe or corner
                    // eslint-disable-next-line no-lonely-if
                    if (tempDict.down && tempDict.up) {
                        dotType[i * height + j] = { type: "pipe", angle: 0 };
                    } else if (tempDict.left && tempDict.right) {
                        dotType[i * height + j] = { type: "pipe", angle: 90 };
                    } else if (tempDict.right && tempDict.up) {
                        dotType[i * height + j] = { type: "corner", angle: 90 };
                    } else if (tempDict.left && tempDict.up) {
                        dotType[i * height + j] = { type: "corner", angle: 0 };
                    } else if (tempDict.left && tempDict.down) {
                        dotType[i * height + j] = { type: "corner", angle: 270 };
                    } else if (tempDict.right && tempDict.down) {
                        dotType[i * height + j] = { type: "corner", angle: 180 };
                    } else {
                        dotType[i * height + j] = { type: "dot", angle: 0 };
                    }
                }
            }
        }
    }
    return dotType;
    // update state shit
}

function translateTwoDCol(width: number, height: number, tempSolved: Array<string>) {
    const returnedArray = new Array(width * height);
    for (let i = 0; i < height; i += 1) {
        for (let j = 0; j < width; j += 1) {
            returnedArray[i * width + j] = tempSolved[i][j];
        }
    }
    return returnedArray;
}

function SolveButton(props: {
    solveArray: Array<string>;
    width: number;
    height: number;
    update: Function;
}) {
    const onClick = () => {
        // format new array
        const tempArr = new Array(props.height);

        for (let i = 0; i < props.height; i += 1) {
            const fuckArr = new Array(props.width);
            for (let j = 0; j < props.width; j += 1) {
                fuckArr[j] = props.solveArray[i * props.height + j];
            }
            tempArr[i] = fuckArr;
        }

        const game = new FlowGame(tempArr);
        // const game = new FlowGame();
        game.solve();
        if (!game.checkComplete()) {
            // TODO CREATE ALERT
            return;
        }
        // reformat returned array
        const griddy = game.grid;

        const tempSolved = new Array(props.height);
        for (let i = 0; i < props.height; i += 1) {
            const fuckerArr2 = new Array(props.width);
            for (let j = 0; j < props.width; j += 1) {
                fuckerArr2[j] = griddy[i][j].color[0].toUpperCase();
            }
            tempSolved[i] = fuckerArr2;
        }
        const dotType = translateTwoD(props.height, props.width, tempSolved);
        const returnedArray = translateTwoDCol(props.height, props.width, tempSolved);

        props.update(returnedArray, dotType);
    };
    return (
        <button type="button" onClick={onClick} className="solveButton">
            Solve!
        </button>
    );
}

function App() {
    const initialColState = Array(270).fill("#000000");
    const initialTypeState = Array(270).fill({ type: "dot", angle: 0 });
    const initialSolveChar = Array(270).fill(".");

    const [gridHeight, setHeight] = useState(5);
    const [gridWidth, setWidth] = useState(5);
    const [color, setColor] = useState("red");
    const [solveInput, setSolveInput] = useState(initialColState);
    const [typeArr, setTypeArr] = useState(initialTypeState);
    const [solveChar, setSolveChar] = useState(initialSolveChar);

    const colorList = [
        "yellow",
        "red",
        "blue",
        "cyan",
        "orange",
        "green",
        "lime",
        "magenta",
        "purple",
        "auburn",
        "silver",
        "white",
        "black",
    ];
    const colorMap = new Map<string, string>();
    colorMap.set("yellow", "#ffff00");
    colorMap.set("red", "#ff0000");
    colorMap.set("blue", "#0000ff");
    colorMap.set("cyan", "#00ffff");
    colorMap.set("orange", "#ffa500");
    colorMap.set("green", "#008000");
    colorMap.set("lime", "#00ff00");
    colorMap.set("magenta", "#ff00ff");
    colorMap.set("purple", "#A020F0");
    colorMap.set("auburn", "#800000");
    colorMap.set("silver", "#808080");
    colorMap.set("white", "#FFFFFF");
    colorMap.set("black", "#000000");

    const colorCharMap = new Map<string, string>();
    colorCharMap.set("yellow", "Y");
    colorCharMap.set("red", "R");
    colorCharMap.set("blue", "B");
    colorCharMap.set("cyan", "C");
    colorCharMap.set("orange", "O");
    colorCharMap.set("green", "G");
    colorCharMap.set("lime", "L");
    colorCharMap.set("magenta", "M");
    colorCharMap.set("purple", "P");
    colorCharMap.set("auburn", "A");
    colorCharMap.set("silver", "S");
    colorCharMap.set("white", "W");
    colorCharMap.set("black", ".");

    function charToCode(input: string) {
        switch (input) {
            case "Y":
                return "#ffff00";
            case "R":
                return "#ff0000";
            case "B":
                return "#0000ff";
            case "C":
                return "#00ffff";
            case "O":
                return "#ffa500";
            case "G":
                return "#008000";
            case "L":
                return "#00ff00";
            case "M":
                return "#ff00ff";
            case "P":
                return "#A020F0";
            case "A":
                return "#800000";
            case "S":
                return "#808080";
            case "W":
                return "#FFFFFF";
            default:
                return "#000000";
        }
    }

    const handleHeight = (event: any) => {
        setHeight(event.target.value);
        setSolveInput(initialColState);
        setTypeArr(initialTypeState);
        setSolveChar(initialSolveChar);
    };

    const handleWidth = (event: any) => {
        setWidth(event.target.value);
        setSolveInput(initialColState);
        setTypeArr(initialTypeState);
        setSolveChar(initialSolveChar);
    };

    // Click and change color.
    const update = (position: number) => {
        const newArray = solveInput.slice();
        newArray[position] = colorMap.get(color);
        const newSolve = solveChar.slice();
        newSolve[position] = colorCharMap.get(color);
        setSolveChar(newSolve);
        // console.log(solveChar)
        setSolveInput(newArray);
    };
    // Set Grid After solve
    const updateGrid = (colors: Array<string>, types: Array<{ type: string; angle: number }>) => {
        const colorCodes = colors.slice();
        for (let i = 0; i < gridHeight * gridWidth; i += 1) {
            colorCodes[i] = charToCode(colors[i]);
        }
        setSolveInput(colorCodes);
        setTypeArr(types);
    };

    return (
        <div className="App">
            <div className="Outer-Box">
                <div className="Instructions">
                    <h2 className="Title">Flow Solver</h2>
                    <h4 className="Authors">By Rob Miner, AJ Pynnonen, and Matt Debacker</h4>
                    <p className="Description">
                        This is a solver for the popular mobile game, &quot;Flow Free,&quot;
                        developed by Big Duck Games. To use, select the dimensions of your puzzle
                        using the dropdown menus at the top of the screen. Next, place your starting
                        dots by selecting a color on the right and placing it on the grid (black is
                        an eraser). Once you&apos;ve placed all your dots, click the
                        &quot;Hint&quot; button to show one of the correct paths or the
                        &quot;Solve&quot; button to show them all.
                    </p>
                </div>
                <div className="Grid-select">
                    <div className="Params">Width:</div>
                    <select className="Grid-select-left" value={gridWidth} onChange={handleWidth}>
                        {Array.from(Array(11)).map((_, index) => (
                            <option value={index + 5}>{index + 5}</option>
                        ))}
                    </select>
                    <div className="Params">Height:</div>
                    <select className="Grid-selct-right" value={gridHeight} onChange={handleHeight}>
                        {Array.from(Array(14)).map((_, index) => (
                            <option value={index + 5}>{index + 5}</option>
                        ))}
                    </select>
                </div>

                <div className="Grid-container">
                    <div className="Grid-left">
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
                            }}
                        >
                            {solveInput.slice(0, gridHeight * gridWidth).map((_, index) => (
                                // eslint-disable-next-line react/no-array-index-key
                                // <FlowDot key={index} fill={colorMap.get(colColor)} stroke = "white" onClick={(event) => {
                                //         superArray[index].colVal =colorCharMap.get(color);
                                //         superArray[index].color = color;
                                //         console.log("why")
                                //     }}/>

                                <FlowDotBet
                                    colorCode={solveInput[index]}
                                    position={index}
                                    update={update}
                                    type={typeArr[index].type}
                                    rotation={typeArr[index].angle}
                                />
                            ))}
                        </Box>
                    </div>

                    <div className="Grid-right">
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: `repeat(2, 1fr)`,
                            }}
                        >
                            {colorList.map((data) => (
                                <FlowDot
                                    fill={colorMap.get(data)}
                                    stroke="white"
                                    onClick={() => setColor(data)}
                                />
                            ))}
                        </Box>
                    </div>
                </div>
                <SolveButton
                    solveArray={solveChar}
                    width={gridWidth}
                    height={gridHeight}
                    update={updateGrid}
                />
                <br />
                <p className="Description">
                    If you run into any problems with this tool, open an issue on our{" "}
                    <a
                        href="https://github.com/robminer6/flow-solver"
                        target="_blank"
                        rel="noreferrer"
                    >
                        GitHub page
                    </a>{" "}
                    or email us at robminer@gmail.com.
                </p>
            </div>
        </div>
    );
}
export default App;
