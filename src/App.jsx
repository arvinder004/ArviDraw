import { useRef, useState } from 'react';
import './App.css'
import Board from '../src/board'

const App = () => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("#ffffff");
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);

    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillRect = "#252525";

        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        setElements([]);
    }

    const undo = () => {
        // setHistory((prevHistory) => [...prevHistory, elements[elements.length - 2]]);
        // setElements((prevElements) => prevElements.slice(0, prevElements.length - 1));

        if(elements.length === 1){
            setHistory((prev) => [...prev, elements[elements.length - 1]]);
            handleClearCanvas();
        } else {
            setElements((prev)=>prev.slice(0,-1));
            setHistory((prev)=>[...prev,elements[elements.length-1]]);
        }
    }

    const redo = () => {
        setElements((prev)=>[...prev, history[history.length - 1]]);
        setHistory((prev)=>prev.slice(0, prev.length-1));
    }

  return (
    <>
      <div className="head">
        <h1 className="text-center p-2 text-light">
          ArviDraw
        </h1>
      </div>
      <div className='d-flex flex-column flex-md-row gap-1 align-items-center justify-content-around'>
        <div className='rounded adjust'>

          <div className="d-flex gap-3 align-items-center">
            <label htmlFor="pencil"><img src='./images/pencil.svg' alt="" className='logo' /></label>
            <input type="radio" name="tool" id="pencil" value="pencil" checked={tool == "pencil"} onChange={(e) => setTool(e.target.value)} />
          </div>

          <div className="d-flex gap-3 align-items-center">
            <label htmlFor="line"><img src='./images/line.svg' alt="" className='logo' /></label>
            <input type="radio" name="tool" id="line" value="line" checked={tool == "line"} onChange={(e) => setTool(e.target.value)} />
          </div>

          <div className="d-flex gap-3 align-items-center">
            <label htmlFor="rect"><img src='./images/rect.svg' alt="" className='logo' /></label>
            <input type="radio" name="tool" id="rect" value="rect" checked={tool == "rect"} onChange={(e) => setTool(e.target.value)} />
          </div>

          <div className='d-flex flex-column align-items-center'>
            <label htmlFor="color" >Select Color</label>
            <input type="color" name="color" id="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>

          <div className='d-flex gap-2 align-items-center'>
            <button className='btn btn-info' disabled={elements.length == 0} onClick={undo}>Undo</button>
            <button className='btn btn-outline-info' disabled={history.length < 1} onClick={redo}>Redo</button>
          </div>

          <div>
            <button className='btn btn-danger' onClick={handleClearCanvas}>Clear Canvas</button>
          </div>

        </div>

        <div className='col-12 col-md-10 border border-2 canvas-box'>
          <Board
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            elements={elements}
            setElements={setElements}
            color={color}
            tool={tool}
          />
        </div>
      </div>
      <footer className="text-center text-light mb-1">
        Designed and Developed by Arvinder.
      </footer>
    </>
  )
}

export default App