/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import Box, { BoxProps } from '@mui/material/Box';
import "./App.css";


function Item(props: BoxProps) {
    const { sx } = props;
    return (
      <Box
        sx={{
          bgcolor: 'black',
          color: 'white',
          border: '1px solid',
          borderColor: 'white',
          p: 1,
          width: '40px',
          height: '40px',
          fontSize: '0.875rem',
          fontWeight: '700',
          ...sx,
        }}
      />
    );
  }

function App() {
    const [gridHeight, setHeight] = useState(5);
    const [gridWidth, setWidth] = useState(5);
    const [color, setColor] = useState("Red");

    const solveInput = Array(270).fill('.');
    
    const colorList = ["yellow", "red", "blue", "cyan", "orange", "green", "lime", "magenta", "purple"];
    const colorMap = {
        "yellow": "#ffff00",
        "red": "#ff0000",
        "blue": "#0000ff",
        "cyan": "#00ffff",
        "orange": "#ffa500",
        "green": "#008000",
        "lime": "#00ff00",
        "magenta": "#ff00ff",
        "purple": "#A020F0",
    }
    const colorCharMap = {
        "yellow": 'Y',
        "red": 'R',
        "blue": 'B',
        "cyan": 'C',
        "orange": 'O',
        "green": 'G',
        "lime": 'L',
        "magenta": 'M',
        "purple": 'P',
    }
    
    
    const handleHeight = (event: any) => {
        setHeight(event.target.value);
    }

    const handleWidth = (event: any) => {
        setWidth(event.target.value);
    }

    const handleColor = (event: any) => {
        setColor(event.target.value);
    }
    
    return (
        <div className="App">
            <div className="Outer-Box">
                <div className="Grid-select">
                        <select className="Grid-select-left" value={gridWidth} onChange={handleWidth}>
                            {
                                Array.from(Array(11)).map((_, index) => (
                                    <option value={index + 5}>{index + 5}</option>
                                ))
                            }
                           
                        </select>
                        <select className="Grid-selct-right" value={gridHeight} onChange={handleHeight}>
                            {
                                Array.from(Array(14)).map((_, index) => (
                                    <option value={index + 5}>{index + 5}</option>
                                ))
                            }
                        </select>
                </div>

                <div className="Grid-container">
                    <div>
                        <Box
                            sx={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
                            }}
                        >
                            {
                                Array.from(Array(gridHeight * gridWidth)).map((_, index) => (
                                    <Item>{index}</Item>
                                ))
                            }
                        </Box>
                    </div>
                    
                    <div className="Grid-right">
                        <Box
                            sx={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(2, 1fr)`,
                            }}
                        >
                            {
                                colorList.map((element) => (
                                    // <embed src="assets/flow-dot.svg" />

                                ))
                            }
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
