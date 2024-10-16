import "./style.css";

interface Point {
    x: number;
    y: number;
}

class Sticker {
    public x: number;
    public y: number;
    public emoji: string;

    constructor(emoji: string, x: number, y: number) {
        this.emoji = emoji;
        this.x = x;
        this.y = y;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.font = "30px sans-serif";
        ctx.fillText(this.emoji, this.x, this.y);
    }

    move(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

// StickerPreview class
class StickerPreview {
    public x: number;
    public y: number;
    public emoji: string;

    constructor(emoji: string) {
        this.x = 0;
        this.y = 0;
        this.emoji = emoji;
    }

    updatePosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.font = "30px sans-serif";
        ctx.fillText(this.emoji, this.x, this.y);
    }
}

class DrawingLine{
    private points: Point[];
    public penThickness: number;

    constructor(initialPoint: Point, penThickness: number){
        this.points = [initialPoint];
        this.penThickness = penThickness;
    }

    drag(x: number, y: number){
        this.points.push({x, y});
    }

    display(ctx: CanvasRenderingContext2D){
        ctx.lineWidth = this.penThickness;
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

class ToolPreview {
    public x: number;
    public y: number;
    public lineWidth: number;

    constructor(lineWidth: number) {
        this.x = 0;
        this.y = 0;
        this.lineWidth = lineWidth;
    }

    updatePosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    }
}

let stickerPreview: StickerPreview | null = null;
let selectedSticker: string | null = null;
const stickers: Sticker[] = [];
//emojis = ["🤫", "👺", "🤡" ];


let tool: ToolPreview;
let currentPenThickness = 5;
tool = new ToolPreview(currentPenThickness);


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

//Emoji button 1
const stickerButton1 = document.createElement("button");
stickerButton1.textContent = "🤫";
app.appendChild(stickerButton1);
stickerButton1.addEventListener("click", () => {
    selectedSticker = "🤫";
    stickerPreview = new StickerPreview("🤫");
    canvas.dispatchEvent(toolMovedEvent);
});


//Emoji button 2
const stickerButton2 = document.createElement("button");
stickerButton2.textContent = "👺";
app.appendChild(stickerButton2);
stickerButton2.addEventListener("click", () => {
    selectedSticker = "👺";
    stickerPreview = new StickerPreview("👺");
    canvas.dispatchEvent(toolMovedEvent);
});

//Emoji button 3
const stickerButton3 = document.createElement("button");
stickerButton3.textContent = "🤡";
app.appendChild(stickerButton3);
stickerButton3.addEventListener("click", () => {
    selectedSticker = "🤡";
    stickerPreview = new StickerPreview("🤡");
    canvas.dispatchEvent(toolMovedEvent);
});

//Clear button
const clearButton = document.createElement("button");
clearButton.textContent = "Clear!";
app.appendChild(clearButton);
clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mousePoints.length = 0;
    stickers.length = 0;
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



//Thin Button
const thinButton = document.createElement("button");
thinButton.textContent = "Thin Pen!";
app.appendChild(thinButton);
thinButton.addEventListener("click", () => {
    currentPenThickness = 1; 
});

//Thick Button
const thickButton = document.createElement("button");
thickButton.textContent = "Thick Pen!";
app.appendChild(thickButton);
thickButton.addEventListener("click", () => {
    currentPenThickness = 10; 
});

//Observer for when "drawing-changed!"
const mousePoints: DrawingLine[] = []; //This is the array of arrays of points
const redoPoints: DrawingLine[] = []; //Need to copy this so that we can save it for later when we need to "redo"
let penDown = false;
const drawingChanged = new Event("drawing-changed!");
const toolMovedEvent = new Event("tool-moved!");

canvas.addEventListener("tool-moved!", () => {
    if (tool) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const line of mousePoints) {
            line.display(ctx);
        }
        for (const sticker of stickers){
            sticker.draw(ctx);
        }
        if (stickerPreview && !penDown) {
            stickerPreview.draw(ctx);
        }
    }
});

canvas.addEventListener("drawing-changed!", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const line of mousePoints) {
        line.display(ctx);
    }
    for (const sticker of stickers) {
        sticker.draw(ctx);
    }
});

//Drawing with pen
canvas.addEventListener("mousedown", (event) => {
    penDown = true;
    if(!selectedSticker){
        const newPoint = new DrawingLine({ x: event.offsetX, y: event.offsetY}, currentPenThickness);
        mousePoints.push(newPoint);
    }
});

//False = user is not clicking, else (true) = user is clicking
canvas.addEventListener("mousemove", (event) => {
    if (penDown == false){
        if(tool){
            tool.updatePosition(event.offsetX, event.offsetY);
            canvas.dispatchEvent(toolMovedEvent);
            //console.log("tool-moved fired!");
        }

        if(stickerPreview){
            stickerPreview.updatePosition(event.offsetX, event.offsetY);
            canvas.dispatchEvent(toolMovedEvent);
            //console.log("stickerPreview fired!");
        }
    }
    else{
        if (!selectedSticker) {
            //Should put emoji at Drag point
            const newPoint = mousePoints[mousePoints.length - 1];
            newPoint.drag(event.offsetX, event.offsetY);
            canvas.dispatchEvent(drawingChanged);
        }
    }
});

//Reset Pen and stickers
canvas.addEventListener("mouseup", () => {
    penDown = false;
    if (selectedSticker && stickerPreview) {
        stickers.push(new Sticker(selectedSticker, stickerPreview.x, stickerPreview.y));
        stickerPreview = null; //Reset the preview after placing
        selectedSticker = null; //Reset selected sticker
        canvas.dispatchEvent(toolMovedEvent);
    }
});




