import { element, resetAll } from "./elements";
import { handleInput } from "./inputEventListener";

Object.values(element).forEach((e) => {
  if (e instanceof HTMLInputElement) e.addEventListener("input", handleInput);
});

element.resetButton.addEventListener("click", resetAll);
addEventListener("load", resetAll);
