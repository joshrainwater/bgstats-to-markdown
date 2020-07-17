const fs = require('fs');

if(!process.argv[2]) {
    console.error('No filename provided');
    process.exit(1);
}

let bgData = require(`./${process.argv[2]}`);
let mdString = makeBGMarkdownTable(bgData, 'output.md');

fs.writeFileSync('output.md', mdString);

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
        '# Board Game Tick List',
        '',
        'Date | Game | Location | Players | Winner |',
        '--- | --- | --- | --- | --- |'
    ];
    let plays = [];
    bgData.plays.forEach((play) => {

        let row = [
            play.playDate.substring(0,10), //date,
            bgData.games.filter(g => g.id == play.gameRefId)[0].name, // game
            (play.locationRefId) ? locationsById[play.locationRefId] : '' // location
            // players & scores
            // winner(s)
        ];
        if(play.board) { row[1] += ` [${play.board}]`}

        let players = [];
        let winners = [];
        play.playerScores.forEach(score => {
            let name = bgData.players.filter(g => g.id == score.playerRefId)[0].name
            if(score.role) {
                name += ` [${score.role}]`;
            }
            if(score.score) {
                players.push(`${name} ${score.score}`);
            } else {
                players.push(`${name}`);
            }
        });

        if(!winners.length) {
            winners.push('Lost');
        }
        row.push(players.join(', '));
        row.push(winners.join(', '));

        plays.push(row.join(' | '));
    });

    return prettyFile.concat(plays.reverse()).join('\n');
}