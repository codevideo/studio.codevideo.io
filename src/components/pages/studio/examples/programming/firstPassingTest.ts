import { ICourse } from "@fullstackcraftllc/codevideo-types";
import {
  command,
  createFile,
  openTerminal,
  replaceFile,
  speak,
} from "./lessonActions";

export const discountBroken = `function applyDiscount(price, percent) {
  return price - percent / 100;
}

module.exports = { applyDiscount };
`;
export const discountFixed = discountBroken.replace(
  "price - percent / 100",
  "price * (1 - percent / 100)",
);
export const discountTest = `const assert = require("node:assert/strict");
const { applyDiscount } = require("./discount.cjs");

assert.equal(applyDiscount(100, 20), 80);
console.log("PASS: 20% off 100 costs 80");
`;
export const firstPassingTest: ICourse = {
  id: "javascript-first-passing-test",
  name: "Your First Passing Test",
  primaryLanguage: "javascript",
  description:
    "Use Node’s built-in assertions to catch and fix an incorrect discount calculation.",
  lessons: [
    {
      id: "red-green-discount",
      name: "Write an assertion, watch it fail, fix the function",
      description:
        "A small red-to-green testing workflow without a testing framework.",
      actions: [
        speak(
          "A discount function can return a number without returning the right number. Let’s write one example of correct behavior before fixing this implementation.",
        ),
        ...createFile("discount.cjs", discountBroken),
        speak(
          "Twenty percent off one hundred should cost eighty. A strict equality assertion turns that expectation into an executable check. Node provides the assertion module, so we do not need to install a package.",
        ),
        ...createFile("discount.test.cjs", discountTest),
        openTerminal,
        ...command(
          "node discount.test.cjs",
          "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:\n\n99.8 !== 80",
        ),
        speak(
          "The failure is useful: we subtracted zero point two instead of twenty percent of the price. The discount must scale with the original price. Keep the test unchanged while correcting the formula.",
        ),
        ...replaceFile("discount.cjs", discountBroken, discountFixed),
        ...command("node discount.test.cjs", "PASS: 20% off 100 costs 80"),
        speak(
          "The assertion passes, so execution reaches our success message. This does not prove every input is correct. Useful next cases are a zero percent discount and a full discount. Start with a concrete expectation, then make it pass.",
        ),
      ],
    },
  ],
};
