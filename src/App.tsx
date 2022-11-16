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
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                            <option value={9}>9</option>
                            <option value={11}>11</option>
                            <option value={12}>12</option>
                            <option value={13}>13</option>
                            <option value={14}>14</option>
                            <option value={15}>15</option>
                        </select>
                        <select className="Grid-selct-right" value={gridHeight} onChange={handleHeight}>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                            <option value={9}>9</option>
                        </select>
                </div>

                <Box
                    sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
                    }}
                >
                    {
                        Array.from(Array(gridHeight * gridWidth)).map((_, index) => (
                            // eslint-disable-next-line no-template-curly-in-string
                            <Item>{index}</Item>
                        ))
                    }
                </Box>
            </div>
        </div>
    );
}

export default App;
