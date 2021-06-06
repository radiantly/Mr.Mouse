import { $, $id, $all, sleep, deepClone } from "./util.js";
import { initGrid } from "./canvas.js";

// const grid = document.querySelector(".grid");

const rows = 10;
const elems = 2 * rows + 1;
const gr = [];

let state = {};

initGrid();

const gridWrap = $(".grid-wrap");

// Mouse
const mouse = document.createElement("img");
mouse.src = "mouse.png";
mouse.classList.add("mouse-img", "grid-item", "grid-cell");
gridWrap.appendChild(mouse);

// Cheese
const cheese = document.createElement("img");
cheese.src = "cheese.png";
cheese.classList.add("cheese-img", "grid-item", "grid-cell");
gridWrap.appendChild(cheese);

const levelInfo = {
  L0: {
    mpos: { x: 7, y: 5 },
    cpos: { x: 4, y: 7 },
  },
  L1: {
    mpos: { x: 6, y: 6 },
    cpos: { x: 4, y: 7 },
  },
  L2: {
    mpos: { x: 2, y: 3 },
    cpos: { x: 5, y: 4 },
    walls: [
      [3, 2],
      [4, 5],
      [6, 5],
      [15, 14],
      [7, 8],
      [12, 11],
      [16, 5],
    ],
  },
  L3: {
    mpos: { x: 4, y: 7 },
    cpos: { x: 6, y: 4 },
    dark: true,
  },
  L4: {
    mpos: { x: 3, y: 6 },
    cpos: { x: 7, y: 7 },
  },
  L5: {
    mpos: { x: 7, y: 9 },
    cpos: { x: 6, y: 6 },
  },
};

const getL = (text) => {
  const L = text?.match(/L\d/)?.[0];
  if (L) return L;
  return text?.match(/LN/) ? `L${1 + parseInt(state._activeL.slice(1))}` : null;
};

const cm = CodeMirror.fromTextArea($id("console"), {
  lineNumbers: true,
  mode: "javascript",
  theme: "default height",
  matchBrackets: true,
  placeholder: "Type your code here!",
});

const initLvl = (level) => {
  initGrid(levelInfo[level]);
  Object.assign(state, deepClone(levelInfo[level]));
};

// Level Selector
const inlinks = Array.from(document.querySelectorAll(".sidebar > a"));
state = {
  ...state,
  _activeL: "L0",
  set activeL(level) {
    if (level === state._activeL) return;
    if (state._activeL) {
      $id(state._activeL).classList.remove("active");
      document.body.classList.remove(state._activeL, "completed");
    }
    state._activeL = level;
    location.hash = level;
    $id(state._activeL).classList.add("active");
    document.body.classList.add(state._activeL);
    $(".output-box").classList.add("hidden");
    initLvl(level);
    cm.refresh();
    cm.setValue("");
    $all(".hide-on-run").map((elem) => elem.setAttribute("open", true));
  },
  solved: ["L0"],
  rotation: 0,
};

const commandExecutor = async (command) => {
  window.console.info(state);
  command = command.toLowerCase();
  if (!["left", "right", "up", "down"].includes(command))
    return "Mr. Mouse is ignoring this.";
  if (command === "left") {
    if (state.mpos.x === 1) return "Oh no! There's a wall!";
    state.mpos.x--;
    $(".mouseWrap").style.gridArea = `${state.mpos.y * 2} / ${
      state.mpos.x * 2
    } / span 1 / span 1`;
    $(".mouse-img").classList.remove("up", "down", "right", "left");
    return "Mr. Mouse moved left!";
  }

  if (command === "right") {
    if (state.mpos.x === rows) return "Oh no! There's a wall!";
    state.mpos.x++;
    $(".mouseWrap").style.gridArea = `${state.mpos.y * 2} / ${
      state.mpos.x * 2
    } / span 1 / span 1`;
    $(".mouse-img").classList.remove("up", "down", "right", "left");
    return "Mr. Mouse moved right!";
  }

  if (command === "up") {
    if (state.mpos.y === 1) return "Oh no! There's a wall!";
    state.mpos.y--;
    $(".mouseWrap").style.gridArea = `${state.mpos.y * 2} / ${
      state.mpos.x * 2
    } / span 1 / span 1`;
    $(".mouse-img").classList.remove("up", "down", "right", "left");
    return "Mr. Mouse moved up!";
  }

  if (command === "down") {
    if (state.mpos.y === rows) return "Oh no! There's a wall!";
    state.mpos.y++;
    $(".mouseWrap").style.gridArea = `${state.mpos.y * 2} / ${
      state.mpos.x * 2
    } / span 1 / span 1`;
    $(".mouse-img").classList.remove("up", "down", "right", "left");
    return "Mr. Mouse moved down!";
  }
};

const inlinkHandler = (e) => {
  state.activeL = e.target.id;
};

state.activeL = getL(location.hash) || "L0";

// for (const inlink of inlinks) {
//   if (!state.solved.includes(inlink.id)) inlink.classList.add("unsolved");
// }

document.addEventListener("click", (e) => {
  const anchorElem = e.target.closest("a");
  if (getL(anchorElem?.href)) {
    console.log(getL(anchorElem.href));
    e.preventDefault();
    state.activeL = getL(anchorElem.href);
  }
});

$(".run-btn").addEventListener("click", (e) => {
  const f = async (...args) => {
    const out = args.map((arg) => arg?.toString() || "").join(" ");
    if (!out) out = "&nbsp;";
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
    window.console.info(state.mpos, state.cpos, state.cpos === state.mpos);
    if (state.cpos.x === state.mpos.x && state.cpos.y === state.mpos.y) {
      document.body.classList.add("completed");
      throw "Level Complete!";
    }
    await sleep(1000);
  };
  const console = {
    log: f,
    info: f,
    error: f,
  };
  const code = cm.getValue();
  // window.console.info("hello!", code);
  $all(".hide-on-run").map((elem) => elem.removeAttribute("open"));
  $(".output-here").innerHTML = "";
  $(".output-box").classList.remove("hidden");
  let codeToExec = `(async () => {${code.replace(
    /(?:await )?(console\.log)/g,
    "await $1"
  )}})()`;
  codeToExec = codeToExec.replace(/cheese_position/g, '"G6"');
  window.console.log(codeToExec);
  try {
    eval(codeToExec);
  } catch (ex) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error", "text");
    errorDiv.innerText = ex;
    $(".output-here").appendChild(errorDiv);
  }
});

initLvl("L0");
