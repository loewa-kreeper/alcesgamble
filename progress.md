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

## TODO

- Playtest the drag/drop chip flow, sprite button hit areas, keyboard fallback, and roulette spin settlement.
- Blackjack screen rendering is verified, but the full blackjack round flow still needs a deeper browser playtest because the current automated client is weak at drag interactions on non-canvas UIs.
- There is still one residual 404 in browser console during automated runs; likely an extra icon request worth tracing later if it becomes noisy.
- Consider adding split/street/corner bets if the next request wants a denser casino-accurate table.
