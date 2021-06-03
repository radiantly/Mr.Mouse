import { $id } from "./util.js";

const canvas = $id("grid");
console.info(canvas);
const ctx = canvas.getContext("2d");

const rows = 10;
const borderPx = 5;
const cellPx = 40;
const size = (cellPx + borderPx) * (rows + 1);
const fontSize = 22;

const boxPx = rows * cellPx + (rows + 1) * borderPx;
console.info(boxPx);

// Set canvas size
canvas.width = canvas.height = size;

export const initGrid = () => {
  // Draw grid lines
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e0802113";
  for (let i = 0; i <= rows; i++) {
    const offset = (borderPx + cellPx) * i; // Calculate offset
    ctx.fillRect(0, offset, size, borderPx); // Draw row
    ctx.fillRect(offset, 0, borderPx, size); // Draw column
  }

  // Draw borders
  ctx.fillStyle = "#5e5951";
  ctx.fillRect(0, 0, borderPx, boxPx);
  ctx.fillRect(0, 0, boxPx, borderPx);
  ctx.fillRect(boxPx - borderPx, 0, borderPx, boxPx);
  ctx.fillRect(0, boxPx - borderPx, boxPx, borderPx);

  // Draw Intersections
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < rows; j++) {
      ctx.fillRect(
        i * (borderPx + cellPx),
        j * (borderPx + cellPx),
        borderPx,
        borderPx
      );
    }
  }

  // Add row/column numbers
  ctx.textAlign = "center";
  ctx.font = `${fontSize}px Arial`;
  ctx.textBaseline = "middle";
  for (let i = 1; i <= rows; i++) {
    // Slightly lower text
    const yAdjustment = 2;

    const offset = (borderPx + cellPx) * i - cellPx / 2;
    const offsetFixed = size - cellPx / 2;

    ctx.fillText(i, offset, offsetFixed + yAdjustment);
    ctx.fillText(
      String.fromCharCode(75 - i),
      offsetFixed,
      offset + yAdjustment
    );
  }
};
