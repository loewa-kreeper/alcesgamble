const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/Lev/.codex/skills/develop-web-game/scripts/node_modules/playwright");

const projectDir = __dirname;
const outDir = path.join(projectDir, "output", "crash-cashout-test");

async function stepVirtual(page, frames) {
  for (let i = 0; i < frames; i += 1) {
    await page.evaluate(() => window.advanceTime && window.advanceTime(1000 / 60));
  }
}

async function runCashoutAt(page, frames, shotName) {
  await page.locator('[data-action="open-crash"]').click();
  await page.locator('[data-action="crash-bet"]').click();
  await page.locator('[data-action="crash-start"]').click();
  await stepVirtual(page, frames);
  const before = await page.evaluate(() => window.render_game_to_text());
  await page.locator('[data-action="crash-cashout"]').dispatchEvent("pointerdown", { bubbles: true });
  await stepVirtual(page, 4);
  await page.screenshot({ path: path.join(outDir, shotName), fullPage: true });
  await stepVirtual(page, 125);
  const after = await page.evaluate(() => window.render_game_to_text());
  await page.locator('[data-action="close-popup"]').first().click().catch(() => {});
  await page.locator('[data-action="go-menu"]').click();
  return { before, after };
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
    const seeded = source
      .replace(/rouletteSpinActive: false,\r?\n  wallet: 0,/, "rouletteSpinActive: false,\n  wallet: 1000,")
      .replace(/function randomCrashPoint\(\) \{[\s\S]*?\n\}/, "function randomCrashPoint() {\n  return 5;\n}");
    await route.fulfill({ status: 200, contentType: "application/javascript", body: seeded });
  });

  await page.goto("http://127.0.0.1:8003", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);

  const early = await runCashoutAt(page, 170, "early.png");
  const later = await runCashoutAt(page, 240, "later.png");

  fs.writeFileSync(path.join(outDir, "early-before.json"), early.before);
  fs.writeFileSync(path.join(outDir, "early-after.json"), early.after);
  fs.writeFileSync(path.join(outDir, "later-before.json"), later.before);
  fs.writeFileSync(path.join(outDir, "later-after.json"), later.after);
  if (errors.length) fs.writeFileSync(path.join(outDir, "errors.json"), JSON.stringify(errors, null, 2));

  await browser.close();
  console.log(JSON.stringify({ errors: errors.length, early, later }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
