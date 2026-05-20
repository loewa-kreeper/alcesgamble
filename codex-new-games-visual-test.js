const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/Lev/.codex/skills/develop-web-game/scripts/node_modules/playwright");

const projectDir = __dirname;
const outDir = path.join(projectDir, "output", "new-games-visual-test");

async function stepVirtual(page, frames) {
  for (let i = 0; i < frames; i += 1) {
    await page.evaluate(() => window.advanceTime && window.advanceTime(1000 / 60));
  }
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const errors = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  page.on("pageerror", (error) => errors.push({ type: "pageerror", text: String(error) }));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push({ type: "console.error", text: message.text() });
  });

  await page.route("**/game.js", async (route) => {
    const source = fs.readFileSync(path.join(projectDir, "game.js"), "utf8");
    const seeded = source.replace(/rouletteSpinActive: false,\r?\n  wallet: 0,/, "rouletteSpinActive: false,\n  wallet: 100,");
    await route.fulfill({ status: 200, contentType: "application/javascript", body: seeded });
  });

  await page.goto("http://127.0.0.1:8003", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);

  await page.locator('[data-action="open-plinko"]').click();
  await page.locator('[data-action="plinko-bet"]').click();
  await page.locator('[data-action="plinko-drop"]').click();
  await stepVirtual(page, 70);
  await page.screenshot({ path: path.join(outDir, "plinko-mid.png"), fullPage: true });
  await stepVirtual(page, 290);
  await page.screenshot({ path: path.join(outDir, "plinko.png"), fullPage: true });
  const plinkoState = await page.evaluate(() => window.render_game_to_text());
  await page.locator('[data-action="close-popup"]').first().click().catch(() => {});
  await page.locator('[data-action="go-menu"]').click();

  await page.locator('[data-action="open-crash"]').click();
  await page.locator('[data-action="crash-bet"]').click();
  await page.locator('[data-action="crash-start"]').click();
  await stepVirtual(page, 4);
  await page.locator('[data-action="crash-cashout"]').click().catch(() => {});
  await stepVirtual(page, 10);
  await page.screenshot({ path: path.join(outDir, "crash.png"), fullPage: true });
  const crashState = await page.evaluate(() => window.render_game_to_text());
  await page.locator('[data-action="close-popup"]').first().click().catch(() => {});
  await page.locator('[data-action="go-menu"]').click();

  await page.locator('[data-action="open-minesweeper"]').click();
  await page.locator('[data-action="minesweeper-reveal"][data-index="40"]').click();
  await page.locator('[data-action="minesweeper-cashout"]').click();
  await page.screenshot({ path: path.join(outDir, "minesweeper.png"), fullPage: true });
  const minesweeperState = await page.evaluate(() => window.render_game_to_text());

  fs.writeFileSync(path.join(outDir, "state-plinko.json"), plinkoState);
  fs.writeFileSync(path.join(outDir, "state-crash.json"), crashState);
  fs.writeFileSync(path.join(outDir, "state-minesweeper.json"), minesweeperState);
  if (errors.length) fs.writeFileSync(path.join(outDir, "errors.json"), JSON.stringify(errors, null, 2));

  await browser.close();
  console.log(JSON.stringify({ errors: errors.length, plinkoState, crashState, minesweeperState }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
