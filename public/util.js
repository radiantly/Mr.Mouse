export const $ = (selector) => document.querySelector(selector);
export const $id = (idText) => document.getElementById(idText);
export const $all = (selector) =>
  Array.from(document.querySelectorAll(selector));

export const sleep = (timeMs) =>
  new Promise((resolve) => setTimeout(resolve, timeMs));
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
