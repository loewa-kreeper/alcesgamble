const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const CHIP_VALUES = [1, 5, 10, 25, 100];
const numberSequence = Array.from({ length: 36 }, (_, index) => index + 1);
const TABLE_ASPECT = 1790 / 887;

const state = {
  currentScreen: "menu",
  popup: null,
  pendingReveal: null,
  rouletteSpinActive: false,
  wallet: 0,
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
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    state.blackjack.message = state.blackjack.wager ? `Bet $${formatMoney(state.blackjack.wager)}` : "Place chips, then deal.";
    render();
    return;
  }

  if (action === "go-menu") {
    state.currentScreen = "menu";
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
      state.spinMessage = "Drag a chip onto the table.";
      render();
    }
    if (key === "j") {
      event.preventDefault();
      state.currentScreen = "blackjack";
      render();
    }
    return;
  }

  if (key === "escape" || key === "b") {
    event.preventDefault();
    state.currentScreen = "menu";
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

function hasSupabase() {
  return Boolean(supabaseClient);
}

function setAuthMessage(message) {
  authMessage.textContent = message;
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
  lastSavedWallet = state.wallet;
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
  if (lastSavedWallet === state.wallet) return;

  const balance = state.wallet;
  const { data, error } = await supabaseClient.rpc("save_player_wallet", {
    p_username: authState.account.username,
    p_password: authState.account.password,
    p_balance: balance,
  });

  if (error) {
    setAuthMessage(`Wallet save failed: ${error.message}`);
    return;
  }

  lastSavedWallet = Number(data);
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
    clearTimeout(pendingPopupTimer);
    pendingPopupTimer = null;
  }
  for (const timer of pendingUiTimers) {
    clearTimeout(timer);
  }
  pendingUiTimers.clear();
}

function scheduleUiTask(fn, delay) {
  const timer = window.setTimeout(() => {
    pendingUiTimers.delete(timer);
    fn();
  }, delay);
  pendingUiTimers.add(timer);
  return timer;
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
  walletBalance.textContent = `$${formatMoney(state.wallet)}`;
  renderAuthPanel();
  if (state.currentScreen === "menu") {
    appView.innerHTML = renderMenu();
  } else if (state.currentScreen === "roulette") {
    appView.innerHTML = renderRoulette();
  } else {
    appView.innerHTML = renderBlackjack();
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
        </div>
      </article>

      <aside class="side-panel surface">
        <div>
          <p class="menu-eyebrow">Casino</p>
          <h2>Two tables, one wallet</h2>
          <p class="menu-copy">Top up the wallet in the header, bounce between roulette and blackjack, and keep the same stack moving through both games.</p>
        </div>
        <div class="menu-stats">
          <div class="menu-stat">
            <p class="game-tag">Wallet</p>
            <strong>$${formatMoney(state.wallet)}</strong>
          </div>
          <div class="menu-stat">
            <p class="game-tag">Tables</p>
            <strong>2</strong>
          </div>
          <div class="menu-stat">
            <p class="game-tag">Blackjack</p>
            <strong>3:2</strong>
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
  if (state.blackjack.result) return state.blackjack.result.detail;
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
  message: state.spinMessage,
  dragActive: dragState.active,
  availableGames: ["roulette", "blackjack"],
});

window.advanceTime = () => {
  render();
};

render();
initializeAuth();
