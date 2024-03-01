import { element, resetAll } from "./elements.js";
import { handleInput } from "./inputEventListener.js";
import { mod } from "./utils.js";

const inputElements = Object.values(element).filter(
  /** @type {(e: HTMLElement) => e is HTMLInputElement} */
  ((e) => e instanceof HTMLInputElement)
);

inputElements.forEach((e, i, a) => {
  const length = a.length;
  e.addEventListener("input", handleInput);
  e.addEventListener("keydown", ({ key, shiftKey }) => {
    const nextIndex = mod(i + (shiftKey ? -1 : 1), length);
    if (key === "Enter") a[nextIndex].focus();
  });
});

element.resetButton.addEventListener("click", resetAll);

addEventListener("load", () => {
  resetAll();
  element.hourlyWage.focus();
});
