import "./style.css";

const APP_NAME = "Luc's Game!";
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
});

//Drawing stuff
let penDown = false;

canvas.addEventListener("mousedown", (event) => {
    penDown = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
});

//False = user is not clicking, else (true) = user is clicking
canvas.addEventListener("mousemove", (event) => {
    if (penDown == false){
        return;
    }
    else{
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }
});

//Reset Pen
canvas.addEventListener("mouseup", () => {
    penDown = false;
});
