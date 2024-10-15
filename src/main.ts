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
