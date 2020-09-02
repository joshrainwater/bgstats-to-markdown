# Convert a BGStats export to Markdown
Quick story: I used to use a straight Markdown file to store all my board game plays, and I took the time (a very very long time) to convert all of them over to BGStats ([iOS](https://apps.apple.com/us/app/board-game-stats/id892542000))([Android](https://play.google.com/store/apps/details?id=nl.eerko.boardgamestats&hl=en_US)). I still wanted to keep around a markdown table sometimes just to archive as a text document or share or something, so I made this.

## To get a markdown table.
1. Add `BGStatsExport.json` to the root.
2. Run `node go.js`
3. Save `output.md` somewhere.
