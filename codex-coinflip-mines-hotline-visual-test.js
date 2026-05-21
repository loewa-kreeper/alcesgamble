const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/Lev/.codex/skills/develop-web-game/scripts/node_modules/playwright");

const projectDir = __dirname;
const outDir = path.join(projectDir, "output", "coinflip-mines-hotline-visual-test");

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

  await page.locator('[data-action="open-coinflip"]').click();
  await page.locator('[data-action="coinflip-bet"][data-side="heads"]').click();
  await page.locator('[data-action="coinflip-bet"][data-side="side"]').click();
  await page.locator('[data-action="coinflip-flip"]').click();
  await stepVirtual(page, 30);
  await page.screenshot({ path: path.join(outDir, "coinflip-mid.png"), fullPage: true });
  await stepVirtual(page, 70);
  await page.screenshot({ path: path.join(outDir, "coinflip.png"), fullPage: true });
  const coinflipState = await page.evaluate(() => window.render_game_to_text());
  await closePopup(page);
  await page.locator('[data-action="go-menu"]').click();

  await page.locator('[data-action="open-mines"]').click();
  await page.locator('[data-action="mines-bet"]').click();
  await page.locator('[data-action="mines-start"]').click();
  await page.locator('[data-action="mines-open"]').first().click();
  await page.locator('[data-action="mines-cashout"]').click().catch(() => {});
  await stepVirtual(page, 20);
  await page.screenshot({ path: path.join(outDir, "mines.png"), fullPage: true });
  const minesState = await page.evaluate(() => window.render_game_to_text());
  await closePopup(page);
  await page.locator('[data-action="go-menu"]').click();

  await page.locator('[data-action="open-hotline"]').click();
  await page.locator('[data-action="hotline-bet"][data-side="black"]').click();
  await page.locator('[data-action="hotline-bet"][data-side="yellow"]').click();
  await page.locator('[data-action="hotline-spin"]').click();
  await stepVirtual(page, 35);
  await page.screenshot({ path: path.join(outDir, "hotline-mid.png"), fullPage: true });
  await stepVirtual(page, 710);
  await page.screenshot({ path: path.join(outDir, "hotline.png"), fullPage: true });
  const hotlineState = await page.evaluate(() => window.render_game_to_text());
  await closePopup(page);

  await page.locator('[data-action="hotline-mode"]').click();
  await page.locator('[data-action="hotline-bet"][data-side="red"]').click();
  await page.locator('[data-action="hotline-spin"]').click();
  await stepVirtual(page, 35);
  await page.screenshot({ path: path.join(outDir, "hotline-high-risk-mid.png"), fullPage: true });
  await stepVirtual(page, 710);
  await page.screenshot({ path: path.join(outDir, "hotline-high-risk.png"), fullPage: true });
  const hotlineHighRiskState = await page.evaluate(() => window.render_game_to_text());

  fs.writeFileSync(path.join(outDir, "state-coinflip.json"), coinflipState);
  fs.writeFileSync(path.join(outDir, "state-mines.json"), minesState);
  fs.writeFileSync(path.join(outDir, "state-hotline.json"), hotlineState);
  fs.writeFileSync(path.join(outDir, "state-hotline-high-risk.json"), hotlineHighRiskState);
  if (errors.length) fs.writeFileSync(path.join(outDir, "errors.json"), JSON.stringify(errors, null, 2));

  await browser.close();
  console.log(JSON.stringify({ errors: errors.length, coinflipState, minesState, hotlineState, hotlineHighRiskState }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
