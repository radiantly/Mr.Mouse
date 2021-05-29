const $ = (selector) => document.querySelector(selector);
const $all = (selector) => document.querySelectorAll(selector);
const $id = (idText) => document.getElementById(idText);

const grid = document.querySelector(".grid");

const rows = 10;
const elems = 2 * rows + 1;
const gr = [];

const initGrid = (mpos = { x: 8, y: 4 }, cpos = { x: 4, y: 6 }) => {
  // Empty grid if dirty
  grid.innerHTML = `<a href="#L1" class="start-game only-L0"><div><h2>START GAME</h2></div></a>`;

  // Add grid elements
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= rows; col++) {
      // Center element
      const elem = document.createElement("div");
      elem.style.gridArea = `${row * 2 + 1} / ${col * 2 + 1}`;
      elem.classList.add("inter");
      grid.appendChild(elem);

      // Verticals
      const vside = document.createElement("div");
      vside.style.gridArea = `${row * 2 + 2} / ${col * 2 + 1}`;
      vside.classList.add("side");
      if ([0, rows].includes(col) && row != rows) vside.classList.add("end");
      grid.appendChild(vside);

      // Horizontals
      const hside = document.createElement("div");
      hside.style.gridArea = `${row * 2 + 1} / ${col * 2 + 2}`;
      hside.classList.add("side");
      if ([0, rows].includes(row) && col != rows) hside.classList.add("end");
      grid.appendChild(hside);
    }
  }

  // Add grid numbers/letters on the side
  for (let i = 1; i <= rows; i++) {
    const numElem = document.createElement("div");
    numElem.innerText = i;
    numElem.classList.add("number");
    numElem.style.gridArea = `${rows * 2 + 2} / ${i * 2}`;
    grid.appendChild(numElem);

    const alElem = document.createElement("div");
    alElem.innerText = String.fromCharCode(75 - i);
    alElem.classList.add("number");
    alElem.style.gridArea = `${i * 2} / ${rows * 2 + 2}`;
    grid.appendChild(alElem);
  }

  // Add mouse
  const mouseImg = document.createElement("img");
  mouseImg.src = "mouse.png";
  mouseImg.classList.add("mouse-img");

  const mouseWrap = document.createElement("div");
  mouseWrap.style.gridArea = `${mpos.y * 2} / ${mpos.x * 2} / span 1 / span 1`;
  mouseWrap.classList.add("mouseWrap");
  mouseWrap.appendChild(mouseImg);
  grid.appendChild(mouseWrap);

  // Cheese
  const cheese = document.createElement("img");
  cheese.src = "cheese.png";
  cheese.classList.add("cheese-img");
  cheese.style.gridArea = `${cpos.y * 2} / ${cpos.x * 2} / span 1 / span 1`;
  grid.appendChild(cheese);
};

initGrid({ x: 7, y: 5 }, { x: 4, y: 7 });

// for (let row = 0; row < elems; row++) {
//   for (let col = 0; col < elems; col++) {
//     const elem = document.createElement("div");
//     if ([0, elems - 1].includes(row) || [0, elems - 1].includes(col))
//       elem.classList.add("end");
//     elem.classList.add(
//       row % 2 && col % 2 ? "box" : row % 2 || col % 2 ? "side" : "inter"
//     );

//     gr[row * elems + col] = elem;
//     grid.appendChild(elem);
//   }
// }

const getL = text => text?.match(/L\d/)?.[0];

const cm = CodeMirror.fromTextArea($id("console"), {
  lineNumbers: true,
  mode: "javascript",
  theme: "default height",
  matchBrackets: true,
  placeholder: "Type your code here!"
});

// Level Selector
const inlinks = Array.from(document.querySelectorAll(".sidebar > a"));
const state = {
  _activeL: "L0",
  set activeL(level) {
    if (level === state._activeL) return;
    if (state._activeL) {
      $id(state._activeL).classList.remove("active");
      document.body.classList.remove(state._activeL);
    }
    state._activeL = level;
    location.hash = level;
    $id(state._activeL).classList.add("active");
    document.body.classList.add(state._activeL);
    cm.refresh();
  },
  solved: ["L0"],
};

const inlinkHandler = (e) => {
  state.activeL = e.target.id;
};

state.activeL = getL(location.hash) || "L0";

for (const inlink of inlinks) {
  if (!state.solved.includes(inlink.id)) inlink.classList.add("unsolved");
}

document.addEventListener("click", e => {
  const anchorElem = e.target.closest("a");
  if (getL(anchorElem?.href)) {
    e.preventDefault();
    state.activeL = getL(anchorElem.href);
  }
});
