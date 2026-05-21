const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/Lev/.codex/skills/develop-web-game/scripts/node_modules/playwright");

const projectDir = __dirname;
const outDir = path.join(projectDir, "output", "dice-goal-visual-test");

async function stepVirtual(page, frames) {
  for (let i = 0; i < frames; i += 1) {
    await page.evaluate(() => window.advanceTime && window.advanceTime(1000 / 60));
  }
}

async function closePopup(page) {
  await page.locator('[data-action="close-popup"]').first().click().catch(() => {});
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

  await page.locator('[data-action="open-dice"]').click();
  await page.locator('[data-action="dice-side"][data-side="over"]').click();
  await page.locator('[data-action="dice-chance"][data-chance="25"]').click();
  await page.locator('[data-action="dice-bet"]').click();
  await page.locator('[data-action="dice-roll"]').click();
  await stepVirtual(page, 18);
  await page.screenshot({ path: path.join(outDir, "dice-mid.png"), fullPage: true });
  await stepVirtual(page, 55);
  await page.screenshot({ path: path.join(outDir, "dice.png"), fullPage: true });
  const diceState = await page.evaluate(() => window.render_game_to_text());
  await closePopup(page);
  await page.locator('[data-action="go-menu"]').click();

  await page.locator('[data-action="open-goal"]').click();
  await page.locator('[data-action="goal-size"][data-size="large"]').click();
  await page.locator('[data-action="goal-bet"]').click();
  await page.locator('[data-action="goal-start"]').click();
  await page.screenshot({ path: path.join(outDir, "goal-start.png"), fullPage: true });
  await page.locator('[data-action="goal-pick"][data-col="0"]').first().click();
  await stepVirtual(page, 16);
  await page.screenshot({ path: path.join(outDir, "goal.png"), fullPage: true });
  const goalState = await page.evaluate(() => window.render_game_to_text());

  fs.writeFileSync(path.join(outDir, "state-dice.json"), diceState);
  fs.writeFileSync(path.join(outDir, "state-goal.json"), goalState);
  if (errors.length) fs.writeFileSync(path.join(outDir, "errors.json"), JSON.stringify(errors, null, 2));

  await browser.close();
  console.log(JSON.stringify({ errors: errors.length, diceState, goalState }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
