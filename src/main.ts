import "./style.css";

interface Point {
    x: number;
    y: number;
}

class DrawingLine{
    private points: Point[];

    constructor(initialPoint: Point){
        this.points = [initialPoint];
    }

    drag(x: number, y: number){
        this.points.push({x, y});
    }

    display(ctx: CanvasRenderingContext2D){
        ctx.beginPath();
        const initPointX = this.points[0].x;
        const initPointY = this.points[0].y;
        
        ctx.moveTo(initPointX, initPointY);
        for(const point of this.points){
            ctx.lineTo(point.x, point.y)
        }
        ctx.stroke();
    }

}

const APP_NAME = "Luc's Drawing Area!";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
const titleElement = document.createElement("h1");
titleElement.textContent = APP_NAME;
app.appendChild(titleElement);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
app.appendChild(canvas);

const ctx = canvas.getContext("2d");

if (ctx == null) {
    throw new Error("Failed to get canvas context");
}


//Clear button
const clearButton = document.createElement("button");
clearButton.textContent = "Clear!";
app.appendChild(clearButton);
clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mousePoints.length = 0;
});

//Redo button
const redoButton = document.createElement("button");
redoButton.textContent = "Redo!";
app.appendChild(redoButton);
redoButton.addEventListener("click", () => {
    if(redoPoints.length > 0){
        const redoLine = redoPoints.pop();
        if(redoLine){
            mousePoints.push(redoLine);
            canvas.dispatchEvent(drawingChanged);
        }
    }
});

//Undo button
const undoButton = document.createElement("button");
undoButton.textContent = "Undo!";
app.appendChild(undoButton);
undoButton.addEventListener("click", () => {
    if (mousePoints.length > 0){
        const undoLine = mousePoints.pop();
        if(undoLine){
            redoPoints.push(undoLine);
            canvas.dispatchEvent(drawingChanged);
        }
    }
});

//Observer for when "drawing-changed!"
const mousePoints: DrawingLine[] = []; //This is the array of arrays of points
const redoPoints: DrawingLine[] = []; //Need to copy this so that we can save it for later when we need to "redo"
let penDown = false;
const drawingChanged = new Event("drawing-changed!");

canvas.addEventListener("drawing-changed!", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const line of mousePoints) {
        line.display(ctx);
    }
});

//Drawing stuff
canvas.addEventListener("mousedown", (event) => {
    penDown = true;
    const newPoint = new DrawingLine({ x: event.offsetX, y: event.offsetY});
    mousePoints.push(newPoint);
});

//False = user is not clicking, else (true) = user is clicking
canvas.addEventListener("mousemove", (event) => {
    if (penDown == false){
        return;
    }
    else{
        const newPoint = mousePoints[mousePoints.length - 1];
        newPoint.drag(event.offsetX, event.offsetY);
        canvas.dispatchEvent(drawingChanged); // Here is dispatch, took me a minute to figure out how this worked
    }
});

//Reset Pen
canvas.addEventListener("mouseup", () => {
    penDown = false;
});




