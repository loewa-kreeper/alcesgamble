const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const CHIP_VALUES = [1, 5, 10, 25, 100];
const numberSequence = Array.from({ length: 36 }, (_, index) => index + 1);
const TABLE_ASPECT = 1790 / 887;
const XP_PER_ROUND = 20;
const FIRST_LEVEL_XP = 100;
const LEVEL_XP_MULTIPLIER = 2.5;
const SLOT_ROWS = 3;
const SLOT_COLS = 5;
const SLOT_HIGH_PATTERN_BOOST = 0.2;
const JOKU_HAND_SIZE = 5;
const JOKU_PAYOUTS = [
  { rank: "Royal Flush", reward: 150 },
  { rank: "Straight Flush", reward: 95 },
  { rank: "Four of a Kind", reward: 70 },
  { rank: "Full House", reward: 42 },
  { rank: "Flush", reward: 30 },
  { rank: "Straight", reward: 24 },
  { rank: "Three of a Kind", reward: 16 },
  { rank: "Two Pair", reward: 10 },
  { rank: "Pair", reward: 5 },
  { rank: "High Card", reward: 2 },
];
const SLOT_PATTERNS = [
  { name: "HOR", multiplier: 1, variants: buildSlotHorizontalVariants(3) },
  { name: "VERT", multiplier: 1, variants: [[[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]], [[0, 3], [1, 3], [2, 3]], [[0, 4], [1, 4], [2, 4]]] },
  { name: "DIAG", multiplier: 1, variants: [[[0, 0], [1, 1], [2, 2]], [[2, 0], [1, 1], [0, 2]], [[0, 1], [1, 2], [2, 3]], [[2, 1], [1, 2], [0, 3]], [[0, 2], [1, 3], [2, 4]], [[2, 2], [1, 3], [0, 4]]] },
  { name: "HOR-L", multiplier: 2, variants: buildSlotHorizontalVariants(4) },
  { name: "HOR-XL", multiplier: 3, variants: buildSlotHorizontalVariants(5) },
  { name: "ZIG", multiplier: 3, variants: [[[0, 0], [1, 1], [0, 2], [1, 3], [0, 4]]] },
  { name: "ZAG", multiplier: 3, variants: [[[2, 0], [1, 1], [2, 2], [1, 3], [2, 4]]] },
  { name: "ABOVE", multiplier: 4, variants: [[[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]] },
  { name: "BELOW", multiplier: 4, variants: [[[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]]] },
  { name: "EYE", multiplier: 5, variants: [[[0, 0], [0, 4], [1, 1], [1, 2], [1, 3], [2, 0], [2, 4]]] },
  { name: "JACKPOT", multiplier: 10, variants: [[[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]]] },
];
const SLOT_SYMBOLS = [
  { id: "cherry", label: "Cherry", short: "🍒", weight: 26, pays: { 3: 0.4, 4: 1.1, 5: 2.8 } },
  { id: "lemon", label: "Lemon", short: "🍋", weight: 24, pays: { 3: 0.5, 4: 1.5, 5: 3.8 } },
  { id: "clover", label: "Cloverleaf", short: "☘", weight: 20, pays: { 3: 0.8, 4: 2.2, 5: 5.4 } },
  { id: "bell", label: "Bell", short: "🔔", weight: 14, pays: { 3: 1.4, 4: 4.2, 5: 9.5 } },
  { id: "diamond", label: "Diamond", short: "💎", weight: 10, pays: { 3: 2.5, 4: 7.5, 5: 18 } },
  { id: "treasure", label: "Treasure", short: "💰", weight: 8, pays: { 3: 3.6, 4: 10.5, 5: 25 } },
  { id: "seven", label: "Seven", short: "7", weight: 4, pays: { 3: 6, 4: 18, 5: 42 } },
];

function buildSlotHorizontalVariants(length) {
  const variants = [];
  for (let row = 0; row < SLOT_ROWS; row += 1) {
    for (let col = 0; col <= SLOT_COLS - length; col += 1) {
      variants.push(Array.from({ length }, (_, offset) => [row, col + offset]));
    }
  }
  return variants;
}

const state = {
  currentScreen: "menu",
  popup: null,
  pendingReveal: null,
  rouletteSpinActive: false,
  wallet: 0,
  xp: 0,
  selectedAmount: 10,
  selectedBetId: "straight-0",
  hoverBetId: null,
  spinMessage: "Load the wallet and drag a chip.",
  bets: [],
  history: [],
  lastSpin: null,
  lastRoundTemplate: [],
  blackjack: {
    phase: "betting",
    deck: [],
    dealer: [],
    player: [],
    wager: 0,
    wagerChips: [],
    result: null,
    message: "Place chips, then deal.",
    dealerReveal: false,
    lastWager: 0,
  },
  slot: {
    phase: "betting",
    wager: 0,
    wagerChips: [],
    lastWager: 0,
    grid: createRandomSlotGrid(),
    animatingColumns: [],
    result: null,
    lastWins: [],
    message: "Place chips, then spin.",
  },
  joku: {
    phase: "ready",
    deck: [],
    hand: [],
    result: null,
    message: "Draw a free hand and collect the reward.",
  },
};

const dragState = {
  active: false,
  chipValue: 0,
  ghost: null,
};

let pendingPopupTimer = null;
const pendingUiTimers = new Set();

const betDefinitions = buildBetDefinitions();

const appView = document.getElementById("app-view");
const walletBalance = document.getElementById("wallet-balance");
const playerLevel = document.getElementById("player-level");
const playerXp = document.getElementById("player-xp");
const xpFill = document.getElementById("xp-fill");
const fundsInput = document.getElementById("funds-input");
const addFundsButton = document.getElementById("add-funds-btn");
const authForm = document.getElementById("auth-form");
const authUsername = document.getElementById("auth-username");
const authPassword = document.getElementById("auth-password");
const signupButton = document.getElementById("signup-btn");
const logoutButton = document.getElementById("logout-btn");
const authMessage = document.getElementById("auth-message");
const accountCard = document.getElementById("account-card");
const accountName = document.getElementById("account-name");

const supabaseConfig = window.ALCES_SUPABASE || {};
const supabaseClient = window.supabase && supabaseConfig.url && !supabaseConfig.url.includes("YOUR-PROJECT-REF")
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey)
  : null;

const authState = {
  account: null,
  loadingWallet: false,
  walletLoaded: false,
};

let walletSaveTimer = null;
let lastSavedWallet = null;
let lastSavedXp = null;
let virtualNow = 0;

addFundsButton.addEventListener("click", () => {
  addFundsFromInput();
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  signInWithUsername();
});

signupButton.addEventListener("click", () => {
  signUpWithUsername();
});

logoutButton.addEventListener("click", () => {
  signOut();
});

appView.addEventListener("click", (event) => {
  if (event.target.closest(".game-popup-card") && !event.target.closest("[data-action]")) {
    event.stopPropagation();
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;

  if (action === "open-roulette") {
    clearPendingPopupTimer();
    state.currentScreen = "roulette";
    scrollGameToTop();
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    state.spinMessage = "Drag a chip onto the table.";
    render();
    return;
  }

  if (action === "open-blackjack") {
    clearPendingPopupTimer();
    state.currentScreen = "blackjack";
    scrollGameToTop();
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    state.blackjack.message = state.blackjack.wager ? `Bet $${formatMoney(state.blackjack.wager)}` : "Place chips, then deal.";
    render();
    return;
  }

  if (action === "open-slots") {
    clearPendingPopupTimer();
    state.currentScreen = "slots";
    scrollGameToTop();
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    state.slot.message = state.slot.wager ? `Bet $${formatMoney(state.slot.wager)}` : "Place chips, then spin.";
    render();
    return;
  }

  if (action === "open-joku") {
    clearPendingPopupTimer();
    state.currentScreen = "joku";
    scrollGameToTop();
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    render();
    return;
  }

  if (action === "go-menu") {
    state.currentScreen = "menu";
    scrollGameToTop();
    state.hoverBetId = null;
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    clearPendingPopupTimer();
    render();
    return;
  }

  if (action === "close-popup") {
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    clearPendingPopupTimer();
    render();
    return;
  }

  if (action === "clear-bets") {
    clearBets();
    return;
  }

  if (action === "spin-wheel") {
    spinWheel();
    return;
  }

  if (action === "repeat-bets") {
    repeatBets();
    return;
  }

  if (action === "select-zone") {
    state.selectedBetId = actionTarget.dataset.betId;
    render();
    return;
  }

  if (action === "blackjack-deal") {
    startBlackjackRound();
    return;
  }

  if (action === "blackjack-hit") {
    playerHit();
    return;
  }

  if (action === "blackjack-stand") {
    playerStand();
    return;
  }

  if (action === "blackjack-double") {
    playerDouble();
    return;
  }

  if (action === "blackjack-clear") {
    clearBlackjackBet();
    return;
  }

  if (action === "blackjack-repeat") {
    repeatBlackjackBet();
    return;
  }

  if (action === "slot-spin") {
    spinSlots();
    return;
  }

  if (action === "slot-clear") {
    clearSlotBet();
    return;
  }

  if (action === "slot-repeat") {
    repeatSlotBet();
    return;
  }

  if (action === "joku-draw") {
    drawJokuHand();
    return;
  }
});

appView.addEventListener("pointerdown", (event) => {
  const chip = event.target.closest("[data-chip-value]");
  if (!chip || chip.dataset.disabled === "true") return;

  const chipValue = Number(chip.dataset.chipValue);
  if (!Number.isFinite(chipValue) || chipValue <= 0) return;

  event.preventDefault();
  startChipDrag(chipValue, event.clientX, event.clientY);
});

window.addEventListener("pointermove", (event) => {
  if (!dragState.active) return;

  moveChipGhost(event.clientX, event.clientY);
  const hoverBetId = findBetZoneAtPoint(event.clientX, event.clientY);
  if (state.hoverBetId !== hoverBetId) {
    state.hoverBetId = hoverBetId;
    render();
  }
});

window.addEventListener("pointerup", (event) => {
  if (!dragState.active) return;

  const dropBetId = findBetZoneAtPoint(event.clientX, event.clientY);
  const amount = dragState.chipValue;
  stopChipDrag();

  if (dropBetId) {
    if (state.currentScreen === "roulette") {
      placeBet(dropBetId, amount);
    } else if (state.currentScreen === "blackjack") {
      placeBlackjackBet(amount);
    } else if (state.currentScreen === "slots") {
      placeSlotBet(amount);
    }
  } else {
    render();
  }
});

window.addEventListener("pointercancel", () => {
  if (!dragState.active) return;
  stopChipDrag();
  render();
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === "f") {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
    return;
  }

  if (key === "a") {
    addFundsFromInput();
    return;
  }

  if (state.currentScreen === "menu") {
    if (key === "enter" || key === "r" || key === " ") {
      event.preventDefault();
      state.currentScreen = "roulette";
      scrollGameToTop();
      state.spinMessage = "Drag a chip onto the table.";
      render();
    }
    if (key === "j") {
      event.preventDefault();
      state.currentScreen = "blackjack";
      scrollGameToTop();
      render();
    }
    if (key === "k") {
      event.preventDefault();
      state.currentScreen = "slots";
      scrollGameToTop();
      render();
    }
    if (key === "u") {
      event.preventDefault();
      state.currentScreen = "joku";
      scrollGameToTop();
      render();
    }
    return;
  }

  if (key === "escape" || (key === "b" && state.currentScreen !== "slots")) {
    event.preventDefault();
    state.currentScreen = "menu";
    scrollGameToTop();
    render();
    return;
  }

  if (state.currentScreen === "blackjack") {
    if (key === "enter") {
      event.preventDefault();
      startBlackjackRound();
      return;
    }
    if (key === "h") {
      playerHit();
      return;
    }
    if (key === "s") {
      playerStand();
      return;
    }
    if (key === "d") {
      playerDouble();
      return;
    }
    if (key === "c") {
      clearBlackjackBet();
      return;
    }
    if (key >= "1" && key <= "5") {
      const chipIndex = Number(key) - 1;
      placeBlackjackBet(CHIP_VALUES[chipIndex]);
      return;
    }
    return;
  }

  if (state.currentScreen === "slots") {
    if (key === "enter" || key === " ") {
      event.preventDefault();
      spinSlots();
      return;
    }
    if (key === "b") {
      placeSlotBet(state.selectedAmount);
      return;
    }
    if (key === "c") {
      clearSlotBet();
      return;
    }
    if (key === "r") {
      repeatSlotBet();
      return;
    }
    if (key >= "1" && key <= "5") {
      const chipIndex = Number(key) - 1;
      placeSlotBet(CHIP_VALUES[chipIndex]);
      return;
    }
    return;
  }

  if (state.currentScreen === "joku") {
    if (key === "enter" || key === " ") {
      event.preventDefault();
      drawJokuHand();
      return;
    }
    return;
  }

  if (key === "arrowright" || key === "arrowdown") {
    event.preventDefault();
    moveSelection(1);
    return;
  }

  if (key === "arrowleft" || key === "arrowup") {
    event.preventDefault();
    moveSelection(-1);
    return;
  }

  if (key >= "1" && key <= "5") {
    const chipIndex = Number(key) - 1;
    state.selectedAmount = CHIP_VALUES[chipIndex];
    render();
    return;
  }

  if (key === "enter") {
    event.preventDefault();
    placeBet(state.selectedBetId, state.selectedAmount);
    return;
  }

  if (key === "c") {
    clearBets();
    return;
  }

  if (key === " ") {
    event.preventDefault();
    spinWheel();
    return;
  }
});

function buildBetDefinitions() {
  const geometry = {
    gridX: 39.1,
    gridY: 30.8,
    cellW: 4.42,
    cellH: 9.8,
    zeroX: 34.0,
    zeroY: 30.8,
    zeroW: 5.2,
    zeroH: 29.4,
    columnX: 92.15,
    columnW: 5.2,
    dozenY: 60.6,
    dozenH: 7.9,
    outsideY: 68.75,
    outsideH: 7.9,
  };

  const bets = [];

  bets.push(makeBet({
    id: "straight-0",
    label: "0",
    payout: 35,
    colorClass: "green",
    numbers: [0],
    rect: { x: geometry.zeroX, y: geometry.zeroY, w: geometry.zeroW, h: geometry.zeroH },
  }));

  for (let value = 1; value <= 36; value += 1) {
    const column = Math.floor((value - 1) / 3);
    const mod = value % 3;
    const row = mod === 0 ? 0 : mod === 2 ? 1 : 2;

    bets.push(makeBet({
      id: `straight-${value}`,
      label: String(value),
      payout: 35,
      colorClass: RED_NUMBERS.has(value) ? "red" : "black",
      numbers: [value],
      rect: {
        x: geometry.gridX + column * geometry.cellW,
        y: geometry.gridY + row * geometry.cellH,
        w: geometry.cellW,
        h: geometry.cellH,
      },
    }));
  }

  bets.push(...[
    makeBet({
      id: "dozen-1",
      label: "1st 12",
      payout: 2,
      colorClass: "gold",
      numbers: range(1, 12),
      rect: { x: geometry.gridX, y: geometry.dozenY, w: geometry.cellW * 4, h: geometry.dozenH },
    }),
    makeBet({
      id: "dozen-2",
      label: "2nd 12",
      payout: 2,
      colorClass: "gold",
      numbers: range(13, 24),
      rect: { x: geometry.gridX + geometry.cellW * 4, y: geometry.dozenY, w: geometry.cellW * 4, h: geometry.dozenH },
    }),
    makeBet({
      id: "dozen-3",
      label: "3rd 12",
      payout: 2,
      colorClass: "gold",
      numbers: range(25, 36),
      rect: { x: geometry.gridX + geometry.cellW * 8, y: geometry.dozenY, w: geometry.cellW * 4, h: geometry.dozenH },
    }),
    makeBet({
      id: "low",
      label: "1-18",
      payout: 1,
      colorClass: "gold",
      numbers: range(1, 18),
      rect: { x: geometry.gridX, y: geometry.outsideY, w: geometry.cellW * 2, h: geometry.outsideH },
    }),
    makeBet({
      id: "even",
      label: "Even",
      payout: 1,
      colorClass: "gold",
      numbers: numberSequence.filter((n) => n % 2 === 0),
      rect: { x: geometry.gridX + geometry.cellW * 2, y: geometry.outsideY, w: geometry.cellW * 2, h: geometry.outsideH },
    }),
    makeBet({
      id: "red",
      label: "Red",
      payout: 1,
      colorClass: "red",
      numbers: [...RED_NUMBERS],
      rect: { x: geometry.gridX + geometry.cellW * 4, y: geometry.outsideY, w: geometry.cellW * 2, h: geometry.outsideH },
    }),
    makeBet({
      id: "black",
      label: "Black",
      payout: 1,
      colorClass: "black",
      numbers: numberSequence.filter((n) => !RED_NUMBERS.has(n)),
      rect: { x: geometry.gridX + geometry.cellW * 6, y: geometry.outsideY, w: geometry.cellW * 2, h: geometry.outsideH },
    }),
    makeBet({
      id: "odd",
      label: "Odd",
      payout: 1,
      colorClass: "gold",
      numbers: numberSequence.filter((n) => n % 2 === 1),
      rect: { x: geometry.gridX + geometry.cellW * 8, y: geometry.outsideY, w: geometry.cellW * 2, h: geometry.outsideH },
    }),
    makeBet({
      id: "high",
      label: "19-36",
      payout: 1,
      colorClass: "gold",
      numbers: range(19, 36),
      rect: { x: geometry.gridX + geometry.cellW * 10, y: geometry.outsideY, w: geometry.cellW * 2, h: geometry.outsideH },
    }),
    makeBet({
      id: "column-1",
      label: "2 to 1 A",
      payout: 2,
      colorClass: "green",
      numbers: numberSequence.filter((n) => n % 3 === 1),
      rect: { x: geometry.columnX, y: geometry.gridY, w: geometry.columnW, h: geometry.cellH },
    }),
    makeBet({
      id: "column-2",
      label: "2 to 1 B",
      payout: 2,
      colorClass: "green",
      numbers: numberSequence.filter((n) => n % 3 === 2),
      rect: { x: geometry.columnX, y: geometry.gridY + geometry.cellH, w: geometry.columnW, h: geometry.cellH },
    }),
    makeBet({
      id: "column-3",
      label: "2 to 1 C",
      payout: 2,
      colorClass: "green",
      numbers: numberSequence.filter((n) => n % 3 === 0),
      rect: { x: geometry.columnX, y: geometry.gridY + geometry.cellH * 2, w: geometry.columnW, h: geometry.cellH },
    }),
  ]);

  return bets;
}

function makeBet({ id, label, payout, colorClass, numbers, rect }) {
  return {
    id,
    label,
    payout,
    colorClass,
    numbers,
    rect,
    chip: {
      x: rect.x + rect.w / 2,
      y: rect.y + rect.h / 2,
    },
  };
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function sanitizeMoney(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed * 100) / 100);
}

function formatMoney(value) {
  return value.toFixed(2);
}

function formatChipValue(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function setWallet(value, save = true) {
  state.wallet = sanitizeMoney(value);
  if (save) queueWalletSave();
}

function adjustWallet(delta) {
  setWallet(state.wallet + delta);
}

function setXp(value, save = true) {
  state.xp = Math.max(0, Math.floor(Number(value) || 0));
  if (save) queueWalletSave();
}

function awardRoundXp(gameName) {
  const beforeLevel = getLevelProgress(state.xp).level;
  setXp(state.xp + XP_PER_ROUND);
  const afterLevel = getLevelProgress(state.xp).level;
  if (afterLevel > beforeLevel) {
    state.spinMessage = `Level ${afterLevel} reached.`;
    setAuthMessage(`Level ${afterLevel} reached. +${XP_PER_ROUND} XP`);
    return;
  }
  setAuthMessage(`${gameName} round complete. +${XP_PER_ROUND} XP`);
}

function getLevelProgress(totalXp) {
  let level = 1;
  let levelStart = 0;
  let nextCost = FIRST_LEVEL_XP;
  let remaining = Math.max(0, Math.floor(totalXp));

  while (remaining >= nextCost) {
    remaining -= nextCost;
    levelStart += nextCost;
    level += 1;
    nextCost = Math.round(nextCost * LEVEL_XP_MULTIPLIER);
  }

  return {
    level,
    levelStart,
    nextLevelXp: levelStart + nextCost,
    progressXp: remaining,
    neededXp: nextCost,
    percent: Math.min(100, Math.round((remaining / nextCost) * 100)),
  };
}

function hasSupabase() {
  return Boolean(supabaseClient);
}

function setAuthMessage(message) {
  authMessage.textContent = message;
}

function scrollGameToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function renderAuthPanel() {
  const signedIn = Boolean(authState.account);
  authForm.classList.toggle("hidden", signedIn);
  accountCard.classList.toggle("hidden", !signedIn);
  addFundsButton.disabled = authState.loadingWallet;
  fundsInput.disabled = authState.loadingWallet;

  if (signedIn) {
    accountName.textContent = authState.account.username;
  }
}

async function signUpWithUsername() {
  if (!hasSupabase()) {
    setAuthMessage("Add your Supabase URL and key in supabase-config.js first.");
    return;
  }

  const credentials = getAuthCredentials();
  if (!credentials) return;

  setAuthMessage("Creating account...");
  const { data, error } = await supabaseClient.rpc("create_player_account", {
    p_username: credentials.username,
    p_password: credentials.password,
  });

  if (error) {
    setAuthMessage(error.message);
    return;
  }

  handleAccount(data && data[0], credentials.password, "Account ready. Wallet is saved.");
}

async function signInWithUsername() {
  if (!hasSupabase()) {
    setAuthMessage("Add your Supabase URL and key in supabase-config.js first.");
    return;
  }

  const credentials = getAuthCredentials();
  if (!credentials) return;

  setAuthMessage("Logging in...");
  const { data, error } = await supabaseClient.rpc("login_player_account", {
    p_username: credentials.username,
    p_password: credentials.password,
  });

  if (error) {
    setAuthMessage(error.message);
    return;
  }

  handleAccount(data && data[0], credentials.password, "Wallet loaded.");
}

async function signOut() {
  if (!hasSupabase()) return;
  await flushWalletSave();
  authState.account = null;
  authState.walletLoaded = false;
  lastSavedWallet = null;
  lastSavedXp = null;
  authPassword.value = "";
  setAuthMessage("Logged out. Wallet changes are local only.");
  render();
}

function getAuthCredentials() {
  const rawUsername = authUsername.value.trim();
  const username = normalizeUsername(rawUsername);
  const password = authPassword.value;

  if (!username || !password) {
    setAuthMessage("Enter a username and password.");
    return null;
  }

  if (username.length < 3) {
    setAuthMessage("Username must be at least 3 characters.");
    return null;
  }

  if (username !== rawUsername.toLowerCase()) {
    authUsername.value = username;
  }

  if (password.length < 6) {
    setAuthMessage("Password must be at least 6 characters.");
    return null;
  }

  return {
    username,
    password,
  };
}

function normalizeUsername(value) {
  return value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
}

async function initializeAuth() {
  if (!hasSupabase()) {
    setAuthMessage("Supabase config needed before accounts can save.");
    renderAuthPanel();
    return;
  }

  setAuthMessage("Log in or sign up to sync your wallet.");
  renderAuthPanel();
}

function handleAccount(account, password, message) {
  if (!account) {
    setAuthMessage("Wrong username or password.");
    return;
  }

  authState.account = {
    id: account.account_id,
    username: account.username,
    password,
  };
  authPassword.value = "";
  setWallet(Number(account.balance) || 0, false);
  setXp(Number(account.xp) || 0, false);
  lastSavedWallet = state.wallet;
  lastSavedXp = state.xp;
  authState.walletLoaded = true;
  authState.loadingWallet = false;
  setAuthMessage(message);
  render();
}

function queueWalletSave() {
  if (!authState.account || !authState.walletLoaded || authState.loadingWallet || !hasSupabase()) return;
  if (walletSaveTimer) clearTimeout(walletSaveTimer);
  walletSaveTimer = window.setTimeout(() => {
    walletSaveTimer = null;
    saveWallet();
  }, 450);
}

async function flushWalletSave() {
  if (walletSaveTimer) {
    clearTimeout(walletSaveTimer);
    walletSaveTimer = null;
  }
  await saveWallet();
}

async function saveWallet() {
  if (!authState.account || !authState.walletLoaded || !hasSupabase()) return;
  if (lastSavedWallet === state.wallet && lastSavedXp === state.xp) return;

  const balance = state.wallet;
  const { data, error } = await supabaseClient.rpc("save_player_wallet", {
    p_username: authState.account.username,
    p_password: authState.account.password,
    p_balance: balance,
    p_xp: state.xp,
  });

  if (error) {
    setAuthMessage(`Wallet save failed: ${error.message}`);
    return;
  }

  const saved = Array.isArray(data) ? data[0] : data;
  lastSavedWallet = saved ? Number(saved.balance) : balance;
  lastSavedXp = saved ? Number(saved.xp) : state.xp;
  setAuthMessage("Wallet synced.");
}

function getBetDefinition(id) {
  return betDefinitions.find((bet) => bet.id === id);
}

function getBetTotal(id) {
  return state.bets
    .filter((bet) => bet.betId === id)
    .reduce((sum, bet) => sum + bet.amount, 0);
}

function addFundsFromInput() {
  const amount = sanitizeMoney(fundsInput.value);
  if (amount <= 0) {
    state.spinMessage = "Enter a valid amount.";
    render();
    return;
  }

  adjustWallet(amount);
  state.spinMessage = `Wallet +$${formatMoney(amount)}`;
  state.popup = null;
  state.pendingReveal = null;
  render();
}

function clearPendingPopupTimer() {
  if (pendingPopupTimer) {
    clearTimeout(pendingPopupTimer.timer);
    pendingPopupTimer = null;
  }
  for (const task of pendingUiTimers) {
    clearTimeout(task.timer);
  }
  pendingUiTimers.clear();
}

function scheduleUiTask(fn, delay) {
  const task = {
    due: virtualNow + delay,
    fn,
    timer: null,
  };
  task.timer = window.setTimeout(() => {
    pendingUiTimers.delete(task);
    fn();
  }, delay);
  pendingUiTimers.add(task);
  return task;
}

function openPopupWithDelay(popup, delay = 900) {
  clearPendingPopupTimer();
  pendingPopupTimer = scheduleUiTask(() => {
    state.popup = popup;
    pendingPopupTimer = null;
    render();
  }, delay);
}

function moveSelection(offset) {
  const currentIndex = Math.max(0, betDefinitions.findIndex((bet) => bet.id === state.selectedBetId));
  const nextIndex = (currentIndex + offset + betDefinitions.length) % betDefinitions.length;
  state.selectedBetId = betDefinitions[nextIndex].id;
  render();
}

function placeBet(betId, amount) {
  const definition = getBetDefinition(betId);
  if (!definition) return;

  const betAmount = sanitizeMoney(amount);
  if (betAmount <= 0) {
    state.spinMessage = "Chip value must be positive.";
    render();
    return;
  }

  if (betAmount > state.wallet) {
    state.spinMessage = "Not enough in the wallet.";
    render();
    return;
  }

  adjustWallet(-betAmount);
  state.popup = null;
  state.pendingReveal = null;
  state.selectedAmount = betAmount;
  state.selectedBetId = betId;
  state.bets.push({
    betId,
    amount: betAmount,
    placedAt: Date.now(),
  });
  state.spinMessage = `${definition.label} +$${formatMoney(betAmount)}`;
  render();
}

function clearBets() {
  if (!state.bets.length) {
    state.spinMessage = "No chips on the table.";
    render();
    return;
  }

  const refund = state.bets.reduce((sum, bet) => sum + bet.amount, 0);
  adjustWallet(refund);
  state.bets = [];
  state.hoverBetId = null;
  state.spinMessage = `Returned $${formatMoney(refund)}`;
  state.popup = null;
  state.pendingReveal = null;
  render();
}

function repeatBets() {
  if (!state.lastRoundTemplate.length) {
    state.spinMessage = "Nothing to repeat.";
    render();
    return;
  }

  const total = state.lastRoundTemplate.reduce((sum, bet) => sum + bet.amount, 0);
  if (total > state.wallet) {
    state.spinMessage = "Wallet is too light for repeat.";
    render();
    return;
  }

  for (const bet of state.lastRoundTemplate) {
    adjustWallet(-bet.amount);
    state.bets.push({
      betId: bet.betId,
      amount: bet.amount,
      placedAt: Date.now(),
    });
  }

  state.spinMessage = "Round repeated.";
  render();
}

function spinWheel() {
  if (!state.bets.length) {
    state.spinMessage = "Place a chip first.";
    render();
    return;
  }

  state.lastRoundTemplate = state.bets.map((bet) => ({ betId: bet.betId, amount: bet.amount }));

  const winningNumber = Math.floor(Math.random() * 37);
  const winningColor = winningNumber === 0 ? "green" : RED_NUMBERS.has(winningNumber) ? "red" : "black";

  let payout = 0;
  const winningBets = [];

  for (const bet of state.bets) {
    const definition = getBetDefinition(bet.betId);
    if (!definition) continue;
    if (definition.numbers.includes(winningNumber)) {
      const returned = bet.amount * (definition.payout + 1);
      payout += returned;
      winningBets.push({
        label: definition.label,
        amount: bet.amount,
        payout: definition.payout,
        returned,
      });
    }
  }

  const totalStaked = state.bets.reduce((sum, bet) => sum + bet.amount, 0);
  const net = payout - totalStaked;
  adjustWallet(payout);
  awardRoundXp("Roulette");

  state.lastSpin = {
    winningNumber,
    winningColor,
    totalStaked,
    payout,
    net,
    winningBets,
  };

  state.history.unshift({
    winningNumber,
    winningColor,
    totalStaked,
    payout,
    net,
  });
  state.history = state.history.slice(0, 6);

  state.bets = [];
  state.selectedBetId = `straight-${winningNumber}`;
  state.hoverBetId = null;
  state.popup = null;
  state.rouletteSpinActive = true;
  state.pendingReveal = {
    game: "roulette",
    title: "Spinning",
    detail: "Ball is rolling...",
  };
  state.spinMessage = "Spinning...";
  render();
  openPopupWithDelay({
    tone: net > 0 ? "win" : net < 0 ? "loss" : "idle",
    title: `${winningNumber} ${winningColor.toUpperCase()}`,
    detail: net > 0 ? `Won $${formatMoney(net)}` : net < 0 ? `Lost $${formatMoney(Math.abs(net))}` : "Push",
    buttonLabel: "Keep Playing",
  }, 1100);
  scheduleUiTask(() => {
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    state.spinMessage = net >= 0
      ? `${winningNumber} ${winningColor} +$${formatMoney(net)}`
      : `${winningNumber} ${winningColor} -$${formatMoney(Math.abs(net))}`;
    render();
  }, 700);
}

function startChipDrag(chipValue, x, y) {
  dragState.active = true;
  dragState.chipValue = chipValue;
  state.selectedAmount = chipValue;
  createChipGhost(chipValue);
  moveChipGhost(x, y);
  render();
}

function stopChipDrag() {
  dragState.active = false;
  dragState.chipValue = 0;
  state.hoverBetId = null;
  if (dragState.ghost) {
    dragState.ghost.remove();
    dragState.ghost = null;
  }
}

function createChipGhost(chipValue) {
  if (dragState.ghost) dragState.ghost.remove();
  const ghost = document.createElement("div");
  ghost.className = `tray-chip drag-ghost chip-${chipClassForValue(chipValue)}`;
  ghost.textContent = `$${formatChipValue(chipValue)}`;
  document.body.appendChild(ghost);
  dragState.ghost = ghost;
}

function moveChipGhost(x, y) {
  if (!dragState.ghost) return;
  dragState.ghost.style.left = `${x}px`;
  dragState.ghost.style.top = `${y}px`;
}

function findBetZoneAtPoint(x, y) {
  const element = document.elementFromPoint(x, y);
  const zone = element && element.closest("[data-bet-zone]");
  return zone ? zone.dataset.betZone : null;
}

function chipClassForValue(value) {
  if (value >= 100) return "100";
  if (value >= 25) return "25";
  if (value >= 10) return "10";
  if (value >= 5) return "5";
  return "1";
}

function render() {
  const progress = getLevelProgress(state.xp);
  walletBalance.textContent = `$${formatMoney(state.wallet)}`;
  playerLevel.textContent = String(progress.level);
  playerXp.textContent = `${progress.progressXp} / ${progress.neededXp} XP`;
  xpFill.style.width = `${progress.percent}%`;
  renderAuthPanel();
  if (state.currentScreen === "menu") {
    appView.innerHTML = renderMenu();
  } else if (state.currentScreen === "roulette") {
    appView.innerHTML = renderRoulette();
  } else if (state.currentScreen === "blackjack") {
    appView.innerHTML = renderBlackjack();
  } else if (state.currentScreen === "slots") {
    appView.innerHTML = renderSlots();
  } else {
    appView.innerHTML = renderJoku();
  }
}

function renderMenu() {
  return `
    <section class="menu-layout">
      <article class="menu-hero surface">
        <div>
          <p class="menu-eyebrow">House floor</p>
          <h2>Pick your table and bring your stack with you.</h2>
        </div>
        <p class="menu-copy">
          Your wallet carries across the room. Load test funds up top, then jump into roulette and drag chips straight onto the table.
        </p>
        <div class="game-grid">
          <button class="game-card" data-action="open-roulette">
            <img src="roulette table.png" alt="Roulette table preview">
            <div class="game-card-copy">
              <p class="game-tag">Live now</p>
              <h3>Roulette</h3>
              <p>Sprite-based table, drag chips from the wallet tray, spin and settle the round instantly.</p>
            </div>
          </button>
          <button class="game-card" data-action="open-blackjack">
            <img src="playing cards.png" alt="Blackjack cards preview">
            <div class="game-card-copy">
              <p class="game-tag">Live now</p>
              <h3>Blackjack</h3>
              <p>Pixel table, random shuffled deck, dealer play, pushes, doubles, and 3:2 blackjacks.</p>
            </div>
          </button>
          <button class="game-card" data-action="open-slots">
            <div class="slots-menu-art">
              <div class="slots-menu-reel">☘</div>
              <div class="slots-menu-reel">🔔</div>
              <div class="slots-menu-reel">💎</div>
              <div class="slots-menu-reel">💰</div>
              <div class="slots-menu-reel">7</div>
            </div>
            <div class="game-card-copy">
              <p class="game-tag">Live now</p>
              <h3>Slots</h3>
              <p>Three rows, five reels, eleven patterns, and a paced spin that sits between feast and famine.</p>
            </div>
          </button>
          <button class="game-card" data-action="open-joku">
            <div class="joku-menu-art">
              ${["J", "O", "K", "U"].map((rank, index) => renderMenuCard(rank, index)).join("")}
            </div>
            <div class="game-card-copy">
              <p class="game-tag">Free play</p>
              <h3>JØKU</h3>
              <p>Draw five cards for free, score the hand, and add the reward straight to your wallet.</p>
            </div>
          </button>
        </div>
      </article>

      <aside class="side-panel surface">
        <div>
          <p class="menu-eyebrow">Casino</p>
          <h2>Two tables, one wallet</h2>
          <p class="menu-copy">Top up the wallet in the header, bounce between the tables, or build your stack for free in JØKU.</p>
        </div>
        <div class="menu-stats">
          <div class="menu-stat">
            <p class="game-tag">Wallet</p>
            <strong>$${formatMoney(state.wallet)}</strong>
          </div>
          <div class="menu-stat">
            <p class="game-tag">Tables</p>
            <strong>4</strong>
          </div>
          <div class="menu-stat">
            <p class="game-tag">Level</p>
            <strong>${getLevelProgress(state.xp).level}</strong>
          </div>
        </div>
        <div class="menu-note">${escapeHtml(currentMenuNote())}</div>
      </aside>
    </section>
  `;
}

function renderRoulette() {
  const lastSpin = state.lastSpin;

  return `
    <section class="roulette-screen surface">
      <div class="roulette-head">
        <button class="pill-button menu-button" data-action="go-menu">Menu</button>
        ${renderResultBoard(lastSpin)}
        <div class="status-pill muted">On table $${formatMoney(getTableTotal())}</div>
      </div>

      <div class="table-frame">
        <div class="table-asset" style="aspect-ratio:${TABLE_ASPECT}">
          <img class="table-image" src="roulette table.png" alt="Roulette table">
          <div class="roulette-wheel-window ${state.rouletteSpinActive ? "spinning" : ""}">
            <div class="roulette-ball-orbit">
              <div class="roulette-ball"></div>
            </div>
          </div>
          ${renderBetZones()}
          ${renderPlacedChips()}
          ${renderControlButtons()}
        </div>
      </div>

      <div class="wallet-tray">
        <div class="wallet-strip">
          <span class="wallet-strip-label">Wallet</span>
          <strong>$${formatMoney(state.wallet)}</strong>
        </div>
        <div class="chip-tray">
          ${CHIP_VALUES.map((value) => renderTrayChip(value)).join("")}
        </div>
      </div>
      ${renderPopup()}
    </section>
  `;
}

function renderResultBoard(lastSpin) {
  if (state.pendingReveal && state.pendingReveal.game === "roulette") {
    return `
      <div class="result-board pending">
        <div class="result-main">${escapeHtml(state.pendingReveal.title)}</div>
        <div class="result-sub">${escapeHtml(state.pendingReveal.detail)}</div>
      </div>
    `;
  }

  if (!lastSpin) {
    return `
      <div class="result-board idle">
        <div class="result-main">Ready</div>
        <div class="result-sub">${escapeHtml(state.spinMessage)}</div>
      </div>
    `;
  }

  const won = lastSpin.net >= 0;
  return `
    <div class="result-board ${won ? "win" : "loss"}">
      <div class="result-main">${lastSpin.winningNumber} ${escapeHtml(lastSpin.winningColor)}</div>
      <div class="result-sub">${won ? "Won" : "Lost"} $${formatMoney(Math.abs(lastSpin.net))}</div>
    </div>
  `;
}

function renderBlackjack() {
  const bj = state.blackjack;
  const playerTotal = handValue(bj.player).total;
  const dealerView = bj.dealerReveal ? bj.dealer : bj.dealer.map((card, index) => (index === 0 ? card : { hidden: true }));
  const dealerShown = handValue(bj.dealerReveal ? bj.dealer : bj.dealer.slice(0, 1)).total;

  return `
    <section class="blackjack-screen surface">
      <div class="roulette-head">
        <button class="pill-button menu-button" data-action="go-menu">Menu</button>
        ${renderBlackjackResult()}
        <div class="status-pill muted">Bet $${formatMoney(bj.wager)}</div>
      </div>

      <div class="blackjack-table">
        <div class="blackjack-felt">
          <div class="table-badge dealer-badge">
            <span>Dealer</span>
            <strong>${bj.dealer.length ? dealerShown : "--"}</strong>
          </div>
          <div class="table-badge player-badge">
            <span>Player</span>
            <strong>${bj.player.length ? playerTotal : "--"}</strong>
          </div>

          <div class="blackjack-hand dealer-hand">
            ${dealerView.map((card) => renderCard(card)).join("")}
          </div>

          <div class="blackjack-pot ${state.hoverBetId === "blackjack-main" ? "hover" : ""}" data-bet-zone="blackjack-main">
            <div class="blackjack-pot-label">BET</div>
            <div class="blackjack-pot-total">$${formatMoney(bj.wager)}</div>
            <div class="blackjack-pot-chips">${renderBlackjackWagerChips()}</div>
          </div>

          <div class="blackjack-hand player-hand">
            ${bj.player.map((card) => renderCard(card)).join("")}
          </div>

          <div class="blackjack-controls">
            <button class="pixel-button green" data-action="blackjack-deal" ${canDealBlackjack() ? "" : "disabled"}>Deal</button>
            <button class="pixel-button" data-action="blackjack-hit" ${bj.phase === "player-turn" ? "" : "disabled"}>Hit</button>
            <button class="pixel-button" data-action="blackjack-stand" ${bj.phase === "player-turn" ? "" : "disabled"}>Stand</button>
            <button class="pixel-button gold" data-action="blackjack-double" ${canDoubleBlackjack() ? "" : "disabled"}>Double</button>
            <button class="pixel-button red" data-action="blackjack-clear" ${bj.phase === "betting" && bj.wager ? "" : "disabled"}>Clear</button>
            <button class="pixel-button" data-action="blackjack-repeat" ${canRepeatBlackjack() ? "" : "disabled"}>Repeat</button>
          </div>
        </div>
      </div>

      <div class="wallet-tray">
        <div class="wallet-strip">
          <span class="wallet-strip-label">Wallet</span>
          <strong>$${formatMoney(state.wallet)}</strong>
        </div>
        <div class="chip-tray">
          ${CHIP_VALUES.map((value) => renderTrayChip(value)).join("")}
        </div>
      </div>
      ${renderPopup()}
    </section>
  `;
}

function renderSlots() {
  const slot = state.slot;
  return `
    <section class="slots-screen surface">
      <div class="roulette-head">
        <button class="pill-button menu-button" data-action="go-menu">Menu</button>
        ${renderSlotsResult()}
        <div class="status-pill muted">Bet $${formatMoney(slot.wager)}</div>
      </div>

      <div class="slots-cabinet">
        <div class="slots-header">
          <div class="slots-title-block">
            <span class="slots-kicker">Patterns</span>
            <strong>Lucky Pit</strong>
          </div>
          <div class="slots-lines">
            ${SLOT_PATTERNS.map((pattern) => `<span class="${slot.lastWins.some((win) => win.pattern === pattern.name) ? "active" : ""}">${escapeHtml(pattern.name)}</span>`).join("")}
          </div>
        </div>

        <div class="slots-grid ${slot.phase === "spinning" ? "spinning" : ""}">
          ${slot.grid.map((row, rowIndex) => `
            <div class="slots-row">
              ${row.map((symbolId, colIndex) => renderSlotCell(symbolId, rowIndex, colIndex)).join("")}
            </div>
          `).join("")}
        </div>

        <div class="slots-footer">
          <div class="slot-bet-pot ${state.hoverBetId === "slot-main" ? "hover" : ""}" data-bet-zone="slot-main">
            <span>Bet</span>
            <strong>$${formatMoney(slot.wager)}</strong>
            <div class="slot-bet-chips">${renderSlotWagerChips()}</div>
          </div>
          <div class="slot-controls">
            <button class="pixel-button green" data-action="slot-spin" ${canSpinSlots() ? "" : "disabled"}>Spin</button>
            <button class="pixel-button red" data-action="slot-clear" ${slot.phase === "betting" && slot.wager ? "" : "disabled"}>Clear</button>
            <button class="pixel-button gold" data-action="slot-repeat" ${canRepeatSlots() ? "" : "disabled"}>Repeat</button>
          </div>
        </div>
      </div>

      <div class="wallet-tray">
        <div class="wallet-strip">
          <span class="wallet-strip-label">Wallet</span>
          <strong>$${formatMoney(state.wallet)}</strong>
        </div>
        <div class="chip-tray">
          ${CHIP_VALUES.map((value) => renderTrayChip(value)).join("")}
        </div>
      </div>
      ${renderPopup()}
    </section>
  `;
}

function renderJoku() {
  const joku = state.joku;
  return `
    <section class="joku-screen surface">
      <div class="roulette-head">
        <button class="pill-button menu-button" data-action="go-menu">Menu</button>
        ${renderJokuResult()}
        <div class="status-pill muted">Free draw</div>
      </div>

      <div class="joku-table">
        <div class="joku-felt">
          <div class="joku-title-block">
            <span class="slots-kicker">No bet table</span>
            <strong>JØKU</strong>
          </div>

          <div class="joku-paytable">
            ${JOKU_PAYOUTS.slice(0, 6).map((payout) => `
              <div class="${joku.result && joku.result.rank === payout.rank ? "active" : ""}">
                <span>${escapeHtml(payout.rank)}</span>
                <strong>+$${formatMoney(payout.reward)}</strong>
              </div>
            `).join("")}
          </div>

          <div class="joku-hand ${joku.phase === "drawing" ? "drawing" : ""}">
            ${(joku.hand.length ? joku.hand : Array.from({ length: JOKU_HAND_SIZE }, () => ({ hidden: true }))).map((card) => renderCard(card)).join("")}
          </div>

          <div class="joku-controls">
            <button class="pixel-button green" data-action="joku-draw" ${joku.phase === "drawing" ? "disabled" : ""}>Draw</button>
          </div>
        </div>
      </div>

      <div class="wallet-tray">
        <div class="wallet-strip">
          <span class="wallet-strip-label">Wallet</span>
          <strong>$${formatMoney(state.wallet)}</strong>
        </div>
        <div class="joku-free-note">No chips leave your wallet here.</div>
      </div>
      ${renderPopup()}
    </section>
  `;
}

function renderJokuResult() {
  const joku = state.joku;
  if (state.pendingReveal && state.pendingReveal.game === "joku") {
    return `
      <div class="result-board pending">
        <div class="result-main">${escapeHtml(state.pendingReveal.title)}</div>
        <div class="result-sub">${escapeHtml(state.pendingReveal.detail)}</div>
      </div>
    `;
  }

  if (joku.result) {
    return `
      <div class="result-board win">
        <div class="result-main">${escapeHtml(joku.result.rank)}</div>
        <div class="result-sub">+$${formatMoney(joku.result.reward)}</div>
      </div>
    `;
  }

  return `
    <div class="result-board idle">
      <div class="result-main">JØKU</div>
      <div class="result-sub">${escapeHtml(joku.message)}</div>
    </div>
  `;
}

function renderSlotsResult() {
  const slot = state.slot;
  if (state.pendingReveal && state.pendingReveal.game === "slots") {
    return `
      <div class="result-board pending">
        <div class="result-main">${escapeHtml(state.pendingReveal.title)}</div>
        <div class="result-sub">${escapeHtml(state.pendingReveal.detail)}</div>
      </div>
    `;
  }

  if (slot.result) {
    const tone = slot.result.net > 0 ? "win" : slot.result.net < 0 ? "loss" : "idle";
    return `
      <div class="result-board ${tone}">
        <div class="result-main">${slot.result.net > 0 ? "Win" : slot.result.net < 0 ? "Miss" : "Push"}</div>
        <div class="result-sub">${slot.result.net > 0 ? `+$${formatMoney(slot.result.net)}` : slot.result.net < 0 ? `-$${formatMoney(Math.abs(slot.result.net))}` : "Bet returned."}</div>
      </div>
    `;
  }

  return `
    <div class="result-board idle">
      <div class="result-main">Slots</div>
      <div class="result-sub">${escapeHtml(slot.message)}</div>
    </div>
  `;
}

function renderSlotCell(symbolId, rowIndex, colIndex) {
  const symbol = slotSymbolById(symbolId);
  const spinning = state.slot.animatingColumns.includes(colIndex);
  return `
    <div class="slot-cell symbol-${symbol.id} ${spinning ? "spinning" : ""}">
      <span>${escapeHtml(symbol.short)}</span>
    </div>
  `;
}

function renderSlotWagerChips() {
  if (!state.slot.wagerChips.length) return "";
  return state.slot.wagerChips.map((value, index) => `
    <div class="placed-chip slot-chip chip-${chipClassForValue(value)}" style="left:${34 + index * 12}px;top:${26 + (index % 2) * 10}px">
      $${formatChipValue(value)}
    </div>
  `).join("");
}

function renderPopup() {
  if (!state.popup) return "";
  return `
    <div class="game-popup-backdrop" data-action="close-popup">
      <div class="game-popup game-popup-card ${state.popup.tone}">
        <div class="game-popup-title">${escapeHtml(state.popup.title)}</div>
        <div class="game-popup-detail">${escapeHtml(state.popup.detail)}</div>
        <button class="popup-button" data-action="close-popup">${escapeHtml(state.popup.buttonLabel || "Continue")}</button>
      </div>
    </div>
  `;
}

function renderBlackjackResult() {
  const bj = state.blackjack;
  if (state.pendingReveal && state.pendingReveal.game === "blackjack") {
    return `
      <div class="result-board pending">
        <div class="result-main">${escapeHtml(state.pendingReveal.title)}</div>
        <div class="result-sub">${escapeHtml(state.pendingReveal.detail)}</div>
      </div>
    `;
  }
  const tone = bj.result ? bj.result.tone : "idle";
  const title = bj.result ? bj.result.title : "Blackjack";
  const detail = bj.result ? bj.result.detail : bj.message;
  return `
    <div class="result-board ${tone}">
      <div class="result-main">${escapeHtml(title)}</div>
      <div class="result-sub">${escapeHtml(detail)}</div>
    </div>
  `;
}

function renderBlackjackWagerChips() {
  if (!state.blackjack.wagerChips.length) return "";
  return state.blackjack.wagerChips.map((value, index) => `
    <div class="placed-chip blackjack-chip chip-${chipClassForValue(value)}" style="left:${44 + index * 8}px;top:${30 + (index % 2) * 10}px">
      $${formatChipValue(value)}
    </div>
  `).join("");
}

function renderMenuCard(rank, index) {
  const cards = [
    { suit: "spades", rank: "J" },
    { suit: "hearts", rank: "Q" },
    { suit: "clubs", rank: "K" },
    { suit: "diamonds", rank: "A" },
  ];
  const card = cards[index] || cards[0];
  const { row, col } = cardSpritePosition(card);
  return `
    <div class="playing-card joku-preview-card" aria-label="${escapeAttribute(rank)}">
      <div class="card-face" style="background-position:${col * -72}px ${row * -98}px"></div>
    </div>
  `;
}

function renderCard(card) {
  if (!card || card.hidden) {
    return `<div class="playing-card card-back"><div class="card-back-inner"></div></div>`;
  }

  const { row, col } = cardSpritePosition(card);
  return `
    <div class="playing-card">
      <div class="card-face" style="background-position:${col * -72}px ${row * -98}px"></div>
    </div>
  `;
}

function currentMenuNote() {
  if (state.joku.result) return state.joku.message;
  if (state.blackjack.result) return state.blackjack.result.detail;
  if (state.slot.result) return state.slot.message;
  if (state.joku.message !== "Draw a free hand and collect the reward.") return state.joku.message;
  if (state.slot.message !== "Place chips, then spin.") return state.slot.message;
  if (state.blackjack.message !== "Place chips, then deal.") return state.blackjack.message;
  return state.spinMessage;
}

function createDeck() {
  const suits = ["diamonds", "clubs", "hearts", "spades"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const deck = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }

  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function ensureBlackjackDeck(cardsNeeded = 1) {
  if (state.blackjack.deck.length < cardsNeeded) {
    state.blackjack.deck = createDeck();
  }
}

function drawBlackjackCard() {
  ensureBlackjackDeck(1);
  return state.blackjack.deck.pop();
}

function rankValue(rank) {
  if (rank === "A") return 11;
  if (["K", "Q", "J"].includes(rank)) return 10;
  return Number(rank);
}

function handValue(hand) {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    if (!card || card.hidden) continue;
    total += rankValue(card.rank);
    if (card.rank === "A") aces += 1;
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  const soft = aces > 0;
  return { total, soft };
}

function isBlackjack(hand) {
  return hand.length === 2 && handValue(hand).total === 21;
}

function cardSpritePosition(card) {
  const suitRow = { diamonds: 0, clubs: 1, hearts: 2, spades: 3 };
  const rankColumn = { A: 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, J: 10, Q: 11, K: 12 };
  return {
    row: suitRow[card.suit],
    col: rankColumn[card.rank],
  };
}

function drawJokuHand() {
  const joku = state.joku;
  if (joku.phase === "drawing") return;

  clearPendingPopupTimer();
  state.popup = null;
  state.pendingReveal = {
    game: "joku",
    title: "Drawing",
    detail: "Cards are sliding out...",
  };
  joku.phase = "drawing";
  joku.result = null;
  joku.message = "Drawing a free hand...";
  joku.hand = Array.from({ length: JOKU_HAND_SIZE }, () => ({ hidden: true }));
  joku.deck = createDeck();
  render();

  scheduleUiTask(() => {
    joku.hand = Array.from({ length: JOKU_HAND_SIZE }, () => joku.deck.pop());
    settleJokuHand();
  }, 700);
}

function settleJokuHand() {
  const joku = state.joku;
  const result = evaluateJokuHand(joku.hand);
  adjustWallet(result.reward);
  awardRoundXp("JØKU");
  joku.phase = "ready";
  joku.result = result;
  joku.message = `${result.rank}. +$${formatMoney(result.reward)}`;
  state.pendingReveal = null;
  render();
  openPopupWithDelay({
    tone: "win",
    title: result.rank,
    detail: `Collected $${formatMoney(result.reward)} without betting.`,
    buttonLabel: "Draw Again",
  }, 300);
}

function evaluateJokuHand(hand) {
  const rankOrder = { A: 14, K: 13, Q: 12, J: 11, "10": 10, "9": 9, "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2 };
  const values = hand.map((card) => rankOrder[card.rank]).sort((a, b) => a - b);
  const suits = hand.map((card) => card.suit);
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  const groups = [...counts.values()].sort((a, b) => b - a);
  const flush = suits.every((suit) => suit === suits[0]);
  const wheel = values.join(",") === "2,3,4,5,14";
  const straight = wheel || values.every((value, index) => index === 0 || value === values[index - 1] + 1);
  const royal = flush && values.join(",") === "10,11,12,13,14";

  let rank = "High Card";
  if (royal) rank = "Royal Flush";
  else if (straight && flush) rank = "Straight Flush";
  else if (groups[0] === 4) rank = "Four of a Kind";
  else if (groups[0] === 3 && groups[1] === 2) rank = "Full House";
  else if (flush) rank = "Flush";
  else if (straight) rank = "Straight";
  else if (groups[0] === 3) rank = "Three of a Kind";
  else if (groups[0] === 2 && groups[1] === 2) rank = "Two Pair";
  else if (groups[0] === 2) rank = "Pair";

  const payout = JOKU_PAYOUTS.find((item) => item.rank === rank) || JOKU_PAYOUTS[JOKU_PAYOUTS.length - 1];
  return {
    rank,
    reward: payout.reward,
  };
}

function randomWeightedSlotSymbol() {
  const totalWeight = SLOT_SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const symbol of SLOT_SYMBOLS) {
    roll -= symbol.weight;
    if (roll <= 0) return symbol.id;
  }
  return SLOT_SYMBOLS[SLOT_SYMBOLS.length - 1].id;
}

function createRandomSlotGrid() {
  const grid = Array.from({ length: SLOT_ROWS }, () =>
    Array.from({ length: SLOT_COLS }, () => randomWeightedSlotSymbol()));
  return maybeBoostSlotHighPattern(grid);
}

function cloneSlotGrid(grid) {
  return grid.map((row) => [...row]);
}

function setSlotColumn(grid, column, values) {
  for (let row = 0; row < SLOT_ROWS; row += 1) {
    grid[row][column] = values[row];
  }
}

function randomSlotColumn() {
  return Array.from({ length: SLOT_ROWS }, () => randomWeightedSlotSymbol());
}

function maybeBoostSlotHighPattern(grid) {
  const hasHighPattern = evaluateSlotGrid(grid, 1).wins.some((win) => win.multiplier > 1);
  if (hasHighPattern || Math.random() >= SLOT_HIGH_PATTERN_BOOST) return grid;

  const boostedGrid = cloneSlotGrid(grid);
  const highPatterns = SLOT_PATTERNS.filter((pattern) => pattern.multiplier > 1);
  const pattern = randomArrayItem(highPatterns);
  const cells = randomArrayItem(pattern.variants);
  const symbolId = randomWeightedSlotSymbol();
  for (const [row, col] of cells) {
    boostedGrid[row][col] = symbolId;
  }
  return boostedGrid;
}

function randomArrayItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function slotSymbolById(id) {
  return SLOT_SYMBOLS.find((symbol) => symbol.id === id);
}

function evaluateSlotGrid(grid, wager) {
  const wins = [];
  let payout = 0;

  for (const pattern of SLOT_PATTERNS) {
    const match = findSlotPatternMatch(grid, pattern);
    if (match) {
      const returned = Math.round(wager * pattern.multiplier * 100) / 100;
      payout += returned;
      wins.push({
        pattern: pattern.name,
        symbol: match.symbol.label,
        count: match.count,
        multiplier: pattern.multiplier,
        returned,
      });
    }
  }

  payout = Math.round(payout * 100) / 100;
  return { payout, wins };
}

function findSlotPatternMatch(grid, pattern) {
  for (const cells of pattern.variants) {
    const firstId = grid[cells[0][0]][cells[0][1]];
    if (cells.every(([row, col]) => grid[row][col] === firstId)) {
      return {
        symbol: slotSymbolById(firstId),
        count: cells.length,
      };
    }
  }
  return null;
}

function resetBlackjackTable() {
  const bj = state.blackjack;
  bj.dealer = [];
  bj.player = [];
  bj.dealerReveal = false;
  bj.result = null;
}

function placeBlackjackBet(amount) {
  const bj = state.blackjack;
  if (!["betting", "round-over"].includes(bj.phase)) {
    bj.message = "Finish the hand first.";
    render();
    return;
  }

  const chip = sanitizeMoney(amount);
  if (chip <= 0) return;
  if (chip > state.wallet) {
    bj.message = "Not enough in the wallet.";
    render();
    return;
  }

  adjustWallet(-chip);
  bj.phase = "betting";
  bj.wager += chip;
  bj.wagerChips.push(chip);
  bj.message = `Bet $${formatMoney(bj.wager)}`;
  bj.result = null;
  state.pendingReveal = null;
  state.popup = null;
  state.selectedAmount = chip;
  render();
}

function clearBlackjackBet() {
  const bj = state.blackjack;
  if (!["betting", "round-over"].includes(bj.phase) || !bj.wager) return;
  adjustWallet(bj.wager);
  bj.wager = 0;
  bj.wagerChips = [];
  bj.phase = "betting";
  bj.message = "Bet cleared.";
  state.pendingReveal = null;
  state.popup = null;
  render();
}

function repeatBlackjackBet() {
  const bj = state.blackjack;
  if (!["betting", "round-over"].includes(bj.phase) || !bj.lastWager) return;
  if (bj.lastWager > state.wallet) {
    bj.message = "Wallet is too light for repeat.";
    render();
    return;
  }

  adjustWallet(-bj.lastWager);
  bj.phase = "betting";
  bj.wager = bj.lastWager;
  bj.wagerChips = buildChipListForAmount(bj.lastWager);
  bj.message = `Bet $${formatMoney(bj.wager)}`;
  bj.result = null;
  state.pendingReveal = null;
  state.popup = null;
  render();
}

function canDealBlackjack() {
  const bj = state.blackjack;
  return (bj.phase === "betting" || bj.phase === "round-over") && bj.wager > 0;
}

function canDoubleBlackjack() {
  const bj = state.blackjack;
  return bj.phase === "player-turn" && bj.player.length === 2 && state.wallet >= bj.wager;
}

function canRepeatBlackjack() {
  const bj = state.blackjack;
  return bj.phase === "betting" && bj.lastWager > 0;
}

function canSpinSlots() {
  const slot = state.slot;
  return slot.phase === "betting" && slot.wager > 0;
}

function canRepeatSlots() {
  const slot = state.slot;
  return slot.phase === "betting" && slot.lastWager > 0;
}

function buildChipListForAmount(amount) {
  let remaining = amount;
  const chips = [];
  const descending = [...CHIP_VALUES].sort((a, b) => b - a);
  for (const chip of descending) {
    while (remaining >= chip - 0.001) {
      chips.push(chip);
      remaining = Math.round((remaining - chip) * 100) / 100;
    }
  }
  return chips.reverse();
}

function placeSlotBet(amount) {
  const slot = state.slot;
  if (slot.phase !== "betting") {
    slot.message = "Wait for the reels to settle.";
    render();
    return;
  }

  const chip = sanitizeMoney(amount);
  if (chip <= 0) return;
  if (chip > state.wallet) {
    slot.message = "Not enough in the wallet.";
    render();
    return;
  }

  adjustWallet(-chip);
  slot.wager += chip;
  slot.wagerChips.push(chip);
  slot.result = null;
  slot.message = `Bet $${formatMoney(slot.wager)}`;
  state.pendingReveal = null;
  state.popup = null;
  state.selectedAmount = chip;
  render();
}

function clearSlotBet() {
  const slot = state.slot;
  if (slot.phase !== "betting" || !slot.wager) return;
  adjustWallet(slot.wager);
  slot.wager = 0;
  slot.wagerChips = [];
  slot.lastWins = [];
  slot.message = "Bet cleared.";
  state.pendingReveal = null;
  state.popup = null;
  render();
}

function repeatSlotBet() {
  const slot = state.slot;
  if (slot.phase !== "betting" || !slot.lastWager) return;
  if (slot.lastWager > state.wallet) {
    slot.message = "Wallet is too light for repeat.";
    render();
    return;
  }

  adjustWallet(-slot.lastWager);
  slot.wager = slot.lastWager;
  slot.wagerChips = buildChipListForAmount(slot.lastWager);
  slot.lastWins = [];
  slot.result = null;
  slot.message = `Bet $${formatMoney(slot.wager)}`;
  state.pendingReveal = null;
  state.popup = null;
  render();
}

function spinSlots() {
  const slot = state.slot;
  if (!canSpinSlots()) {
    slot.message = "Place chips, then spin.";
    render();
    return;
  }

  clearPendingPopupTimer();
  state.popup = null;
  state.pendingReveal = {
    game: "slots",
    title: "Spinning",
    detail: "Reels are rolling...",
  };
  slot.phase = "spinning";
  slot.result = null;
  slot.lastWins = [];
  slot.lastWager = slot.wager;

  const finalGrid = createRandomSlotGrid();
  slot.animatingColumns = [0, 1, 2, 3, 4];
  render();

  for (let col = 0; col < SLOT_COLS; col += 1) {
    animateSlotColumn(col, finalGrid, 0, 7 + col * 2);
  }
}

function animateSlotColumn(column, finalGrid, step, maxSteps) {
  const slot = state.slot;
  if (slot.phase !== "spinning") return;

  const nextGrid = cloneSlotGrid(slot.grid);
  setSlotColumn(nextGrid, column, step >= maxSteps ? [finalGrid[0][column], finalGrid[1][column], finalGrid[2][column]] : randomSlotColumn());
  slot.grid = nextGrid;

  if (step >= maxSteps) {
    slot.animatingColumns = slot.animatingColumns.filter((value) => value !== column);
    render();

    if (!slot.animatingColumns.length) {
      finishSlotSpin(finalGrid);
    }
    return;
  }

  render();
  scheduleUiTask(() => {
    animateSlotColumn(column, finalGrid, step + 1, maxSteps);
  }, 90 + column * 18);
}

function finishSlotSpin(finalGrid) {
  const slot = state.slot;
  slot.grid = finalGrid;
  slot.phase = "betting";
  slot.animatingColumns = [];

  const { payout, wins } = evaluateSlotGrid(finalGrid, slot.wager);
  const wager = slot.wager;
  const net = Math.round((payout - wager) * 100) / 100;
  if (payout > 0) adjustWallet(payout);
  awardRoundXp("Slots");

  slot.result = {
    payout,
    net,
    wins,
  };
  slot.lastWins = wins;
  slot.message = net > 0 ? `Won $${formatMoney(net)}` : net < 0 ? `Lost $${formatMoney(Math.abs(net))}` : "Push";
  slot.wager = 0;
  slot.wagerChips = [];
  state.pendingReveal = null;
  render();

  const popupTitle = net > 0 ? (wins.length > 1 ? "Big Win" : "Win") : net < 0 ? "No Hit" : "Push";
  const popupDetail = net > 0
    ? `Won $${formatMoney(net)} on ${wins.length} pattern${wins.length === 1 ? "" : "s"}`
    : net < 0
      ? `Lost $${formatMoney(Math.abs(net))}`
      : "Bet returned.";
  openPopupWithDelay({
    tone: net > 0 ? "win" : net < 0 ? "loss" : "idle",
    title: popupTitle,
    detail: popupDetail,
    buttonLabel: "Spin Again",
  }, 350);
}

function startBlackjackRound() {
  const bj = state.blackjack;
  if (!canDealBlackjack()) return;

  clearPendingPopupTimer();
  state.popup = null;
  state.pendingReveal = null;
  resetBlackjackTable();
  bj.phase = "player-turn";
  bj.lastWager = bj.wager;
  ensureBlackjackDeck(10);

  bj.player.push(drawBlackjackCard(), drawBlackjackCard());
  bj.dealer.push(drawBlackjackCard(), drawBlackjackCard());

  resolveBlackjackNaturals();
  if (bj.phase === "player-turn") {
    bj.message = "Hit, stand, or double.";
  }
  render();
}

function resolveBlackjackNaturals() {
  const bj = state.blackjack;
  const playerBJ = isBlackjack(bj.player);
  const dealerBJ = isBlackjack(bj.dealer);

  if (!playerBJ && !dealerBJ) return;

  bj.dealerReveal = true;
  if (playerBJ && dealerBJ) {
    payoutBlackjackRound("Push", "Push on blackjacks.", bj.wager, 0, "idle");
  } else if (playerBJ) {
    const profit = Math.round(bj.wager * 1.5 * 100) / 100;
    payoutBlackjackRound("Blackjack", `Won $${formatMoney(profit)}`, bj.wager + profit, profit, "win");
  } else {
    payoutBlackjackRound("Dealer Blackjack", `Lost $${formatMoney(bj.wager)}`, 0, -bj.wager, "loss");
  }
}

function playerHit() {
  const bj = state.blackjack;
  if (bj.phase !== "player-turn") return;
  bj.player.push(drawBlackjackCard());
  const total = handValue(bj.player).total;
  if (total > 21) {
    bj.dealerReveal = true;
    payoutBlackjackRound("Bust", `Lost $${formatMoney(bj.wager)}`, 0, -bj.wager, "loss", 850);
  } else {
    bj.message = total === 21 ? "21. Stand or wait." : "Hit, stand, or double.";
    render();
  }
}

function playerStand() {
  const bj = state.blackjack;
  if (bj.phase !== "player-turn") return;
  bj.phase = "dealer-turn";
  state.popup = null;
  state.pendingReveal = {
    game: "blackjack",
    title: "Dealer Turn",
    detail: "Dealer reveals the hole card...",
  };
  render();
  scheduleUiTask(() => {
    bj.dealerReveal = true;
    render();
    scheduleDealerDrawStep();
  }, 500);
}

function playerDouble() {
  const bj = state.blackjack;
  if (!canDoubleBlackjack()) return;
  adjustWallet(-bj.wager);
  bj.wager *= 2;
  bj.wagerChips = [...bj.wagerChips, ...bj.wagerChips];
  bj.player.push(drawBlackjackCard());
  const total = handValue(bj.player).total;
  if (total > 21) {
    bj.dealerReveal = true;
    payoutBlackjackRound("Bust", `Lost $${formatMoney(bj.wager)}`, 0, -bj.wager, "loss", 850);
    return;
  }
  playerStand();
}

function resolveDealerOutcome() {
  const bj = state.blackjack;
  const dealerTotal = handValue(bj.dealer).total;
  const playerTotal = handValue(bj.player).total;

  if (dealerTotal > 21) {
    payoutBlackjackRound("Dealer Bust", `Won $${formatMoney(bj.wager)}`, bj.wager * 2, bj.wager, "win");
    return;
  }

  if (playerTotal > dealerTotal) {
    payoutBlackjackRound("Player Wins", `Won $${formatMoney(bj.wager)}`, bj.wager * 2, bj.wager, "win");
    return;
  }

  if (playerTotal < dealerTotal) {
    payoutBlackjackRound("Dealer Wins", `Lost $${formatMoney(bj.wager)}`, 0, -bj.wager, "loss");
    return;
  }

  payoutBlackjackRound("Push", "Bet returned.", bj.wager, 0, "idle");
}

function shouldDealerHit() {
  const dealerValue = handValue(state.blackjack.dealer);
  if (dealerValue.total < 17) return true;
  if (dealerValue.total === 17 && dealerValue.soft) return true;
  return false;
}

function scheduleDealerDrawStep() {
  const bj = state.blackjack;
  if (bj.phase !== "dealer-turn") return;

  if (!shouldDealerHit()) {
    state.pendingReveal = null;
    resolveDealerOutcome();
    return;
  }

  state.pendingReveal = {
    game: "blackjack",
    title: "Dealer Turn",
    detail: "Dealer draws...",
  };
  render();

  scheduleUiTask(() => {
    bj.dealer.push(drawBlackjackCard());
    render();
    scheduleUiTask(() => {
      scheduleDealerDrawStep();
    }, 500);
  }, 650);
}

function payoutBlackjackRound(title, detail, returnedAmount, net, tone, delay = 1000) {
  const bj = state.blackjack;
  if (returnedAmount > 0) adjustWallet(returnedAmount);
  awardRoundXp("Blackjack");
  bj.phase = "betting";
  bj.dealerReveal = true;
  bj.result = { title, detail, tone };
  bj.message = detail;
  bj.wager = 0;
  bj.wagerChips = [];
  state.popup = null;
  state.pendingReveal = {
    game: "blackjack",
    title: "Resolving",
    detail: "Dealer settles the hand...",
  };
  render();
  openPopupWithDelay({
    tone,
    title,
    detail,
    buttonLabel: "Next Hand",
  }, delay);
}

function renderBetZones() {
  return betDefinitions.map((bet) => {
    const isSelected = state.selectedBetId === bet.id;
    const isHover = state.hoverBetId === bet.id;
    const classes = ["bet-zone"];
    if (isSelected) classes.push("selected");
    if (isHover) classes.push("hover");
    return `
      <button
        class="${classes.join(" ")}"
        data-action="select-zone"
        data-bet-id="${bet.id}"
        data-bet-zone="${bet.id}"
        aria-label="${escapeAttribute(bet.label)}"
        style="left:${bet.rect.x}%;top:${bet.rect.y}%;width:${bet.rect.w}%;height:${bet.rect.h}%"
      ></button>
    `;
  }).join("");
}

function renderPlacedChips() {
  const grouped = new Map();
  for (const bet of state.bets) {
    grouped.set(bet.betId, (grouped.get(bet.betId) || 0) + bet.amount);
  }

  return [...grouped.entries()].map(([betId, amount]) => {
    const bet = getBetDefinition(betId);
    const chipClass = chipClassForValue(amount);
    return `
      <div
        class="placed-chip chip-${chipClass}"
        style="left:${bet.chip.x}%;top:${bet.chip.y}%"
        title="${escapeAttribute(`${bet.label}: $${formatMoney(amount)}`)}"
      >
        $${formatChipValue(amount)}
      </div>
    `;
  }).join("");
}

function renderControlButtons() {
  return `
    <button class="sprite-hit clear-hit" data-action="clear-bets" aria-label="Clear bets"></button>
    <button class="sprite-hit repeat-hit" data-action="repeat-bets" aria-label="Repeat last round"></button>
    <button class="sprite-hit spin-hit" data-action="spin-wheel" aria-label="Spin roulette"></button>
  `;
}

function renderTrayChip(value) {
  const disabled = state.wallet < value;
  const active = state.selectedAmount === value;
  return `
    <button
      class="tray-chip chip-${chipClassForValue(value)} ${active ? "active" : ""}"
      data-chip-value="${value}"
      data-disabled="${disabled ? "true" : "false"}"
      ${disabled ? "disabled" : ""}
    >
      $${formatChipValue(value)}
    </button>
  `;
}

function getTableTotal() {
  return state.bets.reduce((sum, bet) => sum + bet.amount, 0);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

window.render_game_to_text = () => JSON.stringify({
  screen: state.currentScreen,
  wallet: state.wallet,
  xp: state.xp,
  level: getLevelProgress(state.xp).level,
  selectedAmount: state.selectedAmount,
  selectedBetId: state.selectedBetId,
  hoverBetId: state.hoverBetId,
  bets: state.bets,
  lastSpin: state.lastSpin,
  blackjack: {
    phase: state.blackjack.phase,
    wager: state.blackjack.wager,
    dealer: state.blackjack.dealerReveal ? state.blackjack.dealer : state.blackjack.dealer.map((card, index) => (index === 0 ? card : { hidden: true })),
    player: state.blackjack.player,
    result: state.blackjack.result,
    message: state.blackjack.message,
  },
  slots: {
    phase: state.slot.phase,
    wager: state.slot.wager,
    grid: state.slot.grid,
    result: state.slot.result,
    message: state.slot.message,
    animatingColumns: state.slot.animatingColumns,
  },
  joku: {
    phase: state.joku.phase,
    hand: state.joku.hand,
    result: state.joku.result,
    message: state.joku.message,
    canLoseMoney: false,
  },
  message: state.spinMessage,
  dragActive: dragState.active,
  availableGames: ["roulette", "blackjack", "slots", "joku"],
});

window.advanceTime = (ms = 0) => {
  virtualNow += Math.max(0, Number(ms) || 0);
  let ranTask = true;
  while (ranTask) {
    ranTask = false;
    const dueTasks = [...pendingUiTimers]
      .filter((task) => task.due <= virtualNow)
      .sort((a, b) => a.due - b.due);
    for (const task of dueTasks) {
      if (!pendingUiTimers.has(task)) continue;
      clearTimeout(task.timer);
      pendingUiTimers.delete(task);
      task.fn();
      ranTask = true;
    }
  }
  render();
};

render();
initializeAuth();
