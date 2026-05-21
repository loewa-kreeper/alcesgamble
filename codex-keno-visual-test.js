const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/Lev/.codex/skills/develop-web-game/scripts/node_modules/playwright");

const projectDir = __dirname;
const outDir = path.join(projectDir, "output", "keno-visual-test");

async function stepVirtual(page, frames) {
  for (let i = 0; i < frames; i += 1) {
    await page.evaluate(() => window.advanceTime && window.advanceTime(1000 / 60));
  }
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const errors = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  page.on("pageerror", (error) => errors.push({ type: "pageerror", text: String(error) }));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push({ type: "console.error", text: message.text() });
  });

  await page.route("**/game.js", async (route) => {
    const source = fs.readFileSync(path.join(projectDir, "game.js"), "utf8");
    const seeded = source.replace(
      /rouletteSpinActive: false,\r?\n  wallet: 0,/,
      "rouletteSpinActive: false,\n  wallet: 500,"
    );
    await route.fulfill({ status: 200, contentType: "application/javascript", body: seeded });
  });

  await page.goto("http://127.0.0.1:8003", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  await page.locator('[data-action="open-keno"]').click();

  for (const number of [1, 7, 13, 19, 25]) {
    await page.locator(`[data-action="keno-pick"][data-number="${number}"]`).click();
  }
  await page.locator('[data-action="keno-pick"][data-number="31"]').click();
  const pickLimitState = await page.evaluate(() => window.render_game_to_text());
  await page.locator('[data-action="keno-bet"]').click();
  await page.screenshot({ path: path.join(outDir, "keno-ready.png"), fullPage: true });

  await page.locator('[data-action="keno-draw"]').click();
  await stepVirtual(page, 18);
  await page.screenshot({ path: path.join(outDir, "keno-drawing.png"), fullPage: true });
  await stepVirtual(page, 48);
  await page.screenshot({ path: path.join(outDir, "keno.png"), fullPage: true });
  const finalState = await page.evaluate(() => window.render_game_to_text());

  fs.writeFileSync(path.join(outDir, "state-pick-limit.json"), pickLimitState);
  fs.writeFileSync(path.join(outDir, "state-keno.json"), finalState);
  if (errors.length) fs.writeFileSync(path.join(outDir, "errors.json"), JSON.stringify(errors, null, 2));

  await browser.close();

  const pickLimit = JSON.parse(pickLimitState).keno;
  const final = JSON.parse(finalState).keno;
  const failed = pickLimit.picks.length !== 5
    || final.drawn.length !== 10
    || !final.result
    || final.wager !== 0;
  if (errors.length || failed) {
    console.error(JSON.stringify({ errors, pickLimit, final }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ errors: errors.length, pickLimit: pickLimit.picks, drawn: final.drawn, result: final.result }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
