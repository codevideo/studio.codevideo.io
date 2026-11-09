import { ICourse } from "@fullstackcraftllc/codevideo-types";
import {
  command,
  createFile,
  openTerminal,
  replaceFile,
  speak,
} from "./lessonActions";

export const productWithMistake = `type Product = {
  name: string;
  price: number;
};

function label(product: Product): string {
  return product.name + ": $" + product.price.toFixed(2);
}

const notebook: Product = { name: "Notebook", price: "12.50" };
console.log(label(notebook));
`;
export const productCorrected = productWithMistake.replace(
  'price: "12.50"',
  "price: 12.5",
);
export const typescriptMistake: ICourse = {
  id: "typescript-catches-a-mistake",
  name: "TypeScript Catches a Mistake",
  primaryLanguage: "typescript",
  description:
    "Use a Product type to catch a price stored as text before running the program. Requires TypeScript.",
  lessons: [
    {
      id: "product-price-type",
      name: "Catch the mismatch before runtime",
      description:
        "Check a small program with the TypeScript compiler and correct its data.",
      actions: [
        speak(
          "This label function expects a numeric price because it calls toFixed. Let’s describe that expectation with a Product type, then see what happens when the data disagrees.",
        ),
        ...createFile("product.ts", productWithMistake),
        openTerminal,
        ...command(
          "tsc --strict --noEmit product.ts",
          "product.ts(10,47): error TS2322: Type 'string' is not assignable to type 'number'.",
        ),
        speak(
          "The price was written in quotes. It is text, while the type requires a number. The compiler catches that mismatch before the label function can fail at runtime. We are checking types here, without emitting JavaScript.",
        ),
        ...replaceFile("product.ts", productWithMistake, productCorrected),
        ...command(
          'tsc --strict --noEmit product.ts && echo "Types check"',
          "Types check",
        ),
        speak(
          "Removing the quotes supplies the correct kind of value. We can keep two decimal places as a presentation choice inside the label function. Store numbers as numbers, and format them when displaying them.",
        ),
        speak(
          "Types help at development time. They do not validate arbitrary JSON arriving over a network. For this local object, the annotation lets TypeScript check the data and its use together.",
        ),
      ],
    },
  ],
};
