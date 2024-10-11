import rough from 'roughjs';
import { useEffect, useState, useLayoutEffect } from "react";
import '../App.css'

const roughGenerator = rough.generator();

const Board = ({ canvasRef, ctxRef, elements, setElements, tool, color }) => {
    const [isDrawing, setIsDrawing] = useState(false);

    canvasRef?document.body.style.overflow = "hidden":document.body.style.overflow = "auto"; // to avoid scrolling of the page while drawing on mobile

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = window.innerHeight * 2;
        canvas.width = window.innerWidth * 2;
        const ctx = canvas.getContext("2d");

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctxRef.current = ctx;
    }, []);

    useEffect(() => {
        ctxRef.current.strokeStyle = color;
    }, [color]);

    useEffect(() => {
        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth * 1; 
                canvas.height = window.innerHeight * 0.85; 
            }
        };
    
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);    

    useLayoutEffect(() => {
        const roughCanvas = rough.canvas(canvasRef.current);

        if (elements.length > 0) {
            ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        elements.forEach((element) => {
            if (element.type == "pencil") {
                roughCanvas.linearPath(element.path, { roughness: 0, stroke: element.stroke, strokeWidth: 3 });
            } else if (element.type == "line") {
                roughCanvas.draw(roughGenerator.line(element.offsetX, element.offsetY, element.width, element.height, { roughness: 0, stroke: element.stroke, strokeWidth: 3 }));
            } else if (element.type == "rect") {
                roughCanvas.draw(roughGenerator.rectangle(element.offsetX, element.offsetY, element.width, element.height, { roughness: 0, stroke: element.stroke, strokeWidth: 3 }))
            }
        });
    }, [elements])

    // Handles for both mouse and touch start
    const handlePointerDown = (e) => {
        e.preventDefault();
        const { offsetX, offsetY } = getPointerPosition(e);

        if (tool == "pencil") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "pencil",
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: color,
                }
            ])
        } else if (tool == "line") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "line",
                    offsetX,
                    offsetY,
                    height: offsetY,
                    width: offsetX,
                    stroke: color,
                }
            ])
        } else if (tool == "rect") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "rect",
                    offsetX,
                    offsetY,
                    width: 0,
                    height: 0,
                    stroke: color,
                }
            ])
        }
        setIsDrawing(true);
    }

    // Handles for both mouse and touch move
    const handlePointerMove = (e) => {
        e.preventDefault();
        const { offsetX, offsetY } = getPointerPosition(e);

        if (isDrawing) {
            if (tool == "pencil") {
                const { path } = elements[elements.length - 1];
                const newPath = [...path, [offsetX, offsetY]];
                setElements((prevElements) => prevElements.map((ele, index) => {
                    if (index == elements.length - 1) {
                        return {
                            ...ele,
                            path: newPath,
                        }
                    } else {
                        return ele;
                    }
                }))
            } else if (tool == "line") {
                setElements((prevElements) => prevElements.map((ele, index) => {
                    if (index == elements.length - 1) {
                        return {
                            ...ele,
                            width: offsetX,
                            height: offsetY,
                        };
                    } else {
                        return ele;
                    }
                }))
            } else if (tool == "rect") {
                setElements((prevElements) => prevElements.map((ele, index)=> {
                    if (index == elements.length - 1) {
                        return {
                            ...ele,
                            width: offsetX - ele.offsetX,
                            height: offsetY - ele.offsetY,
                        };
                    } else {
                        return ele;
                    }
                }))
            }
        }
    }

    // Handles for both mouse and touch end
    const handlePointerUp = (e) => {
        e.preventDefault();
        setIsDrawing(false);
    }

    // Function to get pointer position for both mouse and touch events
    const getPointerPosition = (e) => {
        const canvas = canvasRef.current;
        let offsetX, offsetY;

        if (e.touches) {
            const touch = e.touches[0];
            const boundingRect = canvas.getBoundingClientRect();
            offsetX = touch.clientX - boundingRect.left;
            offsetY = touch.clientY - boundingRect.top;
        } else {
            offsetX = e.nativeEvent.offsetX;
            offsetY = e.nativeEvent.offsetY;
        }
        return { offsetX, offsetY };
    }

    return (
        <>
            <div 
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                className='h-100 w-100 border border-dark border-3 overflow-hidden canvas'>
                <canvas ref={canvasRef} />
            </div>
        </>
    )
}

export default Board;
