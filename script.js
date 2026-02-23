const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const toolbarHeight = document.querySelector(".toolbar").offsetHeight;

// ===== SET CANVAS SIZE =====
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - toolbarHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===== VARIABLES =====
let drawing = false;
let currentColor = "#000000";
let currentTool = "pencil";

ctx.lineWidth = 5;
ctx.lineCap = "round";

// ===== TOOL BUTTONS =====
document.getElementById("pencil").onclick = () => {
  currentTool = "pencil";
  ctx.globalCompositeOperation = "source-over";
};

document.getElementById("eraser").onclick = () => {
  currentTool = "eraser";
  ctx.globalCompositeOperation = "destination-out";
};

document.getElementById("colorPicker").onchange = (e) => {
  currentColor = e.target.value;
  ctx.strokeStyle = currentColor;
};

document.getElementById("clear").onclick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// ===== SAVE =====
document.getElementById("save").onclick = () => {
  const dataURL = canvas.toDataURL();
  localStorage.setItem("drawing", dataURL);
  alert("Drawing Saved!");
};

// ===== LOAD =====
document.getElementById("load").onclick = () => {
  const saved = localStorage.getItem("drawing");
  if (saved) {
    const img = new Image();
    img.src = saved;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  } else {
    alert("No saved drawing found!");
  }
};

// ===== DRAW EVENTS =====
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchmove", drawTouch);

function startDrawing(e) {
  drawing = true;
  draw(e);
}

function stopDrawing() {
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;

  ctx.strokeStyle = currentColor;
  ctx.lineTo(e.clientX, e.clientY - toolbarHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY - toolbarHeight);
}

function drawTouch(e) {
  if (!drawing) return;

  e.preventDefault();
  const touch = e.touches[0];

  ctx.strokeStyle = currentColor;
  ctx.lineTo(touch.clientX, touch.clientY - toolbarHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(touch.clientX, touch.clientY - toolbarHeight);
}
