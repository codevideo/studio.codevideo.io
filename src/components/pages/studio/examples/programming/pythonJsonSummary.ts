import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { command, createFile, openTerminal, speak } from "./lessonActions";

export const ordersJson = `[
  { "customer": "Ada", "items": 3, "fulfilled": true },
  { "customer": "Lin", "items": 2, "fulfilled": false },
  { "customer": "Sam", "items": 4, "fulfilled": true }
]
`;
export const summaryPython = `import json
from pathlib import Path

source = Path(__file__).with_name("orders.json")
with source.open(encoding="utf-8") as file:
    orders = json.load(file)

fulfilled = [order for order in orders if order["fulfilled"]]
item_count = sum(order["items"] for order in fulfilled)

print(f"Orders: {len(orders)}")
print(f"Fulfilled: {len(fulfilled)}")
print(f"Items to report: {item_count}")
`;
export const pythonJsonSummary: ICourse = {
  id: "python-json-summary",
  name: "Read JSON and Produce a Summary",
  primaryLanguage: "python",
  description:
    "Load a local JSON file, select fulfilled orders, and summarize their item counts.",
  lessons: [
    {
      id: "summarize-local-orders",
      name: "From a data file to a report",
      description:
        "Use the standard library to load structured data and calculate a summary.",
      actions: [
        speak(
          "A useful script often starts with a small data file. This JSON contains three orders. We want to count the fulfilled orders and report how many items they contain.",
        ),
        ...createFile("orders.json", ordersJson),
        speak(
          "Each order has a customer, an item count, and a fulfilled flag. Notice that JSON uses lowercase true and false. Python’s JSON loader converts those values for us.",
        ),
        ...createFile("summary.py", summaryPython),
        speak(
          "Build the data path relative to this script, rather than the terminal’s current directory. The with block closes the file automatically. Then a list comprehension selects fulfilled orders and sum adds their item counts.",
        ),
        { name: "file-explorer-open-file", value: "orders.json" },
        speak(
          "Ada has three items and Sam has four. Lin’s unfulfilled order should not enter the item total. Predicting seven gives us a quick check on the script.",
        ),
        { name: "file-explorer-open-file", value: "summary.py" },
        openTerminal,
        ...command(
          "python3 summary.py",
          "Orders: 3\nFulfilled: 2\nItems to report: 7",
        ),
        speak(
          "The report matches our prediction: three orders overall, two fulfilled, and seven items. Keep loading, filtering, and summarizing as separate steps so each part is easy to check.",
        ),
      ],
    },
  ],
};
