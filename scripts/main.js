import { element, resetAll } from "./elements.js";
import { handleInput } from "./inputEventListener.js";

Object.values(element).forEach((e) => {
  if (e instanceof HTMLInputElement) e.addEventListener("input", handleInput);
});

element.resetButton.addEventListener("click", resetAll);
addEventListener("load", resetAll);
