const fs = require("fs");
const path = require("path");
const { chromium } = require("C:/Users/Lev/.codex/skills/develop-web-game/scripts/node_modules/playwright");

const projectDir = __dirname;

function readState(raw) {
  return JSON.parse(raw);
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
    const seeded = source.replace(/rouletteSpinActive: false,\r?\n  wallet: 0,/, "rouletteSpinActive: false,\n  wallet: 200000,");
    await route.fulfill({ status: 200, contentType: "application/javascript", body: seeded });
  });

  await page.goto("http://127.0.0.1:8003", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);

  const caps = await page.evaluate(() => {
    placeBet("straight-0", 20000);
    placeBet("straight-1", 1);
    const roulette = JSON.parse(window.render_game_to_text());
    clearBets();

    placeBlackjackBet(50000);
    placeBlackjackBet(1);
    const blackjack = JSON.parse(window.render_game_to_text()).blackjack;
    clearBlackjackBet();

    placeSlotBet(5000);
    placeSlotBet(1);
    const slots = JSON.parse(window.render_game_to_text()).slots;
    clearSlotBet();

    placeBaccaratBet("player", 10000);
    placeBaccaratBet("dealer", 10000);
    placeBaccaratBet("tie", 1);
    const baccarat = JSON.parse(window.render_game_to_text()).baccarat;
    clearBaccaratBets();

    placeRideTheBusBet(20000);
    placeRideTheBusBet(1);
    const bus = JSON.parse(window.render_game_to_text()).bus;
    clearRideTheBusBet();

    placePlinkoBet(25000);
    placePlinkoBet(1);
    const plinko = JSON.parse(window.render_game_to_text()).plinko;
    clearPlinkoBet();

    placeCrashBet(10000);
    placeCrashBet(1);
    const crash = JSON.parse(window.render_game_to_text()).crash;
    clearCrashBet();

    placeKenoBet(15000);
    placeKenoBet(1);
    const keno = JSON.parse(window.render_game_to_text()).keno;
    clearKenoBet();

    return { roulette, blackjack, slots, baccarat, bus, plinko, crash, keno };
  });

  const rouletteTotal = caps.roulette.bets.reduce((sum, bet) => sum + bet.amount, 0);
  const baccaratTotal = Object.values(caps.baccarat.bets).reduce((sum, bet) => sum + bet, 0);
  const failures = [
    ["roulette", rouletteTotal, 20000, caps.roulette.message],
    ["blackjack", caps.blackjack.wager, 50000, caps.blackjack.message],
    ["slots", caps.slots.wager, 5000, caps.slots.message],
    ["baccarat", baccaratTotal, 20000, caps.baccarat.message],
    ["bus", caps.bus.wager, 20000, caps.bus.message],
    ["plinko", caps.plinko.wager, 25000, caps.plinko.message],
    ["crash", caps.crash.wager, 10000, caps.crash.message],
    ["keno", caps.keno.wager, 15000, caps.keno.message],
  ].filter(([, actual, expected, message]) => actual !== expected || !message.startsWith("Max bet is $"));

  await browser.close();
  if (errors.length || failures.length) {
    console.error(JSON.stringify({ errors, failures, caps }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ errors: errors.length, caps: Object.keys(caps) }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
