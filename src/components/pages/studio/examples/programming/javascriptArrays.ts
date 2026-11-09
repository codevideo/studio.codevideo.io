import { ICourse } from "@fullstackcraftllc/codevideo-types";
import {
  command,
  createFile,
  openTerminal,
  save,
  speak,
  type,
} from "./lessonActions";

export const arraysFilter = `const products = [
  { name: "Notebook", price: 5, inStock: true },
  { name: "Pen", price: 2, inStock: false },
  { name: "Backpack", price: 35, inStock: true },
];

const available = products.filter(product => product.inStock);
console.log("Available:", available.map(product => product.name).join(", "));
`;
export const arraysMap = `
const salePrices = available.map(product => product.price * 0.8);
console.log("Sale prices:", salePrices.join(", "));
`;
export const arraysReduce = `
const total = salePrices.reduce((sum, price) => sum + price, 0);
console.log("Sale total: $" + total.toFixed(2));
`;
export const javascriptArrays: ICourse = {
  id: "javascript-arrays-in-practice",
  name: "JavaScript Arrays in Practice",
  primaryLanguage: "javascript",
  description:
    "Use filter, map, and reduce to turn a product list into a sale total.",
  lessons: [
    {
      id: "filter-map-reduce",
      name: "From a list of products to a useful total",
      description:
        "Choose items, transform their prices, and combine the results.",
      actions: [
        speak(
          "Imagine a small shop preparing a sale. We need the products that are in stock, their discounted prices, and a total. Three array methods let us express each step separately.",
        ),
        ...createFile("sale.js", arraysFilter),
        openTerminal,
        ...command("node sale.js", "Available: Notebook, Backpack"),
        speak(
          "Filter keeps the original product objects whose condition is true. The pen is out of stock, so it is excluded. The original products array still has all three entries.",
        ),
        type(arraysMap),
        save("sale.js"),
        ...command(
          "node sale.js",
          "Available: Notebook, Backpack\nSale prices: 4, 28",
        ),
        speak(
          "Map transforms each available product into a price. Multiplying by zero point eight applies a twenty percent discount. Unlike filter, map changes what each element represents.",
        ),
        type(arraysReduce),
        save("sale.js"),
        ...command(
          "node sale.js",
          "Available: Notebook, Backpack\nSale prices: 4, 28\nSale total: $32.00",
        ),
        speak(
          "Reduce combines the prices into one number. The initial zero also makes an empty sale list total zero. Use filter to choose, map to transform, and reduce to accumulate.",
        ),
      ],
    },
  ],
};
