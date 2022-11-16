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
          height: '50px',
          width: '50px',
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
    
    const handleHeight = (event: any) => {
        setHeight(event.target.value);
    }

    const handleWidth = (event: any) => {

        setWidth(event.target.value);
    }
    
    return (
        <div className="App">
            <header className="App-header">
            <select value={gridWidth} onChange={handleWidth}>
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
            <select value={gridHeight} onChange={handleHeight}>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
            </select>
            <p>
                {gridWidth} {gridHeight}
            </p>

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
            </header>
        </div>
    );
}

export default App;
