const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/Lev/.codex/skills/develop-web-game/scripts/node_modules/playwright");

const projectDir = __dirname;
const outDir = path.join(projectDir, "output", "baccarat-visual-test");

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
  await page.waitForTimeout(400);
  await page.keyboard.press("b");
  await page.keyboard.press("q");
  await page.keyboard.press("b");
  await page.keyboard.press("Enter");

  await page.waitForTimeout(460);
  await page.screenshot({ path: path.join(outDir, "mid-reveal.png") });
  const midState = await page.evaluate(() => window.render_game_to_text());
  const midRevealedClassCount = await page.locator(".baccarat-cards .playing-card.revealed").count();

  for (let i = 0; i < 520; i += 1) {
    await page.evaluate(() => window.advanceTime && window.advanceTime(1000 / 60));
  }
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "final.png") });
  const finalState = await page.evaluate(() => window.render_game_to_text());

  fs.writeFileSync(path.join(outDir, "state-mid.json"), midState);
  fs.writeFileSync(path.join(outDir, "state-final.json"), finalState);
  if (errors.length) fs.writeFileSync(path.join(outDir, "errors.json"), JSON.stringify(errors, null, 2));

  await browser.close();
  console.log(JSON.stringify({ errors: errors.length, midRevealedClassCount, midState, finalState }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
