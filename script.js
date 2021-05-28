const $ = (selector) => document.querySelector(selector);
const $all = (selector) => document.querySelectorAll(selector);
const $id = (idText) => document.getElementById(idText);

const grid = document.querySelector(".grid");

const rows = 10;
const elems = 2 * rows + 1;
const gr = [];

for (let row = 0; row < elems; row++) {
  for (let col = 0; col < elems; col++) {
    const elem = document.createElement("div");
    if ([0, elems - 1].includes(row) || [0, elems - 1].includes(col))
      elem.classList.add("end");
    elem.classList.add(
      row % 2 && col % 2 ? "box" : row % 2 || col % 2 ? "side" : "inter"
    );

    gr[row * elems + col] = elem;
    grid.appendChild(elem);
  }
}

// Level Selector
const inlinks = Array.from(document.querySelectorAll(".sidebar > a"));
const state = {
  activeL: "L0",
  solved: ["L0"],
};
const setActive = (level) => {
  if (level === state.activeL) return;
  $id(state.activeL).classList.remove("active");
  state.activeL = level;
  $id(state.activeL).classList.add("active");
};

const inlinkHandler = (e) => {
  setActive(e.target.id);
};
for (const inlink of inlinks) {
  if (!state.solved.includes(inlink.id)) inlink.classList.add("unsolved");
}

Array.from($all("a[id^=L]")).forEach((elem) => {
  elem.setAttribute("href", `#${elem.id}`);
  elem.setAttribute("title", `Play ${elem.id}`);
  elem.href = `#${elem.id}`;
  elem.addEventListener("click", (e) => {
    setActive(e.target.id);
  });
});
