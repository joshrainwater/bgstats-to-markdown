const fs = require('fs');

if(!process.argv[2]) {
    console.error('No filename provided');
    process.exit(1);
}

let bgData = require(`./${process.argv[2]}`);
fs.writeFileSync('output.md', makeBGMarkdownTable(bgData, 'output.md'));

console.log('Done');
process.exit();

function makeBGMarkdownTable(bgData, fileName) {

    let gamesById = {};
    let playersById = {};
    let locationsById = {};
    bgData.games.map((game) =>      { gamesById[game.id] = game.name; });
    bgData.players.map((player) =>  { playersById[player.id] = player.name; });
    bgData.locations.map((loc) =>   { locationsById[loc.id] = loc.name; });
    
    let prettyFile = [
        '# Board Game Tick List', '',
        'Date | Game | Location | Players | Winner |',
        '--- | --- | --- | --- | --- |'
    ];
    let plays = [];
    bgData.plays.forEach((play) => {

        let players = [], winners = [];
        play.playerScores.forEach(score => {
            let name = bgData.players.filter(g => g.id == score.playerRefId)[0].name
            if(score.role) {
                name += ` (${score.role})`;
            }
            players.push([name, score.score].join(' '));
            if(score.winner) {
                winners.push(name);
            }
        });
        if(!winners.length) { winners.push('Lost'); }

        plays.push([
            play.playDate.substring(0,10), //date,
            (play.board) ? bgData.games.filter(g => g.id == play.gameRefId)[0].name + ` [${play.board}]` : bgData.games.filter(g => g.id == play.gameRefId)[0].name, // game
            (play.locationRefId) ? locationsById[play.locationRefId] : '', // location
            players.join(', '), // players
            winners.join(', ') // winner(s)
        ].join(' | '));
    });

    return prettyFile.concat(plays.reverse()).join('\n');
}