import { afterAll, describe, expect, it } from "vitest";
import {
  isValidActions,
  estimateActionDurationsMs,
  type ILesson,
} from "@fullstackcraftllc/codevideo-types";
import { VirtualIDE } from "@fullstackcraftllc/codevideo-virtual-ide";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { programmingExamples } from "./index";
import { allProjects } from "../allProjects";
import { RENDER_PAUSES } from "../../../../../utils/estimateVideoDurationInSeconds";

const root = mkdtempSync(path.join(tmpdir(), "codevideo-programming-"));
afterAll(() => rmSync(root, { recursive: true, force: true }));
const course = (id: string) => programmingExamples.find((c) => c.id === id)!;
const finish = (lesson: ILesson, index = lesson.actions.length - 1) =>
  new VirtualIDE(lesson.actions, index);
function filesFor(lesson: ILesson, index?: number) {
  return Object.fromEntries(
    finish(lesson, index)
      .getEditorSnapshot()
      .editors.map((e) => [e.filename, e.content]),
  );
}
function materialize(lesson: ILesson, index?: number) {
  const directory = mkdtempSync(path.join(root, "lesson-"));
  for (const [filename, content] of Object.entries(filesFor(lesson, index))) {
    mkdirSync(path.dirname(path.join(directory, filename)), {
      recursive: true,
    });
    writeFileSync(path.join(directory, filename), content);
  }
  return directory;
}
function beforeFirstCommand(lesson: ILesson) {
  return lesson.actions.findIndex((a) => a.name === "terminal-type") - 1;
}
const available = (name: string) =>
  spawnSync(name, name === "go" ? ["version"] : ["--version"], {
    stdio: "ignore",
  }).status === 0;

it("registers eight new courses with unique project and lesson IDs", () => {
  expect(programmingExamples).toHaveLength(8);
  expect(new Set(allProjects.map((c) => c.id)).size).toBe(allProjects.length);
  for (const c of programmingExamples) {
    expect(allProjects).toContain(c);
    expect(new Set(c.lessons.map((l) => l.id)).size).toBe(c.lessons.length);
  }
});

for (const c of programmingExamples)
  describe(c.name, () => {
    for (const lesson of c.lessons)
      it(`${lesson.name}: valid, independent and saved`, () => {
        expect(isValidActions(lesson.actions)).toMatchObject({ isValid: true });
        for (const a of lesson.actions) {
          if (a.name.startsWith("author-speak-"))
            expect(a.value.length).toBeLessThanOrEqual(1000);
        }
        const ide = finish(lesson);
        expect(ide.getLogs().filter((log) => log.type === "error")).toEqual([]);
        expect(ide.getEditorSnapshot().editors.length).toBeGreaterThan(0);
        expect(ide.getEditorSnapshot().editors.every((e) => e.isSaved)).toBe(
          true,
        );
        const duration = estimateActionDurationsMs(
          lesson.actions,
          RENDER_PAUSES,
        ).reduce((sum, ms) => sum + ms, 0);
        expect(Number.isFinite(duration)).toBe(true);
        expect(duration).toBeGreaterThan(15000);
        expect(duration).toBeLessThan(180000);
      });
  });

it("executes each JavaScript array stage with the authored results", () => {
  const lesson = course("javascript-arrays-in-practice").lessons[0]!;
  const commands = lesson.actions.flatMap((a, index) =>
    a.name === "terminal-type" ? [index] : [],
  );
  const expected = [
    "Available: Notebook, Backpack\n",
    "Available: Notebook, Backpack\nSale prices: 4, 28\n",
    "Available: Notebook, Backpack\nSale prices: 4, 28\nSale total: $32.00\n",
  ];
  for (const [i, index] of commands.entries()) {
    expect(
      execFileSync(process.execPath, ["sale.js"], {
        cwd: materialize(lesson, index - 1),
        encoding: "utf8",
      }),
    ).toBe(expected[i]);
  }
});

it("demonstrates a real failing assertion followed by a passing one", () => {
  const lesson = course("javascript-first-passing-test").lessons[0]!;
  const before = spawnSync(process.execPath, ["discount.test.cjs"], {
    cwd: materialize(lesson, beforeFirstCommand(lesson)),
    encoding: "utf8",
  });
  expect(before.status).toBe(1);
  expect(before.stderr).toContain("99.8 !== 80");
  expect(
    execFileSync(process.execPath, ["discount.test.cjs"], {
      cwd: materialize(lesson),
      encoding: "utf8",
    }),
  ).toBe("PASS: 20% off 100 costs 80\n");
});

it.runIf(available("python3"))(
  "the Python loop goes from missing five to including five",
  () => {
    const lesson = course("python-off-by-one").lessons[0]!;
    const run = (index?: number) =>
      execFileSync("python3", ["count.py"], {
        cwd: materialize(lesson, index),
        encoding: "utf8",
      });
    expect(run(beforeFirstCommand(lesson))).toBe("1\n2\n3\n4\n");
    expect(run()).toBe("1\n2\n3\n4\n5\n");
  },
);

it.runIf(available("python3"))(
  "extracting the Python function preserves output",
  () => {
    const lesson = course("python-extract-function").lessons[0]!;
    for (const index of [beforeFirstCommand(lesson), undefined])
      expect(
        execFileSync("python3", ["temperatures.py"], {
          cwd: materialize(lesson, index),
          encoding: "utf8",
        }),
      ).toBe("Morning: 50.0 F\nAfternoon: 68.0 F\n");
  },
);

it.runIf(available("python3"))(
  "the JSON report works even from another working directory",
  () => {
    const directory = materialize(course("python-json-summary").lessons[0]!);
    expect(
      execFileSync("python3", [path.join(directory, "summary.py")], {
        cwd: root,
        encoding: "utf8",
      }),
    ).toBe("Orders: 3\nFulfilled: 2\nItems to report: 7\n");
  },
);

it("TypeScript rejects the string price and accepts the corrected program", () => {
  const lesson = course("typescript-catches-a-mistake").lessons[0]!;
  function check(index?: number) {
    const directory = materialize(lesson, index);
    const filename = path.join(directory, "product.ts");
    const program = ts.createProgram([filename], {
      strict: true,
      noEmit: true,
      types: [],
      target: ts.ScriptTarget.ES2020,
    });
    return ts
      .getPreEmitDiagnostics(program)
      .filter((d) => d.category === ts.DiagnosticCategory.Error);
  }
  const errors = check(beforeFirstCommand(lesson));
  expect(errors.map((e) => e.code)).toEqual([2322]);
  const position = errors[0]!.file!.getLineAndCharacterOfPosition(
    errors[0]!.start!,
  );
  expect({ line: position.line + 1, column: position.character + 1 }).toEqual({
    line: 10,
    column: 47,
  });
  expect(check()).toEqual([]);
});

it("the counter loads local assets and responds to increment and reset", () => {
  const lesson = course("browser-counter").lessons[0]!;
  expect(lesson.actions.at(-1)?.name).toBe("external-web-preview");
  const files = filesFor(lesson);
  expect(files["index.html"]).toContain('href="./style.css"');
  expect(files["style.css"]).toContain("button");
  expect(files["index.html"]).toContain('src="./counter.js"');
  const listeners: Record<string, () => void> = {};
  const output = { textContent: "0" };
  const context = vm.createContext({
    document: {
      querySelector: (selector: string) =>
        selector === "#count"
          ? output
          : {
              addEventListener: (_event: string, listener: () => void) => {
                listeners[selector] = listener;
              },
            },
    },
  });
  vm.runInContext(files["counter.js"]!, context);
  listeners["#increment"]!();
  listeners["#increment"]!();
  expect(output.textContent).toBe("2");
  listeners["#reset"]!();
  expect(output.textContent).toBe("0");
});

it.runIf(available("go"))(
  "each Go lesson builds on its own and has the expected exit behavior",
  () => {
    const lessons = course("go-small-cli").lessons;
    for (const [index, lesson] of lessons.entries()) {
      const directory = materialize(lesson);
      const executable = path.join(directory, "greet");
      execFileSync("go", ["build", "-o", executable, "main.go"], {
        cwd: directory,
        timeout: 60000,
        stdio: "pipe",
      });
      expect(execFileSync(executable, ["Ada"], { encoding: "utf8" })).toBe(
        "Hello, Ada!\n",
      );
      if (index >= 1) {
        const missing = spawnSync(executable, [], { encoding: "utf8" });
        expect(missing.status).toBe(1);
        expect(missing.stderr).toBe("Usage: greet NAME\n");
      }
      if (index === 2) {
        const blank = spawnSync(executable, ["   "], { encoding: "utf8" });
        expect(blank.status).toBe(1);
        expect(blank.stderr).toBe("Name must not be blank\n");
        expect(
          execFileSync(executable, ["  Ada Lovelace  "], { encoding: "utf8" }),
        ).toBe("Hello, Ada Lovelace!\n");
      }
    }
  },
  60000,
);
