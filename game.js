const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const CHIP_VALUES = [1, 5, 10, 25, 100, 500];
const numberSequence = Array.from({ length: 36 }, (_, index) => index + 1);
const TABLE_ASPECT = 1790 / 887;
const XP_PER_ROUND = 20;
const FIRST_LEVEL_XP = 100;
const LEVEL_XP_MULTIPLIER = 2.5;
const LEADERBOARD_PREVIEW_COUNT = 3;
const SLOT_ROWS = 3;
const SLOT_COLS = 5;
const SLOT_HIGH_PATTERN_BOOST = 0.08;
const JOKU_HAND_SIZE = 5;
const JOKU_TOTAL_CARDS = 50;
const JOKU_GRID_SIZE = 25;
const JOKU_HAND_MULTIPLIER = 0.5;
const JOKU_PAYOUTS = [
  { rank: "Royal Flush", reward: 200, points: 500 },
  { rank: "Straight Flush", reward: 130, points: 320 },
  { rank: "Four of a Kind", reward: 100, points: 220 },
  { rank: "Full House", reward: 75, points: 150 },
  { rank: "Flush", reward: 60, points: 120 },
  { rank: "Straight", reward: 40, points: 90 },
  { rank: "Three of a Kind", reward: 20, points: 50 },
  { rank: "Two Pair", reward: 15, points: 35 },
  { rank: "Pair", reward: 10, points: 20 },
  { rank: "High Card", reward: 5, points: 8 },
];
const BACCARAT_TIE_PAYOUT = 8;
const PLINKO_ROWS = 16;
const PLINKO_MULTIPLIERS = [10, 5, 3, 2, 1, 0.8, 0.5, 0.2, 0, 0.2, 0.5, 0.8, 1, 2, 3, 5, 10];
const CRASH_GROWTH_PER_TICK = 0.035;
const CRASH_TICK_MS = 120;
const CRASH_HOUSE_RETURN = 0.94;
const MIN_CRASH_POINT = 1.35;
const MINESWEEPER_ROWS = 9;
const MINESWEEPER_COLS = 9;
const MINESWEEPER_MINES = 10;
const MINESWEEPER_POINT_VALUE = 1;
const RIDE_BUS_STEPS = [
  { id: "red-black", label: "Red or Black", detail: "Guess the next card color.", multiplier: 1.5 },
  { id: "higher-lower", label: "Higher or Lower", detail: "Beat the last card.", multiplier: 2.5 },
  { id: "inside-outside", label: "Inside or Outside", detail: "Guess whether it falls inside the range.", multiplier: 5 },
  { id: "suit", label: "Suit", detail: "Call the suit to ride the bus.", multiplier: 12 },
];
const SLOT_PATTERNS = [
  { name: "HOR", multiplier: 1, variants: buildSlotHorizontalVariants(3) },
  { name: "VERT", multiplier: 1, variants: [[[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]], [[0, 3], [1, 3], [2, 3]], [[0, 4], [1, 4], [2, 4]]] },
  { name: "DIAG", multiplier: 1, variants: [[[0, 0], [1, 1], [2, 2]], [[2, 0], [1, 1], [0, 2]], [[0, 1], [1, 2], [2, 3]], [[2, 1], [1, 2], [0, 3]], [[0, 2], [1, 3], [2, 4]], [[2, 2], [1, 3], [0, 4]]] },
  { name: "HOR-L", multiplier: 2, variants: buildSlotHorizontalVariants(4) },
  { name: "HOR-XL", multiplier: 3, variants: buildSlotHorizontalVariants(5) },
  { name: "ZIG", multiplier: 3, variants: [[[0, 0], [1, 1], [0, 2], [1, 3], [0, 4]]] },
  { name: "ZAG", multiplier: 3, variants: [[[2, 0], [1, 1], [2, 2], [1, 3], [2, 4]]] },
  { name: "ABOVE", multiplier: 4, variants: [[[0, 2], [1, 1], [1, 2], [1, 3], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]]] },
  { name: "BELOW", multiplier: 4, variants: [[[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 1], [1, 2], [1, 3], [2, 2]]] },
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
  baccarat: {
    phase: "betting",
    deck: [],
    playerHand: [],
    dealerHand: [],
    revealedPlayerCards: 0,
    revealedDealerCards: 0,
    lastRevealedSide: null,
    lastRevealedIndex: -1,
    bets: { player: 0, dealer: 0, tie: 0 },
    betChips: { player: [], dealer: [], tie: [] },
    selectedBet: "player",
    result: null,
    message: "Pick player, dealer, or tie.",
  },
  joku: {
    phase: "ready",
    deck: [],
    grid: [],
    selectedIndices: [],
    newIndices: [],
    newCardIndices: [],
    fallDistances: {},
    result: null,
    score: 0,
    cashOut: 0,
    comboCount: 0,
    cardsRemaining: 0,
    endReason: null,
    message: "Select 5 cards to form a hand.",
  },
  bus: {
    phase: "betting",
    deck: [],
    wager: 0,
    wagerChips: [],
    step: 0,
    pendingCard: null,
    cards: [],
    result: null,
    message: "Place a wager and ride the bus.",
  },
  plinko: {
    phase: "betting",
    wager: 0,
    wagerChips: [],
    lastWager: 0,
    path: [],
    currentRow: -1,
    currentSlot: 8,
    visualRow: -1,
    visualSlot: 8,
    ballSpin: 0,
    result: null,
    message: "Place chips, then drop.",
  },
  crash: {
    phase: "betting",
    wager: 0,
    wagerChips: [],
    lastWager: 0,
    multiplier: 0,
    crashPoint: 0,
    cashedOutAt: 0,
    result: null,
    message: "Place a wager and launch.",
  },
  minesweeper: {
    phase: "playing",
    board: [],
    revealed: [],
    flagged: [],
    firstMove: true,
    mineCount: MINESWEEPER_MINES,
    flagsLeft: MINESWEEPER_MINES,
    points: 0,
    cashOut: 0,
    result: null,
    message: "Clear the board without hitting a mine.",
  },
  yahtzee: {
    phase: "ready", // ready, rolling, scorecard
    dice: [1, 1, 1, 1, 1],
    kept: [false, false, false, false, false],
    rollsLeft: 3,
    scores: {
      ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null,
      threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null,
      yahtzee: null, chance: null
    },
    message: "Roll the dice to start!",
    bonus: 0,
    total: 0
  }
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
const authForm = document.getElementById("auth-form");
const authUsername = document.getElementById("auth-username");
const authPassword = document.getElementById("auth-password");
const signupButton = document.getElementById("signup-btn");
const logoutButton = document.getElementById("logout-btn");
const settingsButton = document.getElementById("settings-btn");
const authMessage = document.getElementById("auth-message");
const accountCard = document.getElementById("account-card");
const accountName = document.getElementById("account-name");
const accountVisibility = document.getElementById("account-visibility");

const supabaseConfig = window.ALCES_SUPABASE || {};
const supabaseClient = window.supabase && supabaseConfig.url && !supabaseConfig.url.includes("YOUR-PROJECT-REF")
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey)
  : null;

const authState = {
  account: null,
  loadingWallet: false,
  walletLoaded: false,
};

const leaderboardState = {
  entries: [],
  loading: false,
  loaded: false,
  error: "",
};

const menuState = {
  settingsOpen: false,
  showAllBalance: false,
  showAllXp: false,
};

let walletSaveTimer = null;
let lastSavedWallet = null;
let lastSavedXp = null;
let virtualNow = 0;

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

settingsButton.addEventListener("click", () => {
  if (!authState.account) return;
  menuState.settingsOpen = true;
  render();
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
    resetBlackjackForNewTable(true);
    state.currentScreen = "blackjack";
    scrollGameToTop();
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
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

  if (action === "open-baccarat") {
    clearPendingPopupTimer();
    resetBaccaratForNewTable(true);
    state.currentScreen = "baccarat";
    scrollGameToTop();
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    if (!state.baccarat.deck.length) initBaccarat();
    render();
    return;
  }

  if (action === "open-bus") {
    clearPendingPopupTimer();
    state.currentScreen = "bus";
    scrollGameToTop();
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    if (!state.bus.deck.length) initRideTheBus();
    render();
    return;
  }

  if (action === "open-plinko") {
    clearPendingPopupTimer();
    state.currentScreen = "plinko";
    scrollGameToTop();
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    state.plinko.message = state.plinko.wager ? `Bet $${formatMoney(state.plinko.wager)}` : "Place chips, then drop.";
    render();
    return;
  }

  if (action === "open-crash") {
    clearPendingPopupTimer();
    state.currentScreen = "crash";
    scrollGameToTop();
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    state.crash.message = state.crash.wager ? `Bet $${formatMoney(state.crash.wager)}` : "Place a wager and launch.";
    render();
    return;
  }

  if (action === "open-minesweeper") {
    clearPendingPopupTimer();
    resetMinesweeper();
    state.currentScreen = "minesweeper";
    scrollGameToTop();
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
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
    if (!state.joku.grid.length) initJokuGrid();
    render();
    return;
  }
  if (action === "open-yahtzee") {
    clearPendingPopupTimer();
    resetYahtzeeForNewGame();
    state.currentScreen = "yahtzee";
    scrollGameToTop();
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    render();
    return;
  }

  if (action === "go-menu") {
    resetCurrentTableForExit();
    state.currentScreen = "menu";
    scrollGameToTop();
    state.hoverBetId = null;
    state.popup = null;
    state.pendingReveal = null;
    state.rouletteSpinActive = false;
    clearPendingPopupTimer();
    refreshLeaderboards(true);
    render();
    return;
  }

  if (action === "open-settings") {
    if (!authState.account) {
      setAuthMessage("Log in to manage settings.");
      return;
    }
    menuState.settingsOpen = true;
    render();
    return;
  }

  if (action === "close-settings") {
    menuState.settingsOpen = false;
    render();
    return;
  }

  if (action === "toggle-leaderboard") {
    const board = actionTarget.dataset.board;
    if (board === "balance") {
      menuState.showAllBalance = !menuState.showAllBalance;
    } else if (board === "xp") {
      menuState.showAllXp = !menuState.showAllXp;
    }
    render();
    return;
  }

  if (action === "refresh-leaderboards") {
    refreshLeaderboards(true);
    return;
  }

  if (action === "save-settings") {
    updateAccountSettings();
    return;
  }

  if (action === "delete-account") {
    deleteAccount();
    return;
  }

  if (action === "close-popup") {
    resetCurrentTableAfterPopup();
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

  if (action === "baccarat-deal") {
    dealBaccaratRound();
    return;
  }

  if (action === "baccarat-clear") {
    clearBaccaratBets();
    return;
  }

  if (action === "baccarat-repeat") {
    repeatBaccaratBets();
    return;
  }

  if (action === "baccarat-place") {
    placeBaccaratBet(actionTarget.dataset.side, state.selectedAmount);
    return;
  }

  if (action === "bus-play") {
    startRideTheBus();
    return;
  }

  if (action === "bus-bet") {
    placeRideTheBusBet(state.selectedAmount);
    return;
  }

  if (action === "bus-clear") {
    clearRideTheBusBet();
    return;
  }

  if (action === "bus-cashout") {
    cashOutRideTheBus();
    return;
  }

  if (action === "bus-guess") {
    answerRideTheBusGuess(actionTarget.dataset.guess);
    return;
  }

  if (action === "plinko-drop") {
    dropPlinkoBall();
    return;
  }

  if (action === "plinko-bet") {
    placePlinkoBet(state.selectedAmount);
    return;
  }

  if (action === "plinko-clear") {
    clearPlinkoBet();
    return;
  }

  if (action === "plinko-repeat") {
    repeatPlinkoBet();
    return;
  }

  if (action === "crash-start") {
    startCrashRound();
    return;
  }

  if (action === "crash-bet") {
    placeCrashBet(state.selectedAmount);
    return;
  }

  if (action === "crash-clear") {
    clearCrashBet();
    return;
  }

  if (action === "crash-repeat") {
    repeatCrashBet();
    return;
  }

  if (action === "crash-cashout") {
    cashOutCrash();
    return;
  }

  if (action === "minesweeper-reveal") {
    revealMinesweeperCell(Number(actionTarget.dataset.index));
    return;
  }

  if (action === "minesweeper-flag") {
    toggleMinesweeperFlag(Number(actionTarget.dataset.index));
    return;
  }

  if (action === "minesweeper-cashout") {
    cashOutMinesweeper();
    return;
  }

  if (action === "minesweeper-new") {
    resetMinesweeper();
    return;
  }

  if (action === "joku-select") {
    toggleJokuCard(Number(actionTarget.dataset.index));
    return;
  }
  if (action === "joku-play") {
    playJokuHand();
    return;
  }
  if (action === "joku-cashout") {
    cashOutJoku();
    return;
  }
  if (action === "joku-reset") {
    resetJokuGame();
    return;
  }
  if (action === "yahtzee-roll") {
    rollYahtzeeDice();
    return;
  }
  if (action === "yahtzee-toggle-die") {
    toggleYahtzeeDie(Number(actionTarget.dataset.index));
    return;
  }
  if (action === "yahtzee-score-category") {
    scoreYahtzeeCategory(actionTarget.dataset.category);
    return;
  }
});

appView.addEventListener("pointerdown", (event) => {
  const crashCashOut = event.target.closest('[data-action="crash-cashout"]');
  if (crashCashOut && state.currentScreen === "crash" && state.crash.phase === "flying") {
    event.preventDefault();
    cashOutCrash();
    return;
  }

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
    } else if (state.currentScreen === "baccarat") {
      placeBaccaratBet(dropBetId, amount);
    } else if (state.currentScreen === "bus") {
      placeRideTheBusBet(amount);
    } else if (state.currentScreen === "plinko") {
      placePlinkoBet(amount);
    } else if (state.currentScreen === "crash") {
      placeCrashBet(amount);
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
      resetBlackjackForNewTable(true);
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
    if (key === "b") {
      event.preventDefault();
      resetBaccaratForNewTable(true);
      state.currentScreen = "baccarat";
      scrollGameToTop();
      if (!state.baccarat.deck.length) initBaccarat();
      render();
    }
    if (key === "v") {
      event.preventDefault();
      state.currentScreen = "bus";
      scrollGameToTop();
      if (!state.bus.deck.length) initRideTheBus();
      render();
    }
    if (key === "p") {
      event.preventDefault();
      state.currentScreen = "plinko";
      scrollGameToTop();
      render();
    }
    if (key === "x") {
      event.preventDefault();
      state.currentScreen = "crash";
      scrollGameToTop();
      render();
    }
    if (key === "m") {
      event.preventDefault();
      resetMinesweeper();
      state.currentScreen = "minesweeper";
      scrollGameToTop();
      render();
    }
    if (key === "u") {
      event.preventDefault();
      state.currentScreen = "joku";
      scrollGameToTop();
      if (!state.joku.grid.length) initJokuGrid();
      render();
    }
    return;
  }

  if (key === "escape" || (key === "b" && !["slots", "baccarat", "bus", "plinko", "crash"].includes(state.currentScreen))) {
    event.preventDefault();
    resetCurrentTableForExit();
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
    if (key >= "1" && key <= "6") {
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
    if (key >= "1" && key <= "6") {
      const chipIndex = Number(key) - 1;
      placeSlotBet(CHIP_VALUES[chipIndex]);
      return;
    }
    return;
  }

  if (state.currentScreen === "baccarat") {
    if (key >= "1" && key <= "6") {
      const chipIndex = Number(key) - 1;
      state.selectedAmount = CHIP_VALUES[chipIndex];
      render();
      return;
    }
    if (key === "q" || key === "w" || key === "e") {
      event.preventDefault();
      state.baccarat.selectedBet = key === "q" ? "player" : key === "w" ? "dealer" : "tie";
      state.baccarat.message = `${state.baccarat.selectedBet[0].toUpperCase() + state.baccarat.selectedBet.slice(1)} selected.`;
      render();
      return;
    }
    if (key === "b") {
      event.preventDefault();
      placeBaccaratBet(state.baccarat.selectedBet, state.selectedAmount);
      return;
    }
    if (key === "enter" || key === " ") {
      event.preventDefault();
      dealBaccaratRound();
      return;
    }
    if (key === "c") {
      clearBaccaratBets();
      return;
    }
    if (key === "r") {
      repeatBaccaratBets();
      return;
    }
    return;
  }

  if (state.currentScreen === "bus") {
    if (key >= "1" && key <= "6") {
      const chipIndex = Number(key) - 1;
      state.selectedAmount = CHIP_VALUES[chipIndex];
      render();
      return;
    }
    if (state.bus.phase === "guessing") {
      const step = RIDE_BUS_STEPS[state.bus.step];
      if (step && step.id === "red-black" && (key === "r" || key === "k")) {
        answerRideTheBusGuess(key === "r" ? "red" : "black");
        return;
      }
      if (step && step.id === "higher-lower" && (key === "h" || key === "l")) {
        answerRideTheBusGuess(key === "h" ? "higher" : "lower");
        return;
      }
      if (step && step.id === "inside-outside" && (key === "i" || key === "o")) {
        answerRideTheBusGuess(key === "i" ? "inside" : "outside");
        return;
      }
      if (step && step.id === "suit") {
        const suitMap = { s: "spades", h: "hearts", d: "diamonds", c: "clubs" };
        if (suitMap[key]) {
          answerRideTheBusGuess(suitMap[key]);
          return;
        }
      }
    }
    if (key === "b") {
      event.preventDefault();
      placeRideTheBusBet(state.selectedAmount);
      return;
    }
    if (key === "enter" || key === " ") {
      event.preventDefault();
      startRideTheBus();
      return;
    }
    if (key === "c") {
      if (state.bus.phase === "guessing" && state.bus.step > 0) cashOutRideTheBus();
      else clearRideTheBusBet();
      return;
    }
    return;
  }

  if (state.currentScreen === "plinko") {
    if (key >= "1" && key <= "6") {
      const chipIndex = Number(key) - 1;
      state.selectedAmount = CHIP_VALUES[chipIndex];
      render();
      return;
    }
    if (key === "b") {
      event.preventDefault();
      placePlinkoBet(state.selectedAmount);
      return;
    }
    if (key === "enter" || key === " ") {
      event.preventDefault();
      dropPlinkoBall();
      return;
    }
    if (key === "c") {
      clearPlinkoBet();
      return;
    }
    if (key === "r") {
      repeatPlinkoBet();
      return;
    }
    return;
  }

  if (state.currentScreen === "crash") {
    if (key >= "1" && key <= "6") {
      const chipIndex = Number(key) - 1;
      state.selectedAmount = CHIP_VALUES[chipIndex];
      render();
      return;
    }
    if (key === "b") {
      event.preventDefault();
      placeCrashBet(state.selectedAmount);
      return;
    }
    if (key === "enter" || key === " ") {
      event.preventDefault();
      if (state.crash.phase === "flying") cashOutCrash();
      else startCrashRound();
      return;
    }
    if (key === "c") {
      if (state.crash.phase === "flying") cashOutCrash();
      else clearCrashBet();
      return;
    }
    if (key === "r") {
      repeatCrashBet();
      return;
    }
    return;
  }

  if (state.currentScreen === "minesweeper") {
    if (key === "c") {
      cashOutMinesweeper();
      return;
    }
    if (key === "n") {
      resetMinesweeper();
      return;
    }
    return;
  }

  if (state.currentScreen === "joku") {
    if (key === "c") {
      event.preventDefault();
      cashOutJoku();
      return;
    }
    if (key === "n") {
      event.preventDefault();
      resetJokuGame();
      return;
    }
    if (key === "arrowright" || key === "arrowdown") {
      event.preventDefault();
      toggleJokuCard(Math.min(state.joku.selectedIndices.length, JOKU_HAND_SIZE - 1));
      return;
    }
    if (key >= "1" && key <= "5") {
      event.preventDefault();
      toggleJokuCard(Number(key) - 1);
      return;
    }
    if (key === "enter" || key === " ") {
      event.preventDefault();
      playJokuHand();
      return;
    }
    return;
  }

  if (state.currentScreen === "yahtzee") {
    if (key === "enter" || key === " ") {
      event.preventDefault();
      rollYahtzeeDice();
      return;
    }
    if (key >= "1" && key <= "5") {
      toggleYahtzeeDie(Number(key) - 1);
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

  if (key >= "1" && key <= "6") {
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
  touchPlayerPresence();
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

  if (signedIn) {
    accountName.textContent = authState.account.username;
    accountVisibility.textContent = authState.account.isPublic ? "Public profile" : "Private profile";
  }
}

async function refreshLeaderboards(force = false) {
  if (!hasSupabase()) {
    leaderboardState.entries = [];
    leaderboardState.loading = false;
    leaderboardState.loaded = false;
    leaderboardState.error = "Add Supabase config to turn on leaderboards.";
    if (state.currentScreen === "menu" || menuState.settingsOpen) render();
    return;
  }

  if (leaderboardState.loading) return;
  if (leaderboardState.loaded && !force) return;

  leaderboardState.loading = true;
  leaderboardState.error = "";
  if (state.currentScreen === "menu") render();

  const { data, error } = await supabaseClient.rpc("get_public_leaderboards");
  leaderboardState.loading = false;

  if (error) {
    leaderboardState.entries = [];
    leaderboardState.loaded = false;
    leaderboardState.error = error.message;
    if (state.currentScreen === "menu" || menuState.settingsOpen) render();
    return;
  }

  leaderboardState.entries = Array.isArray(data)
    ? data.map((entry) => ({
      username: entry.username,
      balance: Number(entry.balance) || 0,
      xp: Number(entry.xp) || 0,
      isOnline: Boolean(entry.is_online),
    }))
    : [];
  leaderboardState.loaded = true;
  if (state.currentScreen === "menu" || menuState.settingsOpen) render();
}

async function touchPlayerPresence() {
  if (!authState.account || !authState.walletLoaded || !hasSupabase()) return;

  const { data, error } = await supabaseClient.rpc("touch_player_presence", {
    p_username: authState.account.username,
    p_password: authState.account.password,
  });

  if (error) {
    return;
  }

  if (typeof data === "boolean") {
    authState.account.isPublic = data;
  } else if (Array.isArray(data) && typeof data[0] === "boolean") {
    authState.account.isPublic = data[0];
  }

  if (state.currentScreen === "menu") {
    refreshLeaderboards(true);
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
  menuState.settingsOpen = false;
  lastSavedWallet = null;
  lastSavedXp = null;
  authPassword.value = "";
  setAuthMessage("Logged out. Wallet changes are local only.");
  refreshLeaderboards(true);
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
    leaderboardState.error = "Add Supabase config to turn on leaderboards.";
    renderAuthPanel();
    return;
  }

  setAuthMessage("Log in or sign up to sync your wallet.");
  renderAuthPanel();
  refreshLeaderboards(true);
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
    isPublic: account.is_public !== false,
  };
  authUsername.value = account.username;
  authPassword.value = "";
  setWallet(Number(account.balance) || 0, false);
  setXp(Number(account.xp) || 0, false);
  lastSavedWallet = state.wallet;
  lastSavedXp = state.xp;
  authState.walletLoaded = true;
  authState.loadingWallet = false;
  setAuthMessage(message);
  refreshLeaderboards(true);
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

async function updateAccountSettings() {
  if (!authState.account || !hasSupabase()) {
    setAuthMessage("Log in to manage settings.");
    return;
  }

  const usernameInput = document.getElementById("settings-username");
  const passwordInput = document.getElementById("settings-password");
  const publicInput = document.getElementById("settings-public-toggle");
  if (!usernameInput || !passwordInput || !publicInput) return;

  const nextUsername = normalizeUsername(usernameInput.value.trim());
  const nextPassword = passwordInput.value;
  const nextIsPublic = Boolean(publicInput.checked);

  if (!nextUsername) {
    setAuthMessage("Enter a username.");
    return;
  }

  if (nextUsername.length < 3) {
    setAuthMessage("Username must be at least 3 characters.");
    return;
  }

  if (nextPassword && nextPassword.length < 6) {
    setAuthMessage("Password must be at least 6 characters.");
    return;
  }

  const usernameChanged = nextUsername !== authState.account.username;
  const passwordChanged = Boolean(nextPassword);
  const visibilityChanged = nextIsPublic !== authState.account.isPublic;

  if (!usernameChanged && !passwordChanged && !visibilityChanged) {
    setAuthMessage("Nothing changed.");
    return;
  }

  await flushWalletSave();
  setAuthMessage("Saving settings...");
  const { data, error } = await supabaseClient.rpc("update_player_settings", {
    p_username: authState.account.username,
    p_password: authState.account.password,
    p_new_username: usernameChanged ? nextUsername : null,
    p_new_password: passwordChanged ? nextPassword : null,
    p_is_public: visibilityChanged ? nextIsPublic : null,
  });

  if (error) {
    setAuthMessage(error.message);
    return;
  }

  menuState.settingsOpen = false;
  handleAccount(data && data[0], passwordChanged ? nextPassword : authState.account.password, "Settings saved.");
}

async function deleteAccount() {
  if (!authState.account || !hasSupabase()) {
    setAuthMessage("Log in to delete an account.");
    return;
  }

  if (!window.confirm(`Delete ${authState.account.username}? This cannot be undone.`)) return;

  await flushWalletSave();
  setAuthMessage("Deleting account...");
  const { error } = await supabaseClient.rpc("delete_player_account", {
    p_username: authState.account.username,
    p_password: authState.account.password,
  });

  if (error) {
    setAuthMessage(error.message);
    return;
  }

  authState.account = null;
  authState.walletLoaded = false;
  menuState.settingsOpen = false;
  authUsername.value = "";
  authPassword.value = "";
  setWallet(0, false);
  setXp(0, false);
  lastSavedWallet = null;
  lastSavedXp = null;
  setAuthMessage("Account deleted.");
  refreshLeaderboards(true);
  render();
}

function getBetDefinition(id) {
  return betDefinitions.find((bet) => bet.id === id);
}

function getBetTotal(id) {
  return state.bets
    .filter((bet) => bet.betId === id)
    .reduce((sum, bet) => sum + bet.amount, 0);
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

function resetCurrentTableForExit() {
  if (state.currentScreen === "blackjack") {
    resetBlackjackForNewTable(true);
  } else if (state.currentScreen === "baccarat") {
    resetBaccaratForNewTable(true);
  } else if (state.currentScreen === "plinko") {
    resetPlinkoForExit(true);
  } else if (state.currentScreen === "crash") {
    resetCrashForExit(true);
  } else if (state.currentScreen === "yahtzee") {
    resetYahtzeeForNewGame();
  }
}

function resetCurrentTableAfterPopup() {
  if (state.currentScreen === "blackjack" && state.blackjack.result) {
    resetBlackjackForNewTable(false);
  } else if (state.currentScreen === "baccarat" && state.baccarat.result) {
    resetBaccaratForNewTable(false);
  } else if (state.currentScreen === "plinko" && state.plinko.result) {
    preparePlinkoNextRound();
  } else if (state.currentScreen === "crash" && state.crash.result) {
    prepareCrashNextRound();
  } else if (state.currentScreen === "minesweeper" && state.minesweeper.result) {
    if (state.minesweeper.phase !== "playing" && state.minesweeper.phase !== "won") resetMinesweeper();
  } else if (state.currentScreen === "yahtzee" && isYahtzeeGameOver()) {
    resetYahtzeeForNewGame();
  }
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
  if (value >= 500) return "500";
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
  let screenHtml = "";
  if (state.currentScreen === "menu") {
    screenHtml = renderMenu();
  } else if (state.currentScreen === "roulette") {
    screenHtml = renderRoulette();
  } else if (state.currentScreen === "blackjack") {
    screenHtml = renderBlackjack();
  } else if (state.currentScreen === "slots") {
    screenHtml = renderSlots();
  } else if (state.currentScreen === "baccarat") {
    screenHtml = renderBaccarat();
  } else if (state.currentScreen === "bus") {
    screenHtml = renderRideTheBus();
  } else if (state.currentScreen === "plinko") {
    screenHtml = renderPlinko();
  } else if (state.currentScreen === "crash") {
    screenHtml = renderCrash();
  } else if (state.currentScreen === "minesweeper") {
    screenHtml = renderMinesweeper();
  } else if (state.currentScreen === "yahtzee") {
    screenHtml = renderYahtzee();
  } else {
    screenHtml = renderJoku();
  }
  appView.innerHTML = `${screenHtml}${renderSettingsOverlay()}`;
}

function renderMenuLeaderboards() {
  return `
    <div class="leaderboard-stack">
      ${renderLeaderboardCard("balance", "Balance", "Highest stacks on the floor.", "$")}
      ${renderLeaderboardCard("xp", "XP", "Most experienced players.", "xp")}
    </div>
  `;
}

function renderLeaderboardCard(board, title, description, type) {
  const expanded = board === "balance" ? menuState.showAllBalance : menuState.showAllXp;
  const sortedEntries = [...leaderboardState.entries].sort((a, b) => (
    type === "$"
      ? b.balance - a.balance || b.xp - a.xp || a.username.localeCompare(b.username)
      : b.xp - a.xp || b.balance - a.balance || a.username.localeCompare(b.username)
  ));
  const visibleEntries = expanded ? sortedEntries : sortedEntries.slice(0, LEADERBOARD_PREVIEW_COUNT);
  const hasMore = sortedEntries.length > LEADERBOARD_PREVIEW_COUNT;

  let body = "";
  if (!hasSupabase()) {
    body = `<p class="leaderboard-empty">${escapeHtml(leaderboardState.error || "Add Supabase config to turn on leaderboards.")}</p>`;
  } else if (leaderboardState.loading && !leaderboardState.loaded) {
    body = `<p class="leaderboard-empty">Loading leaderboard...</p>`;
  } else if (leaderboardState.error) {
    body = `<p class="leaderboard-empty">${escapeHtml(leaderboardState.error)}</p>`;
  } else if (!visibleEntries.length) {
    body = `<p class="leaderboard-empty">No public players yet.</p>`;
  } else {
    body = `
      <div class="leaderboard-list">
        ${visibleEntries.map((entry, index) => renderLeaderboardEntry(entry, sortedEntries.indexOf(entry) + 1, type)).join("")}
      </div>
    `;
  }

  return `
    <section class="leaderboard-card">
      <div class="leaderboard-card-head">
        <div>
          <p class="menu-eyebrow">${escapeHtml(title)}</p>
          <h3>${escapeHtml(title)} Leaderboard</h3>
        </div>
        <button class="pill-button leaderboard-refresh" data-action="refresh-leaderboards">Refresh</button>
      </div>
      <p class="leaderboard-description">${escapeHtml(description)}</p>
      ${body}
      ${hasMore ? `<button class="pill-button leaderboard-more" data-action="toggle-leaderboard" data-board="${board}">${expanded ? "Show top 3" : "See more"}</button>` : ""}
    </section>
  `;
}

function renderLeaderboardEntry(entry, rank, type) {
  const youBadge = authState.account && authState.account.username === entry.username
    ? `<span class="leaderboard-you">You</span>`
    : "";
  const onlineBadge = entry.isOnline
    ? `<span class="leaderboard-online" aria-label="Online"><span class="leaderboard-online-dot"></span>Online</span>`
    : "";
  const value = type === "$" ? `$${formatMoney(entry.balance)}` : `${entry.xp} XP`;
  return `
    <div class="leaderboard-entry">
      <div class="leaderboard-rank">#${rank}</div>
      <div class="leaderboard-player">
        <strong>${escapeHtml(entry.username)}</strong>
        ${onlineBadge}
        ${youBadge}
      </div>
      <div class="leaderboard-value">${escapeHtml(value)}</div>
    </div>
  `;
}

function renderSettingsOverlay() {
  if (!menuState.settingsOpen || !authState.account) return "";

  return `
    <div class="settings-modal-shell">
      <button class="settings-backdrop" data-action="close-settings" aria-label="Close settings"></button>
      <section class="settings-modal surface">
        <div class="settings-head">
          <div>
            <p class="menu-eyebrow">Settings</p>
            <h2>Account settings</h2>
          </div>
          <button class="pill-button" data-action="close-settings">Close</button>
        </div>
        <p class="settings-copy">Update your username, change your password, delete the account, or decide whether your profile appears on the leaderboards.</p>
        <label class="settings-field">
          <span>Username</span>
          <input id="settings-username" type="text" value="${escapeAttribute(authState.account.username)}" maxlength="20">
        </label>
        <label class="settings-field">
          <span>New password</span>
          <input id="settings-password" type="password" placeholder="Leave blank to keep the current one.">
        </label>
        <label class="settings-toggle">
          <input id="settings-public-toggle" type="checkbox" ${authState.account.isPublic ? "checked" : ""}>
          <span>Show this account on the public leaderboards</span>
        </label>
        <div class="settings-actions">
          <button class="action-button accent" data-action="save-settings">Save settings</button>
          <button class="action-button danger" data-action="delete-account">Delete account</button>
        </div>
      </section>
    </div>
  `;
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
          Your wallet carries across the room. Pick a table, drag chips from the tray, and play from the same balance.
        </p>
        <div class="game-grid">
          <button class="game-card" data-action="open-roulette">
            <img src="roulette-table.png" alt="Roulette table preview">
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
          <button class="game-card" data-action="open-baccarat">
            <div class="baccarat-menu-art">
              <div class="baccarat-menu-arc">P</div>
              <div class="baccarat-menu-arc">D</div>
              <div class="baccarat-menu-arc">T</div>
            </div>
            <div class="game-card-copy">
              <p class="game-tag">Live now</p>
              <h3>Baccarat</h3>
              <p>Only player, dealer, and tie. Stack chips, deal the shoes, and ride the hand totals.</p>
            </div>
          </button>
          <button class="game-card" data-action="open-bus">
            <div class="bus-menu-art">
              <div class="bus-menu-card">R</div>
              <div class="bus-menu-card">H</div>
              <div class="bus-menu-card">I</div>
              <div class="bus-menu-card">S</div>
            </div>
            <div class="game-card-copy">
              <p class="game-tag">Live now</p>
              <h3>Ride the Bus</h3>
              <p>Guess a run of cards step by step, then try to keep the bus rolling through the whole shoe.</p>
            </div>
          </button>
          <button class="game-card" data-action="open-plinko">
            <div class="plinko-menu-art">
              ${Array.from({ length: 21 }, (_, index) => `<span style="--peg:${index}"></span>`).join("")}
              <strong>DROP</strong>
            </div>
            <div class="game-card-copy">
              <p class="game-tag">Live now</p>
              <h3>Plinko</h3>
              <p>Drop a chip through the pins. Edges pay loud, the middle keeps the lights on.</p>
            </div>
          </button>
          <button class="game-card" data-action="open-crash">
            <div class="crash-menu-art">
              <div class="crash-menu-plane"></div>
              <strong>2.14x</strong>
            </div>
            <div class="game-card-copy">
              <p class="game-tag">Live now</p>
              <h3>Crash</h3>
              <p>Launch the round, watch the multiplier climb, and cash out before the flight breaks.</p>
            </div>
          </button>
          <button class="game-card" data-action="open-minesweeper">
            <div class="mines-menu-art">
              ${Array.from({ length: 25 }, (_, index) => `<span class="${index === 7 ? "mine" : index % 4 === 0 ? "open" : ""}">${index === 7 ? "*" : index % 4 === 0 ? "1" : ""}</span>`).join("")}
            </div>
            <div class="game-card-copy">
              <p class="game-tag">Free play</p>
              <h3>Minesweeper</h3>
              <p>Classic mine clearing with no wager. Mark flags, open cells, and keep the wallet out of it.</p>
            </div>
          </button>
          <button class="game-card" data-action="open-joku">
            <div class="joku-menu-art">
              ${["J", "O", "K", "U"].map((rank, index) => renderMenuCard(rank, index)).join("")}
            </div>
            <div class="game-card-copy">
              <p class="game-tag">Free play</p>
              <h3>JØKU</h3>
              <p>Find combinations of 5 cards on a 5x5 grid to earn points, then cash out when the deck runs dry or the board stalls.</p>
            </div>
          </button>
          <button class="game-card" data-action="open-yahtzee">
            <div class="yahtzee-menu-art">
              <div class="yahtzee-die">⚄</div>
              <div class="yahtzee-die">⚅</div>
              <div class="yahtzee-die">⚂</div>
            </div>
            <div class="game-card-copy">
              <p class="game-tag">Free play</p>
              <h3>Yahtzee</h3>
              <p>Classic Kniffel. Roll the dice, fill your card, and earn a reward equal to 1.5x your total score!</p>
            </div>
          </button>
        </div>
      </article>

      <aside class="side-panel surface">
        <div>
          <p class="menu-eyebrow">Casino</p>
          <h2>Leaderboards</h2>
          <p class="menu-copy">Public profiles show up here. The lists refresh when players come back to the menu.</p>
        </div>
        ${renderMenuLeaderboards()}
        <div class="menu-settings-card">
          <div>
            <p class="game-tag">Account</p>
            <strong>${authState.account ? "Settings ready" : "Sign in first"}</strong>
          </div>
          <p class="menu-note">${authState.account ? "Change your username or password, delete the account, or hide from the leaderboards." : "Log in or sign up to save progress and manage visibility."}</p>
          ${authState.account ? '<button class="action-button accent" data-action="open-settings">Open settings</button>' : ""}
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
          <img class="table-image" src="roulette-table.png" alt="Roulette table">
          <div class="roulette-wheel-window">
            <img class="roulette-wheel-disk ${state.rouletteSpinActive ? "spinning" : ""}" src="roulette-spin.png" alt="">
            <div class="roulette-ball-orbit ${state.rouletteSpinActive ? "spinning" : ""}">
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
    <section class="joku-screen surface ${escapeAttribute(joku.phase)}">
      <div class="roulette-head">
        <button class="pill-button menu-button" data-action="go-menu">Menu</button>
        ${renderJokuResult()}
        <div class="status-pill muted">Free play</div>
      </div>

      <div class="joku-table">
        <div class="joku-felt">
          <div class="joku-slots">
            ${renderJokuSlots()}
          </div>

          <div class="joku-grid-container">
            <div class="joku-grid">
              ${joku.grid.map((card, index) => renderJokuCard(card, index)).join("")}
            </div>
          </div>

          <div class="joku-controls">
            <button class="pixel-button green" data-action="joku-play" ${joku.selectedIndices.length === 5 ? "" : "disabled"}>Play</button>
          </div>
        </div>
      </div>

      <div class="wallet-tray">
        <div class="wallet-strip">
          <span class="wallet-strip-label">Wallet</span>
          <strong>$${formatMoney(state.wallet)}</strong>
        </div>
        <div class="joku-free-note">Find combinations of 5 cards to earn rewards.</div>
      </div>
      ${renderPopup()}
    </section>
  `;
}

function renderJokuSlots() {
  const joku = state.joku;
  const selectedCards = joku.selectedIndices.map(idx => joku.grid[idx]);
  const slots = Array.from({ length: 5 }, (_, i) => selectedCards[i] || { hidden: true });
  return slots.map(card => renderCard(card)).join("");
}

function renderJokuCard(card, index) {
  const joku = state.joku;
  const selected = joku.selectedIndices.includes(index);
  const isNew = joku.newIndices.includes(index);
  const isFreshCard = joku.newCardIndices.includes(index);
  const fallDistance = joku.fallDistances[index] || 1;
  const { row, col } = cardSpritePosition(card);

  return `
    <button class="playing-card joku-grid-card ${selected ? "selected" : ""} ${isNew ? "falling" : ""} ${isFreshCard ? "fresh" : ""}" 
            data-action="joku-select" data-index="${index}" aria-label="${card.rank} of ${card.suit}"
            style="--col-delay: ${index % 5}; --fall-rows: ${fallDistance}">
      <div class="card-face" style="background-position:${col * -72}px ${row * -98}px"></div>
    </button>
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

  const needed = 5 - joku.selectedIndices.length;
  const instruction = needed > 0 ? `Select ${needed} more card${needed === 1 ? "" : "s"}.` : "Hand ready to play.";
  return `
    <div class="result-board idle">
      <div class="result-main">JØKU</div>
      <div class="result-sub">${escapeHtml(instruction)}</div>
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

function renderCard(card, revealed = false) {
  if (!card || card.hidden) {
    return `<div class="playing-card card-back"><div class="card-back-inner"></div></div>`;
  }

  const { row, col } = cardSpritePosition(card);
  return `
    <div class="playing-card ${revealed ? "revealed" : ""}">
      <div class="card-face" style="background-position:${col * -72}px ${row * -98}px"></div>
    </div>
  `;
}

function currentMenuNote() {
  if (state.yahtzee.message !== "Roll the dice to start!" && state.yahtzee.message !== "Turn complete. Roll to start next turn.") return state.yahtzee.message;
  if (state.baccarat.result) return state.baccarat.result.detail;
  if (state.bus.result) return state.bus.result.detail;
  if (state.plinko.result) return state.plinko.message;
  if (state.crash.result) return state.crash.message;
  if (state.minesweeper.result) return state.minesweeper.message;
  if (state.joku.result) return state.joku.message;
  if (state.blackjack.result) return state.blackjack.result.detail;
  if (state.slot.result) return state.slot.message;
  if (state.joku.message !== "Draw a free hand and collect the reward.") return state.joku.message;
  if (state.slot.message !== "Place chips, then spin.") return state.slot.message;
  if (state.blackjack.message !== "Place chips, then deal.") return state.blackjack.message;
  return state.spinMessage;
}

function createDeck(includeJoker = false) {
  const suits = ["diamonds", "clubs", "hearts", "spades"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const deck = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }

  if (includeJoker) {
    deck.push({ suit: "wild", rank: "W" });
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
  if (card.suit === "wild") return { row: 2, col: 12 }; // placeholder
  const suitRow = { diamonds: 0, clubs: 1, hearts: 2, spades: 3 };
  const rankColumn = { A: 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, J: 10, Q: 11, K: 12 };
  return {
    row: suitRow[card.suit],
    col: rankColumn[card.rank],
  };
}

function initJokuGrid() {
  const joku = state.joku;
  joku.deck = createDeck(true); // Include Joker in JOKU
  joku.grid = Array.from({ length: 25 }, () => joku.deck.pop());
  joku.selectedIndices = [];
  joku.newIndices = [];
  joku.newCardIndices = [];
  joku.fallDistances = {};
  joku.result = null;
  joku.phase = "ready";
  joku.message = "Select 5 linked cards.";
}

function toggleJokuCard(index) {
  const joku = state.joku;
  if (joku.phase !== "ready") return;

  const pos = joku.selectedIndices.indexOf(index);
  if (pos !== -1) {
    joku.selectedIndices.splice(pos, 1);
  } else if (joku.selectedIndices.length < 5) {
    if (joku.selectedIndices.length === 0) {
      joku.selectedIndices.push(index);
    } else {
      const isPickable = joku.selectedIndices.some((idx) => isJokuAdjacent(idx, index));
      if (isPickable) {
        joku.newIndices = []; // clear old animations
        joku.newCardIndices = [];
        joku.fallDistances = {};
        joku.selectedIndices.push(index);
      }
    }
  }
  render();
}

function isJokuAdjacent(idx1, idx2) {
  const r1 = Math.floor(idx1 / 5);
  const c1 = idx1 % 5;
  const r2 = Math.floor(idx2 / 5);
  const c2 = idx2 % 5;
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
}

function playJokuHand() {
  const joku = state.joku;
  if (joku.selectedIndices.length !== 5 || joku.phase !== "ready") return;

  const hand = joku.selectedIndices.map(idx => joku.grid[idx]);
  const result = evaluateJokuHand(hand);

  adjustWallet(result.reward);
  awardRoundXp("JØKU");
  joku.result = result;
  joku.message = `${result.rank}. +$${formatMoney(result.reward)}`;

  joku.phase = "removing";
  joku.newIndices = [...joku.selectedIndices]; // pulse animations for those going away
  joku.newCardIndices = [];
  joku.fallDistances = {};
  render();

  scheduleUiTask(() => {
    const animation = refillJokuGrid();
    joku.phase = "settling";
    joku.selectedIndices = [];
    joku.newIndices = animation.changedIndices;
    joku.newCardIndices = animation.newCardIndices;
    joku.fallDistances = animation.fallDistances;

    render();

    scheduleUiTask(() => {
      joku.phase = "ready";
      joku.newIndices = [];
      joku.newCardIndices = [];
      joku.fallDistances = {};
      render();

      if (result.reward > 0) {
        openPopupWithDelay({
          tone: "win",
          title: result.rank,
          detail: `Collected $${formatMoney(result.reward)} Reward.`,
          buttonLabel: "Keep Playing",
        }, 120);
      }
    }, 420);
  }, 440);
}

function refillJokuGrid() {
  const joku = state.joku;
  const removedSet = new Set(joku.selectedIndices);
  const columns = 5;
  const rows = 5;
  const changedIndices = [];
  const newCardIndices = [];
  const fallDistances = {};

  for (let col = 0; col < columns; col += 1) {
    const columnStaying = [];
    for (let row = rows - 1; row >= 0; row -= 1) {
      const idx = row * columns + col;
      if (!removedSet.has(idx)) {
        columnStaying.push({
          card: joku.grid[idx],
          oldRow: row,
        });
      }
    }

    const cardsNeeded = rows - columnStaying.length;
    const newCards = [];
    for (let i = 0; i < cardsNeeded; i++) {
      if (joku.deck.length < 1) joku.deck = createDeck(true);
      newCards.push({
        card: joku.deck.pop(),
        oldRow: -cardsNeeded + i,
      });
    }

    const newColumn = [...newCards.reverse(), ...columnStaying.reverse()];

    for (let row = 0; row < rows; row += 1) {
      const idx = row * columns + col;
      const entry = newColumn[row];
      joku.grid[idx] = entry.card;

      const rowDrop = row - entry.oldRow;
      if (rowDrop > 0) {
        changedIndices.push(idx);
        fallDistances[idx] = rowDrop;
        if (entry.oldRow < 0) {
          newCardIndices.push(idx);
        }
      }
    }
  }

  return { changedIndices, newCardIndices, fallDistances };
}


function evaluateJokuHand(hand) {
  const wildIdx = hand.findIndex(c => c.suit === "wild");
  if (wildIdx === -1) return evaluatePureJokuHand(hand);

  // If there's a wild card, try all 52 possibilities
  const suits = ["diamonds", "clubs", "hearts", "spades"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let best = { rank: "High Card", reward: 0 };

  for (const s of suits) {
    for (const r of ranks) {
      const testHand = [...hand];
      testHand[wildIdx] = { suit: s, rank: r };
      const res = evaluatePureJokuHand(testHand);
      if (res.reward > best.reward) best = res;
    }
  }
  return best;
}

function evaluatePureJokuHand(hand) {
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

function resetBlackjackForNewTable(refundWager = false) {
  const bj = state.blackjack;
  if (refundWager && bj.wager > 0 && bj.phase === "betting") {
    adjustWallet(bj.wager);
  }
  bj.phase = "betting";
  bj.dealer = [];
  bj.player = [];
  bj.dealerReveal = false;
  bj.result = null;
  bj.wager = 0;
  bj.wagerChips = [];
  bj.message = "Place chips, then deal.";
  state.pendingReveal = null;
  state.popup = null;
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

function formatMultiplier(value) {
  return `${Number(value).toFixed(2).replace(/\.?0+$/, "")}x`;
}

function canDropPlinko() {
  const plinko = state.plinko;
  return plinko.phase === "betting" && plinko.wager > 0;
}

function canRepeatPlinko() {
  const plinko = state.plinko;
  return plinko.phase === "betting" && plinko.lastWager > 0;
}

function placePlinkoBet(amount) {
  const plinko = state.plinko;
  if (plinko.phase !== "betting") {
    plinko.message = "Wait for the ball to settle.";
    render();
    return;
  }
  const chip = sanitizeMoney(amount);
  if (chip <= 0) return;
  if (chip > state.wallet) {
    plinko.message = "Not enough in the wallet.";
    render();
    return;
  }
  preparePlinkoNextRound();
  adjustWallet(-chip);
  plinko.wager += chip;
  plinko.wagerChips.push(chip);
  plinko.message = `Bet $${formatMoney(plinko.wager)}`;
  state.selectedAmount = chip;
  state.popup = null;
  state.pendingReveal = null;
  render();
}

function clearPlinkoBet() {
  const plinko = state.plinko;
  if (plinko.phase !== "betting" || !plinko.wager) return;
  adjustWallet(plinko.wager);
  plinko.wager = 0;
  plinko.wagerChips = [];
  plinko.message = "Bet cleared.";
  plinko.result = null;
  render();
}

function repeatPlinkoBet() {
  const plinko = state.plinko;
  if (!canRepeatPlinko()) return;
  if (plinko.lastWager > state.wallet) {
    plinko.message = "Wallet is too light for repeat.";
    render();
    return;
  }
  preparePlinkoNextRound();
  adjustWallet(-plinko.lastWager);
  plinko.wager = plinko.lastWager;
  plinko.wagerChips = buildChipListForAmount(plinko.lastWager);
  plinko.message = `Bet $${formatMoney(plinko.wager)}`;
  render();
}

function dropPlinkoBall() {
  const plinko = state.plinko;
  if (!canDropPlinko()) {
    plinko.message = "Place chips, then drop.";
    render();
    return;
  }
  clearPendingPopupTimer();
  plinko.phase = "dropping";
  plinko.lastWager = plinko.wager;
  plinko.path = buildPlinkoPath();
  plinko.currentRow = -1;
  plinko.currentSlot = Math.floor(PLINKO_MULTIPLIERS.length / 2);
  plinko.visualRow = -1;
  plinko.visualSlot = plinko.currentSlot;
  plinko.ballSpin = 0;
  plinko.result = null;
  state.popup = null;
  state.pendingReveal = {
    game: "plinko",
    title: "Dropping",
    detail: "The chip is bouncing through the pins...",
  };
  render();
  schedulePlinkoFrame(0);
}

function buildPlinkoPath() {
  let slot = Math.floor(PLINKO_MULTIPLIERS.length / 2);
  const path = [];
  for (let row = 0; row < PLINKO_ROWS; row += 1) {
    const drift = Math.random() < 0.5 ? -1 : 1;
    slot = Math.max(0, Math.min(PLINKO_MULTIPLIERS.length - 1, slot + drift));
    path.push(slot);
  }
  return path;
}

function plinkoPathPoint(step) {
  const center = Math.floor(PLINKO_MULTIPLIERS.length / 2);
  if (step < 0) return { row: -1, slot: center };
  return {
    row: step,
    slot: state.plinko.path[step] ?? center,
  };
}

function schedulePlinkoFrame(frame) {
  const plinko = state.plinko;
  if (plinko.phase !== "dropping") return;
  const framesPerRow = 10;
  const totalFrames = PLINKO_ROWS * framesPerRow;
  if (frame > totalFrames) {
    finishPlinkoDrop();
    return;
  }

  scheduleUiTask(() => {
    const segment = Math.min(PLINKO_ROWS - 1, Math.floor(frame / framesPerRow));
    const localT = (frame % framesPerRow) / framesPerRow;
    const easedT = localT * localT * (3 - 2 * localT);
    const from = plinkoPathPoint(segment - 1);
    const to = plinkoPathPoint(segment);
    const bounce = Math.sin(localT * Math.PI);
    const lateralWobble = Math.sin(localT * Math.PI * 2) * 0.08;

    plinko.currentRow = to.row;
    plinko.currentSlot = to.slot;
    plinko.visualRow = from.row + (to.row - from.row) * easedT - bounce * 0.16;
    plinko.visualSlot = from.slot + (to.slot - from.slot) * easedT + lateralWobble;
    plinko.ballSpin = frame * 18;
    render();
    schedulePlinkoFrame(frame + 1);
  }, 24);
}

function finishPlinkoDrop() {
  const plinko = state.plinko;
  const slot = plinko.path[plinko.path.length - 1] || 0;
  const multiplier = PLINKO_MULTIPLIERS[slot] || 0;
  const payout = Math.round(plinko.wager * multiplier * 100) / 100;
  const net = Math.round((payout - plinko.wager) * 100) / 100;
  if (payout > 0) adjustWallet(payout);
  awardRoundXp("Plinko");
  plinko.phase = "betting";
  plinko.currentRow = PLINKO_ROWS - 1;
  plinko.currentSlot = slot;
  plinko.visualRow = PLINKO_ROWS - 1;
  plinko.visualSlot = slot;
  plinko.result = { slot, multiplier, payout, net };
  plinko.message = net > 0 ? `Won $${formatMoney(net)}` : net < 0 ? `Lost $${formatMoney(Math.abs(net))}` : "Push";
  plinko.wager = 0;
  plinko.wagerChips = [];
  state.pendingReveal = null;
  render();
  openPopupWithDelay({
    tone: net > 0 ? "win" : net < 0 ? "loss" : "idle",
    title: `${formatMultiplier(multiplier)} Plinko`,
    detail: net > 0 ? `Won $${formatMoney(net)}` : net < 0 ? `Lost $${formatMoney(Math.abs(net))}` : "Bet returned.",
    buttonLabel: "Drop Again",
  }, 300);
}

function preparePlinkoNextRound() {
  const plinko = state.plinko;
  plinko.result = null;
  plinko.path = [];
  plinko.currentRow = -1;
  plinko.currentSlot = Math.floor(PLINKO_MULTIPLIERS.length / 2);
  plinko.visualRow = -1;
  plinko.visualSlot = plinko.currentSlot;
  plinko.ballSpin = 0;
  state.popup = null;
  state.pendingReveal = null;
}

function resetPlinkoForExit(refundWager = false) {
  const plinko = state.plinko;
  if (refundWager && plinko.phase === "betting" && plinko.wager > 0) adjustWallet(plinko.wager);
  plinko.phase = "betting";
  plinko.wager = 0;
  plinko.wagerChips = [];
  plinko.message = "Place chips, then drop.";
  preparePlinkoNextRound();
}

function canStartCrash() {
  const crash = state.crash;
  return crash.phase === "betting" && crash.wager > 0;
}

function canRepeatCrash() {
  const crash = state.crash;
  return crash.phase === "betting" && crash.lastWager > 0;
}

function placeCrashBet(amount) {
  const crash = state.crash;
  if (crash.phase !== "betting") {
    crash.message = "Cash out or wait for the crash.";
    render();
    return;
  }
  const chip = sanitizeMoney(amount);
  if (chip <= 0) return;
  if (chip > state.wallet) {
    crash.message = "Not enough in the wallet.";
    render();
    return;
  }
  prepareCrashNextRound();
  adjustWallet(-chip);
  crash.wager += chip;
  crash.wagerChips.push(chip);
  crash.message = `Bet $${formatMoney(crash.wager)}`;
  state.selectedAmount = chip;
  render();
}

function clearCrashBet() {
  const crash = state.crash;
  if (crash.phase !== "betting" || !crash.wager) return;
  adjustWallet(crash.wager);
  crash.wager = 0;
  crash.wagerChips = [];
  crash.message = "Bet cleared.";
  crash.result = null;
  render();
}

function repeatCrashBet() {
  const crash = state.crash;
  if (!canRepeatCrash()) return;
  if (crash.lastWager > state.wallet) {
    crash.message = "Wallet is too light for repeat.";
    render();
    return;
  }
  prepareCrashNextRound();
  adjustWallet(-crash.lastWager);
  crash.wager = crash.lastWager;
  crash.wagerChips = buildChipListForAmount(crash.lastWager);
  crash.message = `Bet $${formatMoney(crash.wager)}`;
  render();
}

function startCrashRound() {
  const crash = state.crash;
  if (!canStartCrash()) {
    crash.message = "Place a wager and launch.";
    render();
    return;
  }
  clearPendingPopupTimer();
  crash.phase = "flying";
  crash.lastWager = crash.wager;
  crash.multiplier = 0;
  crash.crashPoint = randomCrashPoint();
  crash.cashedOutAt = 0;
  crash.result = null;
  crash.message = "Multiplier is climbing.";
  state.popup = null;
  state.pendingReveal = {
    game: "crash",
    title: "Flying",
    detail: "Cash out before the crash.",
  };
  render();
  scheduleCrashTick();
}

function randomCrashPoint() {
  const roll = Math.max(0.01, Math.random());
  const raw = CRASH_HOUSE_RETURN / roll;
  return Math.max(MIN_CRASH_POINT, Math.min(25, Math.round(raw * 100) / 100));
}

function scheduleCrashTick() {
  const crash = state.crash;
  if (crash.phase !== "flying") return;
  scheduleUiTask(() => {
    if (crash.phase !== "flying") return;
    const climb = crash.multiplier < 1
      ? 0.08
      : CRASH_GROWTH_PER_TICK * Math.max(1, crash.multiplier * 0.55);
    crash.multiplier = Math.round((crash.multiplier + climb) * 100) / 100;
    if (crash.multiplier >= crash.crashPoint) {
      finishCrashLoss();
      return;
    }
    crash.message = `Flying at ${formatMultiplier(crash.multiplier)}.`;
    render();
    scheduleCrashTick();
  }, CRASH_TICK_MS);
}

function cashOutCrash() {
  const crash = state.crash;
  if (crash.phase !== "flying") return;
  clearPendingPopupTimer();
  const payout = Math.round(crash.wager * crash.multiplier * 100) / 100;
  const net = Math.round((payout - crash.wager) * 100) / 100;
  adjustWallet(payout);
  awardRoundXp("Crash");
  crash.phase = "betting";
  crash.cashedOutAt = crash.multiplier;
  const tone = net > 0 ? "win" : net < 0 ? "loss" : "idle";
  crash.result = {
    tone,
    title: `Cashed ${formatMultiplier(crash.multiplier)}`,
    detail: net > 0 ? `Won $${formatMoney(net)}` : net < 0 ? `Lost $${formatMoney(Math.abs(net))}` : "Bet returned.",
    payout,
    net,
  };
  crash.message = crash.result.detail;
  crash.wager = 0;
  crash.wagerChips = [];
  state.pendingReveal = null;
  render();
  openPopupWithDelay({
    tone,
    title: crash.result.title,
    detail: crash.result.detail,
    buttonLabel: "Launch Again",
  }, 250);
}

function finishCrashLoss() {
  const crash = state.crash;
  awardRoundXp("Crash");
  crash.phase = "betting";
  crash.multiplier = crash.crashPoint;
  crash.result = {
    tone: "loss",
    title: `Crashed ${formatMultiplier(crash.crashPoint)}`,
    detail: `Lost $${formatMoney(crash.wager)}`,
    payout: 0,
    net: -crash.wager,
  };
  crash.message = crash.result.detail;
  crash.wager = 0;
  crash.wagerChips = [];
  state.pendingReveal = null;
  render();
  openPopupWithDelay({
    tone: "loss",
    title: crash.result.title,
    detail: crash.result.detail,
    buttonLabel: "Launch Again",
  }, 350);
}

function prepareCrashNextRound() {
  const crash = state.crash;
  crash.result = null;
  crash.multiplier = 0;
  crash.crashPoint = 0;
  crash.cashedOutAt = 0;
  state.popup = null;
  state.pendingReveal = null;
}

function resetCrashForExit(refundWager = false) {
  const crash = state.crash;
  if (refundWager && crash.phase === "betting" && crash.wager > 0) adjustWallet(crash.wager);
  crash.phase = "betting";
  crash.wager = 0;
  crash.wagerChips = [];
  crash.message = "Place a wager and launch.";
  prepareCrashNextRound();
}

function resetMinesweeper() {
  const total = MINESWEEPER_ROWS * MINESWEEPER_COLS;
  state.minesweeper = {
    phase: "playing",
    board: Array.from({ length: total }, () => ({ mine: false, neighborMines: 0 })),
    revealed: Array.from({ length: total }, () => false),
    flagged: Array.from({ length: total }, () => false),
    firstMove: true,
    mineCount: MINESWEEPER_MINES,
    flagsLeft: MINESWEEPER_MINES,
    points: 0,
    cashOut: 0,
    result: null,
    message: "Clear the board without hitting a mine.",
  };
  state.popup = null;
  state.pendingReveal = null;
  render();
}

function buildMinesweeperBoard(safeIndex) {
  const mines = state.minesweeper;
  const total = MINESWEEPER_ROWS * MINESWEEPER_COLS;
  const blocked = new Set([safeIndex, ...minesweeperNeighbors(safeIndex)]);
  let placed = 0;
  while (placed < MINESWEEPER_MINES) {
    const index = Math.floor(Math.random() * total);
    if (blocked.has(index) || mines.board[index].mine) continue;
    mines.board[index].mine = true;
    placed += 1;
  }
  for (let index = 0; index < total; index += 1) {
    mines.board[index].neighborMines = minesweeperNeighbors(index)
      .filter((neighbor) => mines.board[neighbor].mine).length;
  }
}

function minesweeperNeighbors(index) {
  const row = Math.floor(index / MINESWEEPER_COLS);
  const col = index % MINESWEEPER_COLS;
  const neighbors = [];
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nr >= MINESWEEPER_ROWS || nc < 0 || nc >= MINESWEEPER_COLS) continue;
      neighbors.push(nr * MINESWEEPER_COLS + nc);
    }
  }
  return neighbors;
}

function revealMinesweeperCell(index) {
  const mines = state.minesweeper;
  if (mines.phase !== "playing" || !mines.board[index] || mines.flagged[index] || mines.revealed[index]) return;
  if (mines.firstMove) {
    buildMinesweeperBoard(index);
    mines.firstMove = false;
  }
  if (mines.board[index].mine) {
    mines.revealed = mines.revealed.map((revealed, i) => revealed || mines.board[i].mine);
    mines.phase = "lost";
    mines.result = { tone: "loss", title: "Mine Hit" };
    const lostPoints = mines.points;
    mines.points = 0;
    mines.cashOut = 0;
    mines.message = `Mine hit. Lost ${lostPoints} point${lostPoints === 1 ? "" : "s"}.`;
    render();
    openPopupWithDelay({
      tone: "loss",
      title: "Mine Hit",
      detail: `You lost ${lostPoints} point${lostPoints === 1 ? "" : "s"}.`,
      buttonLabel: "New Board",
    }, 180);
    return;
  }
  const revealedCount = floodRevealMinesweeper(index);
  if (revealedCount > 0) {
    mines.points += revealedCount;
    mines.cashOut = Math.round(mines.points * MINESWEEPER_POINT_VALUE * 100) / 100;
  }
  checkMinesweeperWin();
  render();
}

function floodRevealMinesweeper(startIndex) {
  const mines = state.minesweeper;
  const queue = [startIndex];
  const seen = new Set();
  let revealedCount = 0;
  while (queue.length) {
    const index = queue.shift();
    if (seen.has(index) || mines.flagged[index]) continue;
    seen.add(index);
    if (!mines.revealed[index]) revealedCount += 1;
    mines.revealed[index] = true;
    if (mines.board[index].neighborMines !== 0) continue;
    for (const neighbor of minesweeperNeighbors(index)) {
      if (!mines.revealed[neighbor] && !mines.board[neighbor].mine) queue.push(neighbor);
    }
  }
  return revealedCount;
}

function toggleMinesweeperFlag(index) {
  const mines = state.minesweeper;
  if (mines.phase !== "playing" || !mines.board[index] || mines.revealed[index]) return;
  if (!mines.flagged[index] && mines.flagsLeft <= 0) return;
  mines.flagged[index] = !mines.flagged[index];
  mines.flagsLeft += mines.flagged[index] ? -1 : 1;
  mines.message = mines.flagged[index] ? "Flag placed." : "Flag removed.";
  render();
}

function checkMinesweeperWin() {
  const mines = state.minesweeper;
  const safeRevealed = mines.board.every((cell, index) => cell.mine || mines.revealed[index]);
  if (!safeRevealed) {
    mines.message = `${mines.points} point${mines.points === 1 ? "" : "s"} ready. Cash out or keep clearing.`;
    return;
  }
  mines.phase = "won";
  mines.result = { tone: "win", title: "Board Cleared" };
  mines.message = `Board clear. Cash out $${formatMoney(mines.cashOut)}.`;
  openPopupWithDelay({
    tone: "win",
    title: "Board Cleared",
    detail: `Cash out ${mines.points} points for $${formatMoney(mines.cashOut)}.`,
    buttonLabel: "Cash Out",
  }, 180);
}

function canCashOutMinesweeper() {
  const mines = state.minesweeper;
  return (mines.phase === "playing" || mines.phase === "won") && mines.cashOut > 0;
}

function cashOutMinesweeper() {
  const mines = state.minesweeper;
  if (!canCashOutMinesweeper()) return;
  const payout = mines.cashOut;
  adjustWallet(payout);
  awardRoundXp("Minesweeper");
  mines.phase = "cashed-out";
  mines.result = {
    tone: "win",
    title: "Cashed Out",
    payout,
    points: mines.points,
  };
  mines.message = `Cashed out ${mines.points} points for $${formatMoney(payout)}.`;
  render();
  openPopupWithDelay({
    tone: "win",
    title: "Cashed Out",
    detail: `You banked $${formatMoney(payout)}.`,
    buttonLabel: "New Board",
  }, 180);
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
  account: authState.account ? {
    username: authState.account.username,
    isPublic: authState.account.isPublic,
  } : null,
  leaderboards: {
    loaded: leaderboardState.loaded,
    loading: leaderboardState.loading,
    count: leaderboardState.entries.length,
  },
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
  baccarat: {
    phase: state.baccarat.phase,
    playerHand: state.baccarat.playerHand,
    dealerHand: state.baccarat.dealerHand,
    revealedPlayerCards: state.baccarat.revealedPlayerCards,
    revealedDealerCards: state.baccarat.revealedDealerCards,
    bets: state.baccarat.bets,
    result: state.baccarat.result,
    message: state.baccarat.message,
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
    grid: state.joku.grid,
    selectedIndices: state.joku.selectedIndices,
    newIndices: state.joku.newIndices,
    newCardIndices: state.joku.newCardIndices,
    fallDistances: state.joku.fallDistances,
    result: state.joku.result,
    message: state.joku.message,
    score: state.joku.score,
    cashOut: state.joku.cashOut,
    comboCount: state.joku.comboCount,
    cardsRemaining: state.joku.cardsRemaining,
    endReason: state.joku.endReason,
    canLoseMoney: false,
  },
  bus: {
    phase: state.bus.phase,
    wager: state.bus.wager,
    cards: state.bus.cards,
    step: state.bus.step,
    result: state.bus.result,
    message: state.bus.message,
  },
  plinko: {
    phase: state.plinko.phase,
    wager: state.plinko.wager,
    path: state.plinko.path,
    currentRow: state.plinko.currentRow,
    currentSlot: state.plinko.currentSlot,
    visualRow: state.plinko.visualRow,
    visualSlot: state.plinko.visualSlot,
    multipliers: PLINKO_MULTIPLIERS,
    result: state.plinko.result,
    message: state.plinko.message,
  },
  crash: {
    phase: state.crash.phase,
    wager: state.crash.wager,
    multiplier: state.crash.multiplier,
    crashPoint: state.crash.crashPoint,
    cashedOutAt: state.crash.cashedOutAt,
    result: state.crash.result,
    message: state.crash.message,
  },
  minesweeper: {
    phase: state.minesweeper.phase,
    rows: MINESWEEPER_ROWS,
    cols: MINESWEEPER_COLS,
    points: state.minesweeper.points,
    cashOut: state.minesweeper.cashOut,
    revealed: state.minesweeper.revealed,
    flagged: state.minesweeper.flagged,
    visibleBoard: state.minesweeper.board.map((cell, index) => ({
      revealed: state.minesweeper.revealed[index],
      flagged: state.minesweeper.flagged[index],
      value: state.minesweeper.revealed[index] ? (cell.mine ? "mine" : cell.neighborMines) : null,
    })),
    flagsLeft: state.minesweeper.flagsLeft,
    result: state.minesweeper.result,
    message: state.minesweeper.message,
    canLoseMoney: false,
  },
  yahtzee: {
    phase: state.yahtzee.phase,
    dice: state.yahtzee.dice,
    kept: state.yahtzee.kept,
    rollsLeft: state.yahtzee.rollsLeft,
    scores: state.yahtzee.scores,
    total: state.yahtzee.total,
    bonus: state.yahtzee.bonus,
    message: state.yahtzee.message,
  },
  message: state.spinMessage,
  dragActive: dragState.active,
  availableGames: ["roulette", "blackjack", "slots", "baccarat", "bus", "plinko", "crash", "joku", "minesweeper", "yahtzee"],
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

/* Yahtzee Game Logic */
function initYahtzee() {
  state.yahtzee = {
    phase: 'ready',
    dice: [1, 2, 3, 4, 5],
    kept: [false, false, false, false, false],
    rollsLeft: 3,
    scores: {
      ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null,
      threeKind: null, fourKind: null, fullHouse: null, smallStraight: null, largeStraight: null,
      yahtzee: null, chance: null
    },
    message: 'Roll the dice to start!',
    bonus: 0,
    total: 0
  };
}

function rollYahtzeeDice() {
  const y = state.yahtzee;
  if (y.rollsLeft <= 0 || y.phase === 'rolling') return;

  y.phase = 'rolling';
  y.rollsLeft -= 1;
  y.message = 'Rolling...';
  render();

  // Animation sequence
  let ticks = 0;
  const maxTicks = 8;
  const interval = setInterval(() => {
    ticks++;
    for (let i = 0; i < 5; i++) {
      if (!y.kept[i]) {
        y.dice[i] = Math.floor(Math.random() * 6) + 1;
      }
    }
    render();

    if (ticks >= maxTicks) {
      clearInterval(interval);
      y.phase = 'ready';
      y.message = y.rollsLeft === 0 ? 'Last roll! Score your hand.' : `Roll #${3 - y.rollsLeft} complete. Pick dice to keep.`;
      render();
    }
  }, 80);
}

function toggleYahtzeeDie(index) {
  const y = state.yahtzee;
  if (y.rollsLeft === 3 || y.rollsLeft === 0) return;
  y.kept[index] = !y.kept[index];
  render();
}

function scoreYahtzeeCategory(category) {
  const y = state.yahtzee;
  if (y.rollsLeft === 3 || y.scores[category] !== null) return;

  const score = calculateYahtzeeScore(category, y.dice);
  y.scores[category] = score;

  // Reset for next turn
  y.dice = [1, 1, 1, 1, 1];
  y.kept = [false, false, false, false, false];
  y.rollsLeft = 3;
  y.message = 'Turn complete. Roll to start next turn.';

  updateYahtzeeTotals();

  if (isYahtzeeGameOver()) {
    const reward = Math.round(y.total * 1.5 * 100) / 100;
    adjustWallet(reward);
    awardRoundXp('Yahtzee');
    y.message = `Game over! Final score: ${y.total}. Received $${formatMoney(reward)} reward.`;
    openPopupWithDelay({
      tone: 'win',
      title: 'Yahtzee Complete',
      detail: `Final Score: ${y.total}. You earned $${formatMoney(reward)}!`,
      buttonLabel: 'Play Again'
    });
  }
  render();
}

function calculateYahtzeeScore(category, dice) {
  const counts = {};
  dice.forEach(d => counts[d] = (counts[d] || 0) + 1);
  const sum = dice.reduce((a, b) => a + b, 0);

  switch (category) {
    case 'ones': return (counts[1] || 0) * 1;
    case 'twos': return (counts[2] || 0) * 2;
    case 'threes': return (counts[3] || 0) * 3;
    case 'fours': return (counts[4] || 0) * 4;
    case 'fives': return (counts[5] || 0) * 5;
    case 'sixes': return (counts[6] || 0) * 6;
    case 'threeKind': return Object.values(counts).some(c => c >= 3) ? sum : 0;
    case 'fourKind': return Object.values(counts).some(c => c >= 4) ? sum : 0;
    case 'fullHouse': {
      const v = Object.values(counts);
      return (v.includes(3) && v.includes(2)) || v.includes(5) ? 25 : 0;
    }
    case 'smallStraight': {
      const uniqueDice = [...new Set(dice)].sort((a, b) => a - b).join('');
      return /1234|2345|3456/.test(uniqueDice) ? 30 : 0;
    }
    case 'largeStraight': {
      const uniqueDice = [...new Set(dice)].sort((a, b) => a - b).join('');
      return /12345|23456/.test(uniqueDice) ? 40 : 0;
    }
    case 'yahtzee': return Object.values(counts).some(c => c === 5) ? 50 : 0;
    case 'chance': return sum;
    default: return 0;
  }
}

function updateYahtzeeTotals() {
  const y = state.yahtzee;
  const upperKeys = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  const upperSum = upperKeys.reduce((s, k) => s + (y.scores[k] || 0), 0);
  y.bonus = upperSum >= 63 ? 35 : 0;
  const lowerKeys = ['threeKind', 'fourKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance'];
  const lowerSum = lowerKeys.reduce((s, k) => s + (y.scores[k] || 0), 0);
  y.total = upperSum + y.bonus + lowerSum;
}

function isYahtzeeGameOver() {
  return Object.values(state.yahtzee.scores).every(v => v !== null);
}

function renderYahtzee() {
  const y = state.yahtzee;
  const diceFaces = ['?', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  return `
    <section class="yahtzee-screen surface">
      <div class="roulette-head">
        <button class="pill-button menu-button" data-action="go-menu">Menu</button>
        ${renderYahtzeeResult()}
        <div class="status-pill muted">Rolls left: ${y.rollsLeft}</div>
      </div>

      <div class="yahtzee-felt">
        <div class="yahtzee-play-area">
          <div class="yahtzee-dice-container">
            ${y.dice.map((d, i) => `
              <button class="yahtzee-die-btn ${y.kept[i] ? 'kept' : ''} ${y.phase === 'rolling' && !y.kept[i] ? 'rolling' : ''}" 
                      data-action="yahtzee-toggle-die" data-index="${i}"
                      style="animation-delay: ${i * 0.05}s">
                ${diceFaces[d]}
              </button>
            `).join('')}
          </div>
          <div class="yahtzee-controls">
            <button class="pixel-button green" data-action="yahtzee-roll" ${(y.rollsLeft === 0 || y.phase === 'rolling') ? 'disabled' : ''}>Roll Dice</button>
          </div>
        </div>

        <div class="yahtzee-scorecard-container">
          <table class="yahtzee-scorecard">
            <thead>
              <tr><th>Category</th><th>Score</th></tr>
            </thead>
            <tbody>
              ${renderScorecardRow('Ones', 'ones')}
              ${renderScorecardRow('Twos', 'twos')}
              ${renderScorecardRow('Threes', 'threes')}
              ${renderScorecardRow('Fours', 'fours')}
              ${renderScorecardRow('Fives', 'fives')}
              ${renderScorecardRow('Sixes', 'sixes')}
              <tr class="bonus-row">
                <td>Upper Bonus (35)</td>
                <td>${y.bonus}</td>
              </tr>
              ${renderScorecardRow('3 of a Kind', 'threeKind')}
              ${renderScorecardRow('4 of a Kind', 'fourKind')}
              ${renderScorecardRow('Full House', 'fullHouse')}
              ${renderScorecardRow('Small Straight', 'smallStraight')}
              ${renderScorecardRow('Large Straight', 'largeStraight')}
              ${renderScorecardRow('Yahtzee', 'yahtzee')}
              ${renderScorecardRow('Chance', 'chance')}
              <tr class="total-row">
                <td>GRAND TOTAL</td>
                <td>${y.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="wallet-tray">
        <div class="wallet-strip">
          <span class="wallet-strip-label">Wallet</span>
          <strong>$${formatMoney(state.wallet)}</strong>
        </div>
        <div class="joku-free-note">Roll the dice to fill your card and earn 1.5x your score!</div>
      </div>
      ${renderPopup()}
    </section>
  `;
}

function renderYahtzeeResult() {
  const y = state.yahtzee;
  return `
    <div class="result-board idle">
      <div class="result-main">Yahtzee</div>
      <div class="result-sub">${escapeHtml(y.message)}</div>
    </div>
  `;
}

function renderScorecardRow(label, key) {
  const y = state.yahtzee;
  const isFilled = y.scores[key] !== null;
  const currentPotential = (y.rollsLeft < 3 && !isFilled) ? calculateYahtzeeScore(key, y.dice) : '';

  return `
    <tr class="${isFilled ? 'filled' : 'empty'}" ${!isFilled ? `data-action="yahtzee-score-category" data-category="${key}"` : ''}>
      <td>${label}</td>
      <td class="score-cell">${isFilled ? y.scores[key] : `<span class="potential">${currentPotential}</span>`}</td>
    </tr>
  `;
}

function createJokuDeck() {
  return createDeck().slice(0, JOKU_TOTAL_CARDS);
}

function initBaccarat() {
  state.baccarat = {
    phase: "betting",
    deck: createDeck(),
    playerHand: [],
    dealerHand: [],
    revealedPlayerCards: 0,
    revealedDealerCards: 0,
    lastRevealedSide: null,
    lastRevealedIndex: -1,
    bets: { player: 0, dealer: 0, tie: 0 },
    betChips: { player: [], dealer: [], tie: [] },
    lastBets: { player: 0, dealer: 0, tie: 0 },
    lastBetChips: { player: [], dealer: [], tie: [] },
    selectedBet: "player",
    result: null,
    message: "Pick player, dealer, or tie.",
  };
}

function initRideTheBus() {
  state.bus = {
    phase: "betting",
    deck: createDeck(),
    wager: 0,
    wagerChips: [],
    step: 0,
    cards: [],
    result: null,
    message: "Place a wager and ride the bus.",
  };
}

function initJokuGrid() {
  const joku = state.joku;
  joku.deck = createJokuDeck();
  joku.grid = Array.from({ length: JOKU_GRID_SIZE }, () => joku.deck.pop() || null);
  joku.selectedIndices = [];
  joku.newIndices = [];
  joku.newCardIndices = [];
  joku.fallDistances = {};
  joku.result = null;
  joku.score = 0;
  joku.cashOut = 0;
  joku.comboCount = 0;
  joku.cardsRemaining = joku.deck.length;
  joku.endReason = null;
  joku.phase = "ready";
  joku.message = "Select 5 linked cards.";
}

function toggleJokuCard(index) {
  const joku = state.joku;
  if (joku.phase !== "ready") return;
  if (!joku.grid[index]) return;

  const pos = joku.selectedIndices.indexOf(index);
  if (pos !== -1) {
    if (!canDeselectJokuCard(index)) {
      joku.message = "That card keeps the chain connected.";
      render();
      return;
    }
    joku.selectedIndices.splice(pos, 1);
    joku.message = "Select 5 linked cards.";
    render();
    return;
  }

  if (joku.selectedIndices.length === 0) {
    joku.selectedIndices.push(index);
    render();
    return;
  }

  const isPickable = joku.selectedIndices.some((idx) => isJokuAdjacent(idx, index));
  if (isPickable && joku.selectedIndices.length < JOKU_HAND_SIZE) {
    joku.selectedIndices.push(index);
    render();
  }
}

function isJokuAdjacent(idx1, idx2) {
  const r1 = Math.floor(idx1 / 5);
  const c1 = idx1 % 5;
  const r2 = Math.floor(idx2 / 5);
  const c2 = idx2 % 5;
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
}

function canPlayJoku() {
  const joku = state.joku;
  return joku.phase === "ready" && joku.selectedIndices.length === JOKU_HAND_SIZE;
}

function canCashOutJoku() {
  const joku = state.joku;
  return joku.phase === "finished" && joku.cashOut > 0;
}

function canResetJoku() {
  const joku = state.joku;
  return joku.phase !== "ready" || joku.score > 0 || joku.cardsRemaining !== JOKU_TOTAL_CARDS - JOKU_GRID_SIZE;
}

function playJokuHand() {
  const joku = state.joku;
  if (!canPlayJoku()) return;

  const hand = joku.selectedIndices.map((idx) => joku.grid[idx]).filter(Boolean);
  const result = evaluateJokuHand(hand);

  joku.score += result.points;
  joku.comboCount += 1;
  joku.cashOut = Math.round(joku.score * JOKU_HAND_MULTIPLIER * 100) / 100;
  joku.result = result;
  joku.message = `${result.rank}. +${result.points} pts`;
  joku.phase = "dropping";
  joku.newIndices = [...joku.selectedIndices];
  joku.newCardIndices = [];
  joku.fallDistances = {};
  render();

  scheduleUiTask(() => {
    const refill = refillJokuGrid();
    joku.grid = refill.grid;
    joku.cardsRemaining = joku.deck.length;
    joku.selectedIndices = [];
    joku.newIndices = refill.changedIndices;
    joku.newCardIndices = refill.newCardIndices;
    joku.fallDistances = refill.fallDistances;
    joku.phase = "ready";

    if (joku.cardsRemaining === 0 || !hasJokuMove()) {
      joku.phase = "finished";
      joku.endReason = joku.cardsRemaining === 0 ? "deck-empty" : "no-combos";
      if (joku.endReason === "deck-empty") {
        joku.newIndices = [];
        joku.newCardIndices = [];
        joku.fallDistances = {};
      }
      joku.message = joku.endReason === "deck-empty"
        ? "No cards left. Cash out your score."
        : "No more combinations. Cash out your score.";
      joku.result = {
        rank: "Game Over",
        points: 0,
        cashValue: joku.cashOut,
      };
    }

    render();

    if (joku.phase === "finished") {
      openPopupWithDelay({
        tone: "idle",
        title: "JOKU Complete",
        detail: `Cash out ${joku.score} points for $${formatMoney(joku.cashOut)}.`,
        buttonLabel: "Cash Out",
      }, 200);
    }
  }, 420);
}

function cashOutJoku() {
  const joku = state.joku;
  if (!canCashOutJoku()) return;
  adjustWallet(joku.cashOut);
  awardRoundXp("JOKU");
  joku.message = `Cashed out $${formatMoney(joku.cashOut)}.`;
  joku.result = {
    rank: "Cashed Out",
    points: joku.score,
    cashValue: joku.cashOut,
  };
  render();
  openPopupWithDelay({
    tone: "win",
    title: "Cashed Out",
    detail: `You banked $${formatMoney(joku.cashOut)} from ${joku.score} points.`,
    buttonLabel: "New Game",
  }, 220);
  joku.phase = "cashed-out";
}

function resetJokuGame() {
  initJokuGrid();
  clearPendingPopupTimer();
  state.popup = null;
  state.pendingReveal = null;
  render();
}

function refillJokuGrid() {
  const joku = state.joku;
  const removedSet = new Set(joku.selectedIndices);
  const columns = 5;
  const rows = 5;
  const nextGrid = [...joku.grid];
  const changedIndices = [];
  const newCardIndices = [];
  const fallDistances = {};

  for (let col = 0; col < columns; col += 1) {
    const staying = [];
    for (let row = rows - 1; row >= 0; row -= 1) {
      const idx = row * columns + col;
      const card = nextGrid[idx];
      if (card && !removedSet.has(idx)) {
        staying.push({ card, oldRow: row });
      }
    }

    const cardsNeeded = rows - staying.length;
    const newCards = [];
    for (let i = 0; i < cardsNeeded && joku.deck.length > 0; i += 1) {
      newCards.push({
        card: joku.deck.pop(),
        oldRow: -cardsNeeded + i,
      });
    }

    const newColumn = [...newCards.reverse(), ...staying.reverse()];
    for (let row = 0; row < rows; row += 1) {
      const idx = row * columns + col;
      const entry = newColumn[row];
      nextGrid[idx] = entry ? entry.card : null;
      if (entry) {
        const rowDrop = row - entry.oldRow;
        if (rowDrop > 0) {
          changedIndices.push(idx);
          fallDistances[idx] = rowDrop;
          if (entry.oldRow < 0) {
            newCardIndices.push(idx);
          }
        }
      }
    }
  }

  return { grid: nextGrid, changedIndices, newCardIndices, fallDistances };
}

function hasJokuMove() {
  const joku = state.joku;
  const occupied = joku.grid
    .map((card, index) => (card ? index : null))
    .filter((index) => index !== null);

  const seen = new Set();
  for (const start of occupied) {
    if (searchJokuCombo([start], seen)) return true;
  }
  return false;
}

function searchJokuCombo(path, seen) {
  const joku = state.joku;
  const key = [...path].sort((a, b) => a - b).join("-");
  if (seen.has(key)) return false;
  seen.add(key);

  if (path.length === JOKU_HAND_SIZE) {
    const hand = path.map((index) => joku.grid[index]).filter(Boolean);
    return evaluateJokuHand(hand).points > 0;
  }

  const neighbors = new Set();
  for (const idx of path) {
    const row = Math.floor(idx / 5);
    const col = idx % 5;
    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (nr < 0 || nr >= 5 || nc < 0 || nc >= 5) continue;
        const next = nr * 5 + nc;
        if (!path.includes(next) && joku.grid[next]) neighbors.add(next);
      }
    }
  }

  for (const next of neighbors) {
    if (searchJokuCombo([...path, next], seen)) return true;
  }

  return false;
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
    points: payout.points,
    reward: payout.reward,
    cashValue: Math.round(payout.points * JOKU_HAND_MULTIPLIER * 100) / 100,
  };
}

function baccaratCardValue(card) {
  if (!card || card.hidden) return 0;
  if (["10", "J", "Q", "K"].includes(card.rank)) return 0;
  if (card.rank === "A") return 1;
  return Number(card.rank);
}

function baccaratHandTotal(hand) {
  return hand.reduce((sum, card) => (sum + baccaratCardValue(card)) % 10, 0);
}

function baccaratCardLabel(card) {
  return card ? `${card.rank} ${card.suit}` : "--";
}

function canDealBaccarat() {
  return state.baccarat.phase === "betting" && totalBaccaratBets() > 0;
}

function canRepeatBaccarat() {
  const baccarat = state.baccarat;
  return baccarat.phase === "betting" && totalBaccaratLastBets() > 0;
}

function totalBaccaratBets() {
  const bets = state.baccarat.bets;
  return bets.player + bets.dealer + bets.tie;
}

function totalBaccaratLastBets() {
  const bets = state.baccarat.lastBets || { player: 0, dealer: 0, tie: 0 };
  return bets.player + bets.dealer + bets.tie;
}

function normalizeBaccaratSide(side) {
  return String(side || "").replace(/^baccarat-/, "");
}

function placeBaccaratBet(side, amount) {
  const baccarat = state.baccarat;
  const betSide = normalizeBaccaratSide(side);
  if (baccarat.phase !== "betting") {
    baccarat.message = "Wait for the hand to finish.";
    render();
    return;
  }

  if (!["player", "dealer", "tie"].includes(betSide)) return;
  const chip = sanitizeMoney(amount);
  if (chip <= 0) return;
  if (chip > state.wallet) {
    baccarat.message = "Not enough in the wallet.";
    render();
    return;
  }

  prepareBaccaratNextBet();
  adjustWallet(-chip);
  baccarat.bets[betSide] += chip;
  baccarat.betChips[betSide].push(chip);
  baccarat.selectedBet = betSide;
  baccarat.message = `${betSide[0].toUpperCase() + betSide.slice(1)} bet $${formatMoney(baccarat.bets[betSide])}`;
  state.pendingReveal = null;
  state.popup = null;
  render();
}

function clearBaccaratBets() {
  const baccarat = state.baccarat;
  const total = totalBaccaratBets();
  if (!total) return;
  adjustWallet(total);
  baccarat.lastBets = { ...baccarat.bets };
  baccarat.lastBetChips = cloneBaccaratChips(baccarat.betChips);
  baccarat.bets = { player: 0, dealer: 0, tie: 0 };
  baccarat.betChips = emptyBaccaratChips();
  baccarat.message = "Bets cleared.";
  state.pendingReveal = null;
  state.popup = null;
  render();
}

function repeatBaccaratBets() {
  const baccarat = state.baccarat;
  if (baccarat.phase !== "betting" || !totalBaccaratLastBets()) return;
  const lastTotal = totalBaccaratLastBets();
  if (lastTotal > state.wallet) {
    baccarat.message = "Wallet is too light for repeat.";
    render();
    return;
  }

  prepareBaccaratNextBet();
  adjustWallet(-lastTotal);
  baccarat.bets = { ...baccarat.lastBets };
  baccarat.betChips = cloneBaccaratChips(baccarat.lastBetChips || chipsFromBaccaratBets(baccarat.lastBets));
  baccarat.message = "Repeat bet ready.";
  render();
}

function canDeselectJokuCard(index) {
  const joku = state.joku;
  const remaining = joku.selectedIndices.filter((idx) => idx !== index);
  if (remaining.length <= 1) return true;

  const visited = new Set([remaining[0]]);
  const queue = [remaining[0]];
  while (queue.length) {
    const current = queue.shift();
    for (const next of remaining) {
      if (!visited.has(next) && isJokuAdjacent(current, next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return visited.size === remaining.length;
}

function prepareBaccaratNextBet() {
  const baccarat = state.baccarat;
  if (!baccarat.result) return;
  baccarat.result = null;
  baccarat.playerHand = [];
  baccarat.dealerHand = [];
  baccarat.revealedPlayerCards = 0;
  baccarat.revealedDealerCards = 0;
  baccarat.lastRevealedSide = null;
  baccarat.lastRevealedIndex = -1;
}

function emptyBaccaratChips() {
  return { player: [], dealer: [], tie: [] };
}

function cloneBaccaratChips(chips) {
  return {
    player: [...(chips && chips.player ? chips.player : [])],
    dealer: [...(chips && chips.dealer ? chips.dealer : [])],
    tie: [...(chips && chips.tie ? chips.tie : [])],
  };
}

function resetYahtzeeForNewGame() {
  initYahtzee();
  state.pendingReveal = null;
  state.popup = null;
}

function resetBaccaratForNewTable(refundBets = false) {
  const baccarat = state.baccarat;
  const activeTotal = totalBaccaratBets();
  if (refundBets && activeTotal > 0 && baccarat.phase === "betting") {
    adjustWallet(activeTotal);
  }
  baccarat.phase = "betting";
  baccarat.playerHand = [];
  baccarat.dealerHand = [];
  baccarat.revealedPlayerCards = 0;
  baccarat.revealedDealerCards = 0;
  baccarat.lastRevealedSide = null;
  baccarat.lastRevealedIndex = -1;
  baccarat.bets = { player: 0, dealer: 0, tie: 0 };
  baccarat.betChips = emptyBaccaratChips();
  baccarat.result = null;
  baccarat.message = "Pick player, dealer, or tie.";
  state.pendingReveal = null;
  state.popup = null;
}

function chipsFromBaccaratBets(bets) {
  return {
    player: buildChipListForAmount(bets.player || 0),
    dealer: buildChipListForAmount(bets.dealer || 0),
    tie: buildChipListForAmount(bets.tie || 0),
  };
}

function dealBaccaratRound() {
  const baccarat = state.baccarat;
  if (!canDealBaccarat()) return;

  clearPendingPopupTimer();
  state.popup = null;
  state.pendingReveal = {
    game: "baccarat",
    title: "Dealing",
    detail: "Cards are coming off the shoe...",
  };
  baccarat.phase = "dealing";
  baccarat.result = null;
  baccarat.revealedPlayerCards = 0;
  baccarat.revealedDealerCards = 0;
  baccarat.lastRevealedSide = null;
  baccarat.lastRevealedIndex = -1;
  if (baccarat.deck.length < 6) baccarat.deck = createDeck();
  baccarat.playerHand = [baccarat.deck.pop(), baccarat.deck.pop()];
  baccarat.dealerHand = [baccarat.deck.pop(), baccarat.deck.pop()];

  const playerThird = baccaratShouldPlayerDraw(baccarat.playerHand);
  if (playerThird) baccarat.playerHand.push(baccarat.deck.pop());

  if (baccaratShouldDealerDraw(baccarat.dealerHand, baccarat.playerHand)) {
    baccarat.dealerHand.push(baccarat.deck.pop());
  }

  render();
  scheduleBaccaratRevealStep(0);
}

function baccaratRevealSequence() {
  const sequence = [
    { side: "player", index: 1, title: "Player Card", detail: "Player turns the first card." },
    { side: "dealer", index: 1, title: "Dealer Card", detail: "Dealer answers from the shoe." },
    { side: "player", index: 2, title: "Player Card", detail: "Player reveals the second card." },
    { side: "dealer", index: 2, title: "Dealer Card", detail: "Dealer reveals the second card." },
  ];

  if (state.baccarat.playerHand.length > 2) {
    sequence.push({ side: "player", index: 3, title: "Player Draws", detail: "Player takes a third card." });
  }

  if (state.baccarat.dealerHand.length > 2) {
    sequence.push({ side: "dealer", index: 3, title: "Dealer Draws", detail: "Dealer takes a third card." });
  }

  return sequence;
}

function scheduleBaccaratRevealStep(stepIndex) {
  const baccarat = state.baccarat;
  const sequence = baccaratRevealSequence();
  const step = sequence[stepIndex];

  if (!step) {
    state.pendingReveal = {
      game: "baccarat",
      title: "Counting",
      detail: "Totals are being counted...",
    };
    render();
    scheduleUiTask(() => {
      resolveBaccaratRound();
    }, 420);
    return;
  }

  state.pendingReveal = {
    game: "baccarat",
    title: step.title,
    detail: step.detail,
  };
  baccarat.lastRevealedSide = null;
  baccarat.lastRevealedIndex = -1;
  render();

  scheduleUiTask(() => {
    if (step.side === "player") {
      baccarat.revealedPlayerCards = Math.max(baccarat.revealedPlayerCards, step.index);
    } else {
      baccarat.revealedDealerCards = Math.max(baccarat.revealedDealerCards, step.index);
    }
    baccarat.lastRevealedSide = step.side;
    baccarat.lastRevealedIndex = step.index - 1;
    render();
    scheduleUiTask(() => {
      scheduleBaccaratRevealStep(stepIndex + 1);
    }, 560);
  }, stepIndex === 0 ? 380 : 560);
}

function baccaratShouldPlayerDraw(hand) {
  return baccaratHandTotal(hand) <= 5;
}

function baccaratShouldDealerDraw(dealerHand, playerHand) {
  const dealerTotal = baccaratHandTotal(dealerHand);
  if (dealerTotal <= 2) return true;

  const playerThird = playerHand.length === 3 ? baccaratCardValue(playerHand[2]) : null;
  if (playerHand.length === 2) {
    return dealerTotal <= 5;
  }

  if (dealerTotal === 3) return playerThird !== 8;
  if (dealerTotal === 4) return playerThird !== null && playerThird >= 2 && playerThird <= 7;
  if (dealerTotal === 5) return playerThird !== null && playerThird >= 4 && playerThird <= 7;
  if (dealerTotal === 6) return playerThird !== null && playerThird >= 6 && playerThird <= 7;
  return false;
}

function resolveBaccaratRound() {
  const baccarat = state.baccarat;
  const playerTotal = baccaratHandTotal(baccarat.playerHand);
  const dealerTotal = baccaratHandTotal(baccarat.dealerHand);
  const bets = baccarat.bets;
  const staked = totalBaccaratBets();
  let payout = 0;
  let title = "Baccarat";
  let summary = `Player ${playerTotal} vs Dealer ${dealerTotal}`;
  let winningSide = "tie";

  if (playerTotal > dealerTotal) {
    title = "Player Wins";
    summary = `Player ${playerTotal} beats Dealer ${dealerTotal}.`;
    winningSide = "player";
    payout += bets.player * 2;
  } else if (dealerTotal > playerTotal) {
    title = "Dealer Wins";
    summary = `Dealer ${dealerTotal} beats Player ${playerTotal}.`;
    winningSide = "dealer";
    payout += bets.dealer * 2;
  } else {
    title = "Tie";
    summary = `Both sides land on ${playerTotal}.`;
    winningSide = "tie";
    payout += bets.player;
    payout += bets.dealer;
    payout += bets.tie * (BACCARAT_TIE_PAYOUT + 1);
  }

  const net = Math.round((payout - staked) * 100) / 100;
  const tone = net > 0 ? "win" : net < 0 ? "loss" : "idle";
  const detail = net > 0
    ? `${summary} Profit $${formatMoney(net)}.`
    : net < 0
      ? `${summary} Lost $${formatMoney(Math.abs(net))}.`
      : `${summary} Push.`;

  adjustWallet(payout);
  awardRoundXp("Baccarat");
  baccarat.phase = "betting";
  baccarat.revealedPlayerCards = baccarat.playerHand.length;
  baccarat.revealedDealerCards = baccarat.dealerHand.length;
  baccarat.lastRevealedSide = null;
  baccarat.lastRevealedIndex = -1;
  baccarat.result = {
    title,
    detail,
    tone,
    winningSide,
    bets: { ...bets },
    betChips: cloneBaccaratChips(baccarat.betChips),
    payout,
    net,
    playerTotal,
    dealerTotal,
  };
  baccarat.lastBets = { ...baccarat.bets };
  baccarat.lastBetChips = cloneBaccaratChips(baccarat.betChips);
  baccarat.bets = { player: 0, dealer: 0, tie: 0 };
  baccarat.betChips = emptyBaccaratChips();
  baccarat.message = detail;
  state.pendingReveal = null;
  render();

  openPopupWithDelay({
    tone,
    title,
    detail: net > 0
      ? `Profit $${formatMoney(net)}`
      : net < 0
        ? `Lost $${formatMoney(Math.abs(net))}`
        : "Push.",
    buttonLabel: "Next Hand",
  }, 320);
}

function canStartRideTheBus() {
  return state.bus.phase === "betting" && state.bus.wager > 0;
}

function rideTheBusCashOutMultiplier() {
  const bus = state.bus;
  if (bus.phase !== "guessing" || bus.step <= 0) return 0;
  const previousStep = RIDE_BUS_STEPS[bus.step - 1];
  return previousStep ? previousStep.multiplier : 0;
}

function rideTheBusCashOutValue() {
  return Math.round(state.bus.wager * rideTheBusCashOutMultiplier() * 100) / 100;
}

function rideTheBusNextMultiplier() {
  const step = RIDE_BUS_STEPS[state.bus.step];
  return step ? step.multiplier : 0;
}

function placeRideTheBusBet(amount) {
  const bus = state.bus;
  if (bus.phase !== "betting") {
    bus.message = "Wait for the current ride to finish.";
    render();
    return;
  }

  const chip = sanitizeMoney(amount);
  if (chip <= 0) return;
  if (chip > state.wallet) {
    bus.message = "Not enough in the wallet.";
    render();
    return;
  }

  adjustWallet(-chip);
  bus.wager += chip;
  bus.wagerChips.push(chip);
  bus.message = `Wager $${formatMoney(bus.wager)}`;
  state.pendingReveal = null;
  state.popup = null;
  render();
}

function clearRideTheBusBet() {
  const bus = state.bus;
  if (!bus.wager) return;
  adjustWallet(bus.wager);
  bus.wager = 0;
  bus.wagerChips = [];
  bus.message = "Bet cleared.";
  state.pendingReveal = null;
  state.popup = null;
  render();
}

function cashOutRideTheBus() {
  const bus = state.bus;
  const multiplier = rideTheBusCashOutMultiplier();
  const payout = rideTheBusCashOutValue();
  if (bus.phase !== "guessing" || payout <= 0) return;

  adjustWallet(payout);
  awardRoundXp("Ride the Bus");
  bus.phase = "betting";
  bus.result = {
    title: "Cashed Out",
    detail: `Banked $${formatMoney(payout)} at ${multiplier}x.`,
    tone: "win",
  };
  bus.message = bus.result.detail;
  bus.wager = 0;
  bus.wagerChips = [];
  state.pendingReveal = null;
  render();
  openPopupWithDelay({
    tone: "win",
    title: "Ride Banked",
    detail: `You cashed out for $${formatMoney(payout)}.`,
    buttonLabel: "Ride Again",
  }, 300);
}

function startRideTheBus() {
  const bus = state.bus;
  if (!canStartRideTheBus()) return;

  clearPendingPopupTimer();
  state.popup = null;
  state.pendingReveal = {
    game: "bus",
    title: "Riding",
    detail: "The first card is on the rail...",
  };
  bus.phase = "guessing";
  bus.cards = [];
  bus.result = null;
  bus.step = 0;
  render();

  scheduleUiTask(() => {
    if (bus.deck.length < 8) bus.deck = createDeck();
    bus.cards = [bus.deck.pop()];
    bus.message = "Red or black?";
    state.pendingReveal = null;
    render();
  }, 420);
}

function answerRideTheBusGuess(guess) {
  const bus = state.bus;
  if (bus.phase !== "guessing") return;
  const step = RIDE_BUS_STEPS[bus.step];
  if (!step) return;

  if (bus.deck.length < 1) bus.deck = createDeck();
  const card = bus.deck.pop();
  const previous = bus.cards[bus.cards.length - 1];
  let correct = false;

  if (step.id === "red-black") {
    const isRed = ["hearts", "diamonds"].includes(card.suit);
    correct = (guess === "red" && isRed) || (guess === "black" && !isRed);
  } else if (step.id === "higher-lower") {
    const previousValue = busRankValue(previous.rank);
    const currentValue = busRankValue(card.rank);
    correct = (guess === "higher" && currentValue > previousValue) || (guess === "lower" && currentValue < previousValue);
  } else if (step.id === "inside-outside") {
    const values = bus.cards.slice(-2).map((c) => busRankValue(c.rank)).sort((a, b) => a - b);
    const currentValue = busRankValue(card.rank);
    correct = (guess === "inside" && currentValue > values[0] && currentValue < values[1]) ||
      (guess === "outside" && (currentValue < values[0] || currentValue > values[1]));
  } else if (step.id === "suit") {
    correct = guess === card.suit;
  }

  bus.cards.push(card);
  if (!correct) {
    bus.phase = "betting";
    bus.result = {
      title: "Busted",
      detail: `Wrong guess on ${step.label.toLowerCase()}.`,
      tone: "loss",
    };
    bus.message = bus.result.detail;
    bus.wager = 0;
    bus.wagerChips = [];
    state.pendingReveal = null;
    render();
    openPopupWithDelay({
      tone: "loss",
      title: "Bus Bust",
      detail: "The ride stops here.",
      buttonLabel: "Try Again",
    }, 300);
    return;
  }

  bus.step += 1;
  if (bus.step >= RIDE_BUS_STEPS.length) {
    const finalMultiplier = RIDE_BUS_STEPS[RIDE_BUS_STEPS.length - 1].multiplier;
    const payout = Math.round(bus.wager * finalMultiplier * 100) / 100;
    adjustWallet(payout);
    awardRoundXp("Ride the Bus");
    bus.phase = "betting";
    bus.result = {
      title: "Ride Complete",
      detail: `Won $${formatMoney(payout)}`,
      tone: "win",
    };
    bus.message = bus.result.detail;
    bus.wager = 0;
    bus.wagerChips = [];
    state.pendingReveal = null;
    render();
    openPopupWithDelay({
      tone: "win",
      title: "Ride the Bus",
      detail: `You rode the whole hand for $${formatMoney(payout)}.`,
      buttonLabel: "Ride Again",
    }, 300);
    return;
  }

  bus.message = `Cash out $${formatMoney(rideTheBusCashOutValue())} or ride for ${rideTheBusNextMultiplier()}x.`;
  render();
}

function busRankValue(rank) {
  if (rank === "A") return 1;
  if (rank === "J") return 11;
  if (rank === "Q") return 12;
  if (rank === "K") return 13;
  return Number(rank);
}

function renderHandCards(cards) {
  return cards.length ? cards.map((card) => renderCard(card)).join("") : `<div class="bus-empty-hand"></div>`;
}

function renderPlinko() {
  const plinko = state.plinko;
  return `
    <section class="plinko-screen surface ${escapeAttribute(plinko.phase)}">
      <div class="roulette-head">
        <button class="pill-button menu-button" data-action="go-menu">Menu</button>
        ${renderPlinkoResult()}
        <div class="status-pill muted">Bet $${formatMoney(plinko.wager)}</div>
      </div>

      <div class="plinko-table">
        <div class="plinko-felt">
          <button class="plinko-pot ${state.hoverBetId === "plinko-main" ? "hover" : ""}" data-action="plinko-bet" data-bet-zone="plinko-main">
            <span>Drop Pot</span>
            <strong>$${formatMoney(plinko.wager)}</strong>
            <div class="plinko-bet-chips">${renderPlinkoWagerChips()}</div>
          </button>
          <div class="plinko-board">
            ${renderPlinkoPegs()}
            ${renderPlinkoBall()}
            <div class="plinko-bins">
              ${PLINKO_MULTIPLIERS.map((multiplier, index) => `
                <div class="plinko-bin ${plinko.result && plinko.result.slot === index ? "hit" : ""}">
                  <strong>${formatMultiplier(multiplier)}</strong>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="plinko-controls">
            <button class="pixel-button green" data-action="plinko-drop" ${canDropPlinko() ? "" : "disabled"}>Drop</button>
            <button class="pixel-button red" data-action="plinko-clear" ${plinko.phase === "betting" && plinko.wager ? "" : "disabled"}>Clear</button>
            <button class="pixel-button gold" data-action="plinko-repeat" ${canRepeatPlinko() ? "" : "disabled"}>Repeat</button>
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

function renderPlinkoResult() {
  const plinko = state.plinko;
  if (state.pendingReveal && state.pendingReveal.game === "plinko") {
    return `
      <div class="result-board pending">
        <div class="result-main">${escapeHtml(state.pendingReveal.title)}</div>
        <div class="result-sub">${escapeHtml(state.pendingReveal.detail)}</div>
      </div>
    `;
  }
  if (plinko.result) {
    const tone = plinko.result.net > 0 ? "win" : plinko.result.net < 0 ? "loss" : "idle";
    return `
      <div class="result-board ${tone}">
        <div class="result-main">${formatMultiplier(plinko.result.multiplier)}</div>
        <div class="result-sub">${plinko.result.net >= 0 ? "+" : "-"}$${formatMoney(Math.abs(plinko.result.net))}</div>
      </div>
    `;
  }
  return `
    <div class="result-board idle">
      <div class="result-main">Plinko</div>
      <div class="result-sub">${escapeHtml(plinko.message)}</div>
    </div>
  `;
}

function renderPlinkoPegs() {
  const pegs = [];
  for (let row = 0; row < PLINKO_ROWS; row += 1) {
    for (let col = 0; col <= row; col += 1) {
      pegs.push(`<span class="plinko-peg" style="--row:${row};--col:${col};--count:${row + 1}"></span>`);
    }
  }
  return pegs.join("");
}

function renderPlinkoBall() {
  const plinko = state.plinko;
  if (plinko.phase !== "dropping" && !plinko.result) return "";
  const row = Math.max(-1, Number.isFinite(plinko.visualRow) ? plinko.visualRow : plinko.currentRow);
  const slot = Math.max(0, Math.min(PLINKO_MULTIPLIERS.length - 1, Number.isFinite(plinko.visualSlot) ? plinko.visualSlot : plinko.currentSlot));
  return `<div class="plinko-ball" style="--ball-row:${row};--ball-slot:${slot};--ball-spin:${plinko.ballSpin || 0}deg"></div>`;
}

function renderPlinkoWagerChips() {
  if (!state.plinko.wagerChips.length) return "";
  return state.plinko.wagerChips.map((value, index) => `
    <div class="placed-chip slot-chip chip-${chipClassForValue(value)}" style="left:${40 + index * 12}px;top:${26 + (index % 2) * 10}px">
      $${formatChipValue(value)}
    </div>
  `).join("");
}

function renderCrash() {
  const crash = state.crash;
  return `
    <section class="crash-screen surface ${escapeAttribute(crash.phase)}">
      <div class="roulette-head">
        <button class="pill-button menu-button" data-action="go-menu">Menu</button>
        ${renderCrashResult()}
        <div class="status-pill muted">Bet $${formatMoney(crash.wager)}</div>
      </div>

      <div class="crash-table">
        <div class="crash-felt">
          <button class="crash-pot ${state.hoverBetId === "crash-main" ? "hover" : ""}" data-action="crash-bet" data-bet-zone="crash-main">
            <span>Flight Bank</span>
            <strong>$${formatMoney(crash.wager)}</strong>
            <div class="crash-bet-chips">${renderCrashWagerChips()}</div>
          </button>
          <div class="crash-sky">
            <div class="crash-grid-lines"></div>
            <div class="crash-plane ${crash.phase === "flying" ? "flying" : crash.phase === "crashed" ? "crashed" : ""}" style="--crash-progress:${Math.max(0, Math.min(1, crash.multiplier / 6))}"></div>
            <div class="crash-multiplier">${formatMultiplier(crash.multiplier)}</div>
          </div>
          <div class="crash-controls">
            <button class="pixel-button green" data-action="crash-start" ${canStartCrash() ? "" : "disabled"}>Launch</button>
            <button class="pixel-button gold" data-action="crash-cashout" ${crash.phase === "flying" ? "" : "disabled"}>Cash Out</button>
            <button class="pixel-button red" data-action="crash-clear" ${crash.phase === "betting" && crash.wager ? "" : "disabled"}>Clear</button>
            <button class="pixel-button" data-action="crash-repeat" ${canRepeatCrash() ? "" : "disabled"}>Repeat</button>
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

function renderCrashResult() {
  const crash = state.crash;
  if (state.pendingReveal && state.pendingReveal.game === "crash") {
    return `
      <div class="result-board pending">
        <div class="result-main">${escapeHtml(state.pendingReveal.title)}</div>
        <div class="result-sub">${escapeHtml(state.pendingReveal.detail)}</div>
      </div>
    `;
  }
  if (crash.result) {
    return `
      <div class="result-board ${crash.result.tone}">
        <div class="result-main">${escapeHtml(crash.result.title)}</div>
        <div class="result-sub">${escapeHtml(crash.result.detail)}</div>
      </div>
    `;
  }
  return `
    <div class="result-board idle">
      <div class="result-main">Crash</div>
      <div class="result-sub">${escapeHtml(crash.message)}</div>
    </div>
  `;
}

function renderCrashWagerChips() {
  if (!state.crash.wagerChips.length) return "";
  return state.crash.wagerChips.map((value, index) => `
    <div class="placed-chip slot-chip chip-${chipClassForValue(value)}" style="left:${40 + index * 12}px;top:${26 + (index % 2) * 10}px">
      $${formatChipValue(value)}
    </div>
  `).join("");
}

function renderMinesweeper() {
  const mines = state.minesweeper;
  return `
    <section class="minesweeper-screen surface ${escapeAttribute(mines.phase)}">
      <div class="roulette-head">
        <button class="pill-button menu-button" data-action="go-menu">Menu</button>
        ${renderMinesweeperResult()}
        <div class="status-pill muted">Flags ${mines.flagsLeft}</div>
      </div>
      <div class="minesweeper-table">
        <div class="minesweeper-felt">
          <div class="minesweeper-main">
            <div class="minesweeper-board">
              ${mines.board.map((cell, index) => renderMinesweeperCell(cell, index)).join("")}
            </div>
            <aside class="minesweeper-rail">
              <div class="joku-rail-card">
                <span>Points</span>
                <strong>${mines.points}</strong>
              </div>
              <div class="joku-rail-card">
                <span>Cash Out</span>
                <strong>$${formatMoney(mines.cashOut)}</strong>
              </div>
              <div class="joku-rail-card">
                <span>Safe Tiles</span>
                <strong>${mines.revealed.filter(Boolean).length}</strong>
              </div>
              <div class="joku-free-note">${escapeHtml(mines.message)}</div>
            </aside>
          </div>
          <div class="minesweeper-controls">
            <button class="pixel-button gold" data-action="minesweeper-cashout" ${canCashOutMinesweeper() ? "" : "disabled"}>Cash Out</button>
            <button class="pixel-button green" data-action="minesweeper-new">New Game</button>
          </div>
        </div>
      </div>
      <div class="wallet-tray">
        <div class="wallet-strip">
          <span class="wallet-strip-label">Wallet</span>
          <strong>$${formatMoney(state.wallet)}</strong>
        </div>
        <div class="joku-free-note">Each safe tile is 1 point. Cash out before a mine takes the stack.</div>
      </div>
      ${renderPopup()}
    </section>
  `;
}

function renderMinesweeperResult() {
  const mines = state.minesweeper;
  const tone = mines.result ? mines.result.tone : "idle";
  const title = mines.result ? mines.result.title : "Minesweeper";
  return `
    <div class="result-board ${tone}">
      <div class="result-main">${escapeHtml(title)}</div>
      <div class="result-sub">${escapeHtml(mines.message)}</div>
    </div>
  `;
}

function renderMinesweeperCell(cell, index) {
  const mines = state.minesweeper;
  const revealed = mines.revealed[index];
  const flagged = mines.flagged[index];
  const label = revealed
    ? cell.mine ? "*" : cell.neighborMines ? String(cell.neighborMines) : ""
    : flagged ? "F" : "";
  return `
    <button
      class="minesweeper-cell ${revealed ? "revealed" : ""} ${flagged ? "flagged" : ""} count-${cell.neighborMines || 0}"
      data-action="${flagged ? "minesweeper-flag" : "minesweeper-reveal"}"
      data-index="${index}"
      ${mines.phase !== "playing" ? "disabled" : ""}
      aria-label="Cell ${index + 1}"
      oncontextmenu="event.preventDefault(); this.dataset.action='minesweeper-flag'; this.click();"
    >${escapeHtml(label)}</button>
  `;
}

function renderJoku() {
  const joku = state.joku;
  return `
    <section class="joku-screen surface ${escapeAttribute(joku.phase)}">
      <div class="roulette-head">
        <button class="pill-button menu-button" data-action="go-menu">Menu</button>
        ${renderJokuResult()}
        <div class="status-pill muted">${joku.cardsRemaining} cards left</div>
      </div>

      <div class="joku-table">
        <div class="joku-felt">
          <div class="joku-main">
            <div class="joku-slots">
              ${renderJokuSlots()}
            </div>
            <div class="joku-grid-wrap">
              <div class="joku-grid">
                ${joku.grid.map((card, index) => renderJokuCard(card, index)).join("")}
              </div>
            </div>
            <div class="joku-controls">
              <button class="pixel-button green" data-action="joku-play" ${canPlayJoku() ? "" : "disabled"}>Play</button>
              <button class="pixel-button gold" data-action="joku-cashout" ${canCashOutJoku() ? "" : "disabled"}>Cash Out</button>
              <button class="pixel-button" data-action="joku-reset" ${canResetJoku() ? "" : "disabled"}>New Game</button>
            </div>
          </div>

          <aside class="joku-rail">
            <div class="joku-rail-card">
              <span>Points</span>
              <strong>${state.joku.score}</strong>
            </div>
            <div class="joku-rail-card">
              <span>Cash Out</span>
              <strong>$${formatMoney(state.joku.cashOut)}</strong>
            </div>
            <div class="joku-rail-card">
              <span>Combos</span>
              <strong>${state.joku.comboCount}</strong>
            </div>
            <div class="joku-rail-card">
              <span>Deck</span>
              <strong>${state.joku.cardsRemaining}</strong>
            </div>
            <div class="joku-free-note">${escapeHtml(joku.message)}</div>
          </aside>
        </div>
      </div>

      <div class="wallet-tray">
        <div class="wallet-strip">
          <span class="wallet-strip-label">Wallet</span>
          <strong>$${formatMoney(state.wallet)}</strong>
        </div>
        <div class="joku-free-note">Find 5-card hands, keep the board alive, and cash out when the shoe is done.</div>
      </div>
      ${renderPopup()}
    </section>
  `;
}

function renderJokuSlots() {
  const joku = state.joku;
  const selectedCards = joku.selectedIndices.map((idx) => joku.grid[idx]);
  const slots = Array.from({ length: JOKU_HAND_SIZE }, (_, i) => selectedCards[i] || { hidden: true });
  return slots.map((card) => renderCard(card)).join("");
}

function renderJokuCard(card, index) {
  if (!card) {
    return `<div class="joku-grid-card empty"></div>`;
  }

  const joku = state.joku;
  const selected = joku.selectedIndices.includes(index);
  const isNew = joku.newIndices.includes(index);
  const isFreshCard = joku.newCardIndices.includes(index);
  const fallDistance = joku.fallDistances[index] || 1;
  const { row, col } = cardSpritePosition(card);

  return `
    <button class="playing-card joku-grid-card ${selected ? "selected" : ""} ${isNew ? "falling" : ""} ${isFreshCard ? "fresh" : ""}" 
            data-action="joku-select" data-index="${index}" aria-label="${card.rank} of ${card.suit}"
            style="--col-delay: ${index % 5}; --fall-rows: ${fallDistance}">
      <div class="card-face" style="background-position:${col * -72}px ${row * -98}px"></div>
    </button>
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

  if (joku.phase === "finished" || joku.phase === "cashed-out") {
    return `
      <div class="result-board win">
        <div class="result-main">${joku.phase === "cashed-out" ? "Cashed Out" : "Cash Out Ready"}</div>
        <div class="result-sub">${escapeHtml(joku.message)}</div>
      </div>
    `;
  }

  if (joku.result) {
    return `
      <div class="result-board win">
        <div class="result-main">${escapeHtml(joku.result.rank)}</div>
        <div class="result-sub">+${joku.result.points} pts</div>
      </div>
    `;
  }

  const needed = JOKU_HAND_SIZE - joku.selectedIndices.length;
  const instruction = needed > 0 ? `Select ${needed} more card${needed === 1 ? "" : "s"}.` : "Hand ready to play.";
  return `
    <div class="result-board idle">
      <div class="result-main">JØKU</div>
      <div class="result-sub">${escapeHtml(instruction)}</div>
    </div>
  `;
}

function renderBaccarat() {
  const baccarat = state.baccarat;
  return `
    <section class="baccarat-screen surface ${escapeAttribute(baccarat.phase)}">
      <div class="roulette-head">
        <button class="pill-button menu-button" data-action="go-menu">Menu</button>
        ${renderBaccaratResult()}
        <div class="status-pill muted">Bet $${formatMoney(totalBaccaratBets())}</div>
      </div>

      <div class="baccarat-table">
        <div class="baccarat-felt">
          <button class="baccarat-row baccarat-row-player ${state.hoverBetId === "baccarat-player" ? "hover" : ""} ${baccaratRowOutcomeClass("player")}" data-action="baccarat-place" data-side="player" data-bet-zone="baccarat-player">
            <div class="baccarat-head">
              <span>Player</span>
              ${renderBaccaratTotal("player")}
            </div>
            <div class="baccarat-bet-chips">${renderBaccaratBetChips("player")}</div>
            <div class="baccarat-cards">${renderBaccaratHandCards("player")}</div>
          </button>

          <button class="baccarat-row baccarat-row-tie ${state.hoverBetId === "baccarat-tie" ? "hover" : ""} ${baccaratRowOutcomeClass("tie")}" data-action="baccarat-place" data-side="tie" data-bet-zone="baccarat-tie">
            <span>Tie</span>
            <div class="baccarat-bet-chips tie-chips">${renderBaccaratBetChips("tie")}</div>
          </button>

          <button class="baccarat-row baccarat-row-dealer ${state.hoverBetId === "baccarat-dealer" ? "hover" : ""} ${baccaratRowOutcomeClass("dealer")}" data-action="baccarat-place" data-side="dealer" data-bet-zone="baccarat-dealer">
            <div class="baccarat-head">
              <span>Dealer</span>
              ${renderBaccaratTotal("dealer")}
            </div>
            <div class="baccarat-bet-chips">${renderBaccaratBetChips("dealer")}</div>
            <div class="baccarat-cards">${renderBaccaratHandCards("dealer")}</div>
          </button>

          <div class="baccarat-controls">
            <button class="pixel-button green" data-action="baccarat-deal" ${canDealBaccarat() ? "" : "disabled"}>Deal</button>
            <button class="pixel-button red" data-action="baccarat-clear" ${totalBaccaratBets() ? "" : "disabled"}>Clear</button>
            <button class="pixel-button gold" data-action="baccarat-repeat" ${canRepeatBaccarat() ? "" : "disabled"}>Repeat</button>
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

function renderBaccaratResult() {
  const baccarat = state.baccarat;
  if (state.pendingReveal && state.pendingReveal.game === "baccarat") {
    return `
      <div class="result-board pending">
        <div class="result-main">${escapeHtml(state.pendingReveal.title)}</div>
        <div class="result-sub">${escapeHtml(state.pendingReveal.detail)}</div>
      </div>
    `;
  }

  if (baccarat.result) {
    return `
      <div class="result-board ${baccarat.result.tone}">
        <div class="result-main">${escapeHtml(baccarat.result.title)}</div>
        <div class="result-sub">${escapeHtml(baccarat.result.detail)}</div>
      </div>
    `;
  }

  return `
    <div class="result-board idle">
      <div class="result-main">Baccarat</div>
      <div class="result-sub">${escapeHtml(baccarat.message)}</div>
    </div>
  `;
}

function renderBaccaratHandCards(side) {
  const baccarat = state.baccarat;
  const hand = side === "player" ? baccarat.playerHand : baccarat.dealerHand;
  const revealedCount = side === "player" ? baccarat.revealedPlayerCards : baccarat.revealedDealerCards;
  const visibleCards = hand.map((card, index) => (index < revealedCount ? card : { hidden: true }));
  return visibleCards.length
    ? visibleCards.map((card, index) => renderCard(card, baccarat.lastRevealedSide === side && baccarat.lastRevealedIndex === index)).join("")
    : `<div class="bus-empty-hand"></div>`;
}

function renderBaccaratTotal(side) {
  const baccarat = state.baccarat;
  const hand = side === "player" ? baccarat.playerHand : baccarat.dealerHand;
  const revealedCount = side === "player" ? baccarat.revealedPlayerCards : baccarat.revealedDealerCards;
  if (!revealedCount) return `<strong class="baccarat-total muted">Total --</strong>`;
  const total = baccaratHandTotal(hand.slice(0, revealedCount));
  return `<strong class="baccarat-total">Total ${total}</strong>`;
}

function baccaratDisplayedChips(side) {
  const baccarat = state.baccarat;
  if (baccarat.result && baccarat.result.betChips) {
    return baccarat.result.betChips[side] || [];
  }
  return baccarat.betChips[side] || [];
}

function renderBaccaratBetChips(side) {
  const chips = baccaratDisplayedChips(side);
  if (!chips.length) return "";
  return chips.map((value, index) => `
    <div class="placed-chip baccarat-chip chip-${chipClassForValue(value)}" style="left:${18 + index * 11}px;top:${8 + (index % 2) * 9}px">
      $${formatChipValue(value)}
    </div>
  `).join("");
}

function baccaratRowOutcomeClass(side) {
  const result = state.baccarat.result;
  if (!result || !result.bets || !result.bets[side]) return "";

  if (result.winningSide === side) {
    return result.net > 0 ? "settled-win" : "settled-push";
  }

  if (result.winningSide === "tie" && (side === "player" || side === "dealer")) {
    return "settled-push";
  }

  return "settled-loss";
}

function renderRideTheBus() {
  const bus = state.bus;
  return `
    <section class="bus-screen surface ${escapeAttribute(bus.phase)}">
      <div class="roulette-head">
        <button class="pill-button menu-button" data-action="go-menu">Menu</button>
        ${renderRideTheBusResult()}
        <div class="status-pill muted">Bet $${formatMoney(bus.wager)}</div>
      </div>

      <div class="bus-table">
        <div class="bus-felt">
          <div class="bus-lane">
            <div class="bus-current-card">${renderCard(bus.cards[bus.cards.length - 1] || { hidden: true })}</div>
            <div class="bus-tracks">
              ${RIDE_BUS_STEPS.map((step, index) => `
                <div class="bus-track ${index < bus.step ? "done" : index === bus.step ? "active" : ""}">
                  <div class="bus-track-head">
                    <strong>${escapeHtml(step.label)}</strong>
                    <em>${step.multiplier}x</em>
                  </div>
                  <span>${escapeHtml(step.detail)}</span>
                  <small>${bus.wager ? `$${formatMoney(Math.round(bus.wager * step.multiplier * 100) / 100)}` : "No wager"}</small>
                </div>
              `).join("")}
            </div>
          </div>

          <button class="bus-pot ${state.hoverBetId === "bus-main" ? "hover" : ""}" data-action="bus-bet" data-bet-zone="bus-main">
            <span>Wager</span>
            <strong>$${formatMoney(bus.wager)}</strong>
            <em>${rideTheBusCashOutValue() > 0 ? `Cash out $${formatMoney(rideTheBusCashOutValue())}` : `Top ride $${formatMoney(Math.round(bus.wager * RIDE_BUS_STEPS[RIDE_BUS_STEPS.length - 1].multiplier * 100) / 100)}`}</em>
            <div class="bus-bet-chips">${renderBusWagerChips()}</div>
          </button>

          <div class="bus-guess-zone">
            ${renderRideTheBusGuessButtons()}
          </div>

          <div class="bus-controls">
            <button class="pixel-button green" data-action="bus-play" ${canStartRideTheBus() ? "" : "disabled"}>Ride</button>
            <button class="pixel-button gold" data-action="bus-cashout" ${rideTheBusCashOutValue() > 0 ? "" : "disabled"}>Cash Out</button>
            <button class="pixel-button red" data-action="bus-clear" ${bus.wager ? "" : "disabled"}>Clear</button>
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

function renderRideTheBusResult() {
  const bus = state.bus;
  if (state.pendingReveal && state.pendingReveal.game === "bus") {
    return `
      <div class="result-board pending">
        <div class="result-main">${escapeHtml(state.pendingReveal.title)}</div>
        <div class="result-sub">${escapeHtml(state.pendingReveal.detail)}</div>
      </div>
    `;
  }

  if (bus.result) {
    return `
      <div class="result-board ${bus.result.tone}">
        <div class="result-main">${escapeHtml(bus.result.title)}</div>
        <div class="result-sub">${escapeHtml(bus.result.detail)}</div>
      </div>
    `;
  }

  return `
    <div class="result-board idle">
      <div class="result-main">Ride the Bus</div>
      <div class="result-sub">${escapeHtml(bus.message)}</div>
    </div>
  `;
}

function renderRideTheBusGuessButtons() {
  const bus = state.bus;
  if (bus.phase !== "guessing") {
    return `<div class="bus-guess-note">Deal the first card, then start guessing.</div>`;
  }

  const step = RIDE_BUS_STEPS[bus.step];
  if (!step) return "";

  if (step.id === "red-black") {
    return `
      <button class="pixel-button" data-action="bus-guess" data-guess="red">Red</button>
      <button class="pixel-button" data-action="bus-guess" data-guess="black">Black</button>
    `;
  }

  if (step.id === "higher-lower") {
    return `
      <button class="pixel-button" data-action="bus-guess" data-guess="higher">Higher</button>
      <button class="pixel-button" data-action="bus-guess" data-guess="lower">Lower</button>
    `;
  }

  if (step.id === "inside-outside") {
    return `
      <button class="pixel-button" data-action="bus-guess" data-guess="inside">Inside</button>
      <button class="pixel-button" data-action="bus-guess" data-guess="outside">Outside</button>
    `;
  }

  return `
    ${["spades", "hearts", "diamonds", "clubs"].map((suit) => `
      <button class="pixel-button" data-action="bus-guess" data-guess="${suit}">${suit[0].toUpperCase() + suit.slice(1)}</button>
    `).join("")}
  `;
}

function renderBusWagerChips() {
  if (!state.bus.wagerChips.length) return "";
  return state.bus.wagerChips.map((value, index) => `
    <div class="placed-chip slot-chip chip-${chipClassForValue(value)}" style="left:${34 + index * 12}px;top:${26 + (index % 2) * 10}px">
      $${formatChipValue(value)}
    </div>
  `).join("");
}
