const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("game.js", "utf8");
const sandbox = {
  document: {
    getElementById: () => ({
      addEventListener() {},
      classList: { toggle() {} },
      textContent: "",
      innerHTML: "",
      style: {},
      disabled: false,
      value: "",
    }),
  },
  window: { addEventListener() {} },
  console,
  setTimeout() {},
  clearTimeout() {},
};

sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const result = vm.runInContext(`
  evaluateSlotGrid([
    ["seven", "lemon", "lemon", "lemon", "diamond"],
    ["clover", "clover", "lemon", "bell", "lemon"],
    ["clover", "clover", "bell", "bell", "cherry"],
  ], 25)
`, sandbox);

if (!result.wins.some((win) => win.pattern === "HOR" && win.symbol === "Lemon" && win.multiplier === 1 && win.returned === 25)) {
  throw new Error(`Expected top-row lemon HOR win, got ${JSON.stringify(result)}`);
}

console.log(JSON.stringify(result));

const aboveResult = vm.runInContext(`
  evaluateSlotGrid([
    ["cherry", "lemon", "bell", "diamond", "seven"],
    ["treasure", "bell", "bell", "bell", "cherry"],
    ["bell", "bell", "bell", "bell", "bell"],
  ], 10)
`, sandbox);

if (!aboveResult.wins.some((win) => win.pattern === "ABOVE" && win.symbol === "Bell" && win.multiplier === 4 && win.returned === 40)) {
  throw new Error(`Expected ABOVE arrow win, got ${JSON.stringify(aboveResult)}`);
}

console.log(JSON.stringify({ above: aboveResult }));

const belowResult = vm.runInContext(`
  evaluateSlotGrid([
    ["diamond", "diamond", "diamond", "diamond", "diamond"],
    ["lemon", "diamond", "diamond", "diamond", "seven"],
    ["cherry", "treasure", "diamond", "bell", "clover"],
  ], 10)
`, sandbox);

if (!belowResult.wins.some((win) => win.pattern === "BELOW" && win.symbol === "Diamond" && win.multiplier === 4 && win.returned === 40)) {
  throw new Error(`Expected BELOW arrow win, got ${JSON.stringify(belowResult)}`);
}

console.log(JSON.stringify({ below: belowResult }));

const boosted = vm.runInContext(`
  Math.random = (() => {
    const values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.04, 0, 0, 0];
    let index = 0;
    return () => values[index++] ?? 0;
  })();
  createRandomSlotGrid();
`, sandbox);
sandbox.boosted = boosted;
const boostedResult = vm.runInContext("evaluateSlotGrid(boosted, 10)", sandbox);

if (!boostedResult.wins.some((win) => win.multiplier > 1)) {
  throw new Error(`Expected boosted grid to include a 2x+ pattern, got ${JSON.stringify({ boosted, boostedResult })}`);
}

console.log(JSON.stringify({ boosted: boostedResult }));
