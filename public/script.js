const $ = (selector) => document.querySelector(selector);
const $id = (idText) => document.getElementById(idText);
const $all = (selector) => Array.from(document.querySelectorAll(selector));

const sleep = timeMs => new Promise(resolve => setTimeout(resolve, timeMs));

const grid = document.querySelector(".grid");

const rows = 10;
const elems = 2 * rows + 1;
const gr = [];

let state = {};

const initGrid = ({mpos, cpos} = {}) => {
  // Empty grid if dirty
  grid.innerHTML = `<a href="#L1" class="game-overlay only-L0"><div><h2>START GAME</h2></div></a>`;

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

const levelInfo = {
  L0: {
    mpos: { x: 7, y: 5 },
    cpos: { x: 4, y: 7 }
  },
  L1: {
    mpos: { x: 7, y: 5 },
    cpos: { x: 4, y: 7 }
  },
};

const initLvl = level => {
  initGrid(levelInfo[level]);
  state.mpos = levelInfo[level].mpos;
}

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
state = {
  ...state,
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
    $(".output-box").classList.add("hidden");
    initLvl(level);
    cm.refresh();
  },
  solved: ["L0"],
  rotation: 0
};

const commandExecutor = async (command) => {
  window.console.info(state);
  command = command.toLowerCase();
  if (!["left", "right", "up", "down"].includes(command))
    return "Mr. Mouse is ignoring this.";
  if (command === "left") {
    if (state.mpos.x === 1) return "Oh no! There's a wall!";
    state.mpos.x--;
    $(".mouseWrap").style.gridArea = `${state.mpos.y * 2} / ${state.mpos.x * 2} / span 1 / span 1`;
    $(".mouse-img").classList.remove("up", "down", "right", "left");
    return "Mr. Mouse moved left!"
  }
  
  if (command === "right") {
    if (state.mpos.x === rows) return "Oh no! There's a wall!";
    state.mpos.x++;
    $(".mouseWrap").style.gridArea = `${state.mpos.y * 2} / ${state.mpos.x * 2} / span 1 / span 1`;
    $(".mouse-img").classList.remove("up", "down", "right", "left");
    return "Mr. Mouse moved right!"
  }

  if (command === "up") {
    if (state.mpos.y === 1) return "Oh no! There's a wall!";
    state.mpos.y--;
    $(".mouseWrap").style.gridArea = `${state.mpos.y * 2} / ${state.mpos.x * 2} / span 1 / span 1`;
    $(".mouse-img").classList.remove("up", "down", "right", "left");
    return "Mr. Mouse moved up!"
  }

  if (command === "down") {
    if (state.mpos.y === rows) return "Oh no! There's a wall!";
    state.mpos.y++;
    $(".mouseWrap").style.gridArea = `${state.mpos.y * 2} / ${state.mpos.x * 2} / span 1 / span 1`;
    $(".mouse-img").classList.remove("up", "down", "right", "left");
    return "Mr. Mouse moved down!"
  }
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

$(".run-btn").addEventListener("click", e => {
  const f = async (...args) => {
    const out = args.map(arg => arg?.toString() || "").join(" ");
    if (!out) out = "&nbsp;"
    window.console.info("hi", args);
    const textDiv = document.createElement("div");
    textDiv.classList.add("out", "text");
    textDiv.innerText = out;
    $(".output-here").appendChild(textDiv);
    const result = await commandExecutor(out);
    const resultDiv = document.createElement("div");
    resultDiv.classList.add("result");
    resultDiv.innerText = result;
    $(".output-here").appendChild(resultDiv);
    await sleep(1000);
  }
  const console = {
    log: f,
    info: f,
    error: f
  }
  const code = cm.getValue();
  // window.console.info("hello!", code);
  $all(".hide-on-run").map(elem => elem.removeAttribute("open"));
  $(".output-here").innerHTML = "";
  $(".output-box").classList.remove("hidden");
  const codeToExec = `(async () => {${code.replace(/(?:await )?(console\.log)/g, "await $1")}})()`;
  window.console.log(codeToExec);
  try {
    eval(codeToExec);
  } catch(ex) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error", "text");
    errorDiv.innerText = ex;
    $(".output-here").appendChild(errorDiv);
  }
});

initLvl("L0");
