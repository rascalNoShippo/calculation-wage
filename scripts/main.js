import { element, resetAll } from "./elements.js";
import { handleInput } from "./inputEventListener.js";

const inputElements = Object.values(element).filter(
  /** @type {(e: HTMLElement) => e is HTMLInputElement} */
  ((e) => e instanceof HTMLInputElement)
);

inputElements.forEach((e, i, a) => {
  const length = a.length;
  e.addEventListener("input", handleInput);
  e.addEventListener("keydown", ({ key }) => {
    if (key === "Enter") a[(i + 1) % length].focus();
  });
});

element.resetButton.addEventListener("click", resetAll);

addEventListener("load", () => {
  resetAll();
  element.hourlyWage.focus();
});
