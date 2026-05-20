Original prompt: create a new web game project in C:\Users\Lev\web games named gamblers

## 2026-05-19

- Created the initial plain HTML/CSS/JS canvas project.
- Game concept: collect chips, avoid hazards, cash out the pot to bank points and raise risk.
- Exposed `window.render_game_to_text` and `window.advanceTime(ms)` for automated browser testing.
- Added `codex-playtest-actions.json` for a basic automated start, movement, and cash-out smoke test.
- Ran the Playwright smoke test against `http://127.0.0.1:8003`; verified the screenshot and text state show active gameplay with HUD, coins, hazards, player, and cash-out state.
- Replaced the arcade prototype with a menu-based casino layout and a wallet-driven European roulette table.
- Added clickable betting fields for straight numbers, dozens, columns, red/black, odd/even, and 1-18 / 19-36, using real roulette payout ratios.
- Added keyboard controls for smoke testing and accessibility: `A` add funds, `Enter` place/open, `Space` spin, arrows move selection, `B` returns to menu.
- Refined roulette interaction so table clicks select a field first, then the chosen amount is committed with a dedicated place-bet action.
- Re-ran the Playwright smoke test and verified wallet deposit, bet placement, and straight-up `0` payout settlement in the captured state and screenshot.
- Swapped the text-heavy roulette UI for a sprite-based table with invisible betting zones and a bottom chip tray.
- Added drag-and-drop chip placement from wallet-backed denominations so placed chips stay on the board until the round resolves.
- Verified the resized roulette stage keeps the table and chip tray visible together in the desktop viewport screenshot.
- Local server now decodes asset paths with spaces; roulette sprite loads correctly in the smoke-test run.
- Enlarged the roulette result display so the rolled number and win/loss amount are much more prominent.
- Increased the roulette screen menu button size to better match the heavier table UI.
- Added blackjack as a second menu game with a dedicated pixel-art table and `playing cards.png`-based card rendering.
- Implemented blackjack round logic: shuffled deck, dealer turn, pushes, doubles, standard wins, and 3:2 blackjack payout.
- Fixed post-round flow so blackjack can accept fresh bets again after a hand resolves instead of getting stuck.
- Added a shared result popup overlay for both roulette and blackjack that shows win/loss outcome and amount before continuing.
- Added short resolving states before results: roulette now shows a spinning phase, and blackjack shows a dealer-settling phase before the popup appears.
- Reworked popup dismissal so the continue buttons close reliably instead of feeling dead.
- Replaced the hidden blackjack card back with `back card.png`.
- Changed roulette from a text-only resolve delay to a visible spinning-wheel/ball animation over the table art.
- Added a third game: a 3x5 slot machine with five paylines, weighted symbols, reel-stop animation, and wallet-backed betting.
- Verified the slot machine in the browser with a smoke test: funded wallet, placed a wager, spun the reels, and captured the result popup/state.
- Replaced slot letter abbreviations with symbol glyphs and updated the prize ladder: cherry/lemon lowest, cloverleaf/bell mid-low, diamond/treasure high, and 7 as the top symbol.
- Re-ran the slots browser smoke test and inspected the screenshot: symbol reels render correctly; the only console noise is the existing 404 noted below.
- Replaced slot paylines with eleven named pattern checks from the reference image and lowered their multipliers to 1x, 1x, 1x, 2x, 3x, 3x, 3x, 4x, 4x, 5x, and 10x.
- Verified the updated slots screen in browser: the eleven pattern labels fit and the game state loads without new slot runtime errors.
- Fixed HOR/HOR-L/HOR-XL pattern detection so horizontal runs count on the top and bottom rows as well as the middle row; added a targeted check for the reported top-row three-lemon case.
- Added a 20% boost pass to slot grid generation: grids without a natural 2x+ pattern can be upgraded into a random higher pattern, making better combinations appear more often.
- Added JØKU as a fourth game: a no-bet five-card draw table using the existing card sprites, paying wallet rewards for every hand without subtracting money.
- Verified JØKU with the Playwright game client: opening the JØKU card, drawing a hand, wallet increasing from $0.00 to $2.00 on a high-card hand, XP increasing by 20, and `canLoseMoney:false` in `render_game_to_text`. The remaining console 404 is the pre-existing missing-resource noise from earlier runs.

## TODO

- Swapped roulette spin overlay to the dedicated `roulette spin.png`, centered it over the table wheel, and separated wheel/ball spin speeds for smoother roulette motion.
- Fixed JOKU animation phases: selected cards now use the removing phase, refilled cards use a settling phase, animation markers are cleared after settling, and the refill uses the deterministic UI scheduler instead of a raw timeout.
- Revised JOKU refill again after feedback: the refill now computes per-column gravity. Existing cards above empty cells drop down by their real row distance, only fresh deck cards fall in from above, and fresh/new animation state is exposed in `render_game_to_text`.
- Added keyboard smoke-test support for JOKU top-row selections plus `codex-joku-play-actions.json` / `codex-joku-mid-actions.json`.
- Verified roulette and JOKU in the browser game client. JOKU resolves to `phase:"ready"`, `selectedIndices:[]`, `newIndices:[]`, with reward wallet/XP applied. The existing favicon-style 404 console noise remains.
- Playtest the drag/drop chip flow, sprite button hit areas, keyboard fallback, and roulette spin settlement.
- Blackjack screen rendering is verified, but the full blackjack round flow still needs a deeper browser playtest because the current automated client is weak at drag interactions on non-canvas UIs.
- There is still one residual 404 in browser console during automated runs; likely an extra icon request worth tracing later if it becomes noisy.
- Consider adding split/street/corner bets if the next request wants a denser casino-accurate table.

## 2026-05-20

- Added baccarat and ride the bus as menu games with their own tables, controls, and sprite-aligned styling.
- Added a 500 chip denomination and wired it into the shared tray so the bigger chip is available across the room.
- Reworked JOKU into the drop-style five-card selection game with a 50-card shoe, side-rail points, and end-of-shoe cash-out.
- Fixed the shared keyboard routing so baccarat and ride the bus can use `B` as an in-game bet key without being kicked back to the menu.
- Verified baccarat, ride the bus, and JOKU in browser:
  - Baccarat opens correctly and shows the 500 chip; with an empty wallet it correctly reports `Not enough in the wallet.`
  - Ride the bus opens correctly and shows the four-step ladder; with an empty wallet it correctly reports `Not enough in the wallet.`
  - JOKU plays through five rounds, reaches `cardsRemaining: 0`, ends with `phase:"cashed-out"`, and returns the cash-out amount to the wallet.
- The existing console 404 still appears in automated runs and does not block play.
- Fixed baccarat betting after feedback: drag/drop now normalizes `baccarat-player` style zone IDs, and player/dealer/tie table areas can be clicked directly to place the selected chip.
- Added ride-the-bus ladder values, current cash-out amount, and a cash-out button; verified a $10 wager showing `$15.00` cash-out after the first correct guess and the full 1.5x/2.5x/5x/12x ladder.
- Cleared JOKU fall animation markers when the 50-card shoe is empty, so the final cash-out state no longer shows cards falling with no cards left.
- Removed the test-funds/add-funds UI and JavaScript path entirely, including the special `kreeper2011` case.
- Reworked baccarat resolution into a staged reveal: cards appear as backs, player/dealer cards reveal in sequence, optional third cards show before the result, and the hands remain visible after settlement.
- Baccarat result color now uses net profit/loss from the actual bet: green only for profitable bets, red for losing bets, neutral for pushes. Verified a Player bet losing to Dealer shows `Lost $10.00` in red after the staged reveal.
- Recovered from a bad save where `game.js` had been concatenated into itself multiple times with broken join text near `RIDE_BUS_STEPS`, causing the whole script to fail parsing and the page to look mostly empty. Preserved the damaged version as `codex-corrupt-game-backup.js`, rebuilt a single clean copy, and verified `node --check game.js` passes.
- Removed stale references to the deleted test-funds controls; those null element listeners were preventing the app view from finishing its render after the syntax repair.
- Removed one final corrupted `}Set(...)` tail left at the end of `game.js`, which produced a `Constructor Set requires 'new'` page error after the visible UI returned.
- Finished baccarat feedback: hands now deal face-down and reveal player/dealer cards one by one, including optional third cards, before settlement. Baccarat result tone and row outlines now use actual net profit/loss from the player’s placed bets, and final hands stay visible after the result. Removed the remaining menu copy that mentioned test funds.
- Verified with `codex-baccarat-visual-test.js`: seeded-browser baccarat hand showed partial reveals mid-hand, all cards revealed at settlement, `net:-10` for a losing Player bet, and no browser errors. Also ran the normal baccarat smoke check with an empty wallet; it opened cleanly and showed `Not enough in the wallet.` without errors.
- Refined baccarat reveal and betting visuals: only the newly flipped card receives the flip animation, reveal steps are spaced as Player 1 -> Dealer 1 -> Player 2 -> Dealer 2 -> optional thirds, baccarat bets render as placed chip piles instead of right-side dollar labels, and visible Player/Dealer totals update beside each row. Verified the seeded visual test reports exactly one `.playing-card.revealed` during the first flip and no browser errors.
- Added clean-table reset behavior for Blackjack, Baccarat, and Yahtzee when leaving/re-entering from the menu and when closing completed-hand/game popups. Active Blackjack/Baccarat bets are refunded if the player exits before the round starts; settled result cards/chips clear after `Next Hand` / `Play Again`.
- Fixed JOKU deselection: a selected card can only be removed if the remaining selected cards stay connected by the one-card adjacency rule. Verified with `codex-reset-joku-test.js`, which checks Blackjack/Baccarat reset/refund, Yahtzee re-entry reset, and blocked JOKU chain-breaking deselection.
- Fixed slot `ABOVE` and `BELOW` patterns to match the poster arrows: `ABOVE` is a 1-3-5 upward arrow and `BELOW` is a 5-3-1 downward arrow. Reduced the high-pattern boost from 20% to 8% so higher combinations are only slightly more likely.
- Replaced the menu side panel's "Two tables, one wallet" box with two leaderboard cards: one for balance and one for XP. Each shows the top 3 first and expands with a `See more` toggle.
- Added account settings UI from the signed-in header state: players can now open Settings to change username, change password, delete the account, and toggle whether their account is public on the leaderboards. Public is the default.
- Added leaderboard refresh hooks on initial load, login/logout, settings save, and returning to the menu so leaderboard data gets re-fetched when players come back to the main page.
- Updated `supabase-wallet.sql` with an `is_public` field plus new RPCs for `get_public_leaderboards`, `update_player_settings`, and `delete_player_account`. `create_player_account` and `login_player_account` now return privacy state too.
- Added leaderboard online presence: public accounts now update `last_seen_at` when a game finishes via `touch_player_presence`, leaderboards return `is_online` when that timestamp is within 1 minute of `now()`, and leaderboard rows show a green online dot. Private accounts still stay off the leaderboard entirely, so their online state is hidden too.
- Replaced automatic leaderboard polling with manual `Refresh` buttons on the leaderboard cards.
- Verified `node --check game.js` passes.
- Ran a browser menu smoke test. The new menu layout rendered, but the leaderboard cards currently show a missing-function Supabase error until the updated SQL migration is applied to the live database.
- Duplicated roulette art to URL-safe filenames (`roulette-table.png`, `roulette-spin.png`) and updated the roulette/menu image references so the deployed wheel overlay no longer depends on space-containing asset paths.

## New TODO

- Apply the updated `supabase-wallet.sql` to the Supabase project before testing leaderboards and settings end-to-end. Until that migration runs, the frontend will report that `public.get_public_leaderboards` does not exist.
- The same SQL migration is also required for the online dot because it adds `last_seen_at` and `touch_player_presence`.

## 2026-05-20 Later

- Added Plinko, Crash, and Minesweeper as menu games.
- Plinko and Crash use the shared wallet/chip tray, refund unstarted bets on exit, award XP after resolved rounds, and bias expected value below 1.0 for a real-house casino feel.
- Minesweeper is free play with no wallet loss, a first-click-safe 9x9 board, flags, flood reveal, and XP only on a completed board.
- Added text-state coverage for all three new games and verified `node --check game.js` passes.
- Ran `codex-new-games-visual-test.js` with a seeded $100 wallet: Plinko bet/drop resolved, Crash launched/cashed out, Minesweeper opened and revealed cells, screenshots were inspected, and no browser errors were reported.
- Tuned follow-up feedback: Crash now launches from 0x with a slower ramp and a minimum crash point before losses can occur, Plinko generates a center-origin path with faster eased/bouncy movement, and Minesweeper now pays $1 per safe tile via a points/cash-out rail while mines forfeit uncashed points.
- Re-ran verification after the tuning: `node --check game.js`, seeded `codex-new-games-visual-test.js`, and the Playwright web-game client opening Minesweeper all passed. The web-game client still reports the pre-existing single 404 resource noise.
- Fixed Crash cash-out feedback: the button is enabled during the whole flight, including before 1x, and early cash-out settles as a partial payout/loss. Reworked Plinko into a 16-row, 17-bin board with a 10x/5x/3x/2x/1x/0.8x/0.5x/0.2x/0x mirrored payout ladder and a many-frame center-origin falling path.
- Verified the follow-up with `node --check game.js`, `codex-new-games-visual-test.js` including a mid-drop Plinko screenshot, and the Playwright web-game client opening Plinko. The only browser-client console entry remains the known 404 resource noise.
- Hardened Crash cash-out reliability: cash out now also fires on pointer-down while the plane is flying, so frequent multiplier re-renders cannot swallow the click between mouse down/up. `codex-crash-cashout-reliability-test.js` verifies both immediate 0x cash-out and above-1x cash-out before the crash point.
