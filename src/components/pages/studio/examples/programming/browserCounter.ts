import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { createFile, speak } from "./lessonActions";

export const counterHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>A tiny counter</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <main>
    <h1>A tiny counter</h1>
    <output id="count" aria-live="polite">0</output>
    <div>
      <button id="increment" type="button">Add one</button>
      <button id="reset" type="button">Reset</button>
    </div>
  </main>
  <script src="./counter.js"></script>
</body>
</html>
`;
export const counterCss = `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font: 20px system-ui, sans-serif;
  background: #152322;
  color: #effffb;
}
main { text-align: center; }
output { display: block; font-size: 5rem; margin: 1rem; }
button {
  padding: .7rem 1rem;
  border: 0;
  border-radius: .5rem;
  background: #99ead0;
  cursor: pointer;
}
`;
export const counterJs = `const output = document.querySelector("#count");
let count = 0;

function render() {
  output.textContent = String(count);
}

document.querySelector("#increment").addEventListener("click", () => {
  count += 1;
  render();
});

document.querySelector("#reset").addEventListener("click", () => {
  count = 0;
  render();
});
`;
export const browserCounter: ICourse = {
  id: "browser-counter",
  name: "Build a Browser Counter",
  primaryLanguage: "javascript",
  description:
    "Connect HTML, CSS, and JavaScript to make an interactive counter with a reset button.",
  lessons: [
    {
      id: "counter-events-and-state",
      name: "From a button to an interactive page",
      description:
        "Keep state in JavaScript and update the page in response to click events.",
      actions: [
        speak(
          "Let’s build a counter with two controls: add one, and reset. We’ll separate the page structure, its appearance, and its behavior into three files.",
        ),
        ...createFile("index.html", counterHtml),
        speak(
          "The output element starts at zero. The buttons have stable IDs so JavaScript can find them. The script loads after these elements exist, at the end of the body.",
        ),
        ...createFile("style.css", counterCss),
        speak(
          "A little CSS centers the page and makes the current count easy to read. The behavior will work independently of these styles.",
        ),
        ...createFile("counter.js", counterJs),
        speak(
          "The count variable is our state. Each event listener changes it, then calls the same render function. Reset assigns zero instead of adding another number.",
        ),
        speak(
          "In the preview, try Add one, then Reset. The number on the page follows the state. For a small interactive feature, start with state, an event, and one function that updates the display.",
        ),
        { name: "external-web-preview", value: "1" },
      ],
    },
  ],
};
