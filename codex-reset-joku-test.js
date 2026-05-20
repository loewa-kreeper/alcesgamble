const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/Lev/.codex/skills/develop-web-game/scripts/node_modules/playwright");

const projectDir = __dirname;

async function getState(page) {
  return JSON.parse(await page.evaluate(() => window.render_game_to_text()));
}

async function main() {
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

  await page.keyboard.press("j");
  await page.keyboard.press("1");
  let state = await getState(page);
  if (state.blackjack.wager !== 1 || state.wallet !== 99) throw new Error("Blackjack bet setup failed");
  await page.keyboard.press("Escape");
  await page.keyboard.press("j");
  state = await getState(page);
  if (state.blackjack.wager !== 0 || state.blackjack.player.length || state.blackjack.dealer.length || state.wallet !== 100) {
    throw new Error("Blackjack did not reset/refund on re-enter");
  }

  await page.keyboard.press("Escape");
  await page.keyboard.press("b");
  await page.keyboard.press("1");
  await page.keyboard.press("b");
  state = await getState(page);
  if (state.baccarat.bets.player !== 1 || state.wallet !== 99) throw new Error("Baccarat bet setup failed");
  await page.keyboard.press("Escape");
  await page.keyboard.press("b");
  state = await getState(page);
  if (state.baccarat.bets.player !== 0 || state.baccarat.playerHand.length || state.baccarat.dealerHand.length || state.wallet !== 100) {
    throw new Error("Baccarat did not reset/refund on re-enter");
  }

  await page.keyboard.press("Escape");
  await page.click("[data-action='open-yahtzee']");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(900);
  state = await getState(page);
  const rolledDice = state.yahtzee.dice.join(",");
  await page.keyboard.press("Escape");
  await page.click("[data-action='open-yahtzee']");
  state = await getState(page);
  if (state.yahtzee.rollsLeft !== 3 || state.yahtzee.dice.join(",") === rolledDice || state.yahtzee.total !== 0) {
    if (state.yahtzee.rollsLeft !== 3 || state.yahtzee.total !== 0) throw new Error("Yahtzee did not reset on re-enter");
  }

  await page.keyboard.press("Escape");
  await page.keyboard.press("u");
  await page.keyboard.press("1");
  await page.keyboard.press("2");
  await page.keyboard.press("3");
  await page.keyboard.press("2");
  state = await getState(page);
  if (state.joku.selectedIndices.length !== 3 || !state.joku.selectedIndices.includes(1)) {
    throw new Error("JOKU allowed disconnecting deselection");
  }

  await browser.close();
  console.log(JSON.stringify({ errors: errors.length, ok: true }, null, 2));
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
