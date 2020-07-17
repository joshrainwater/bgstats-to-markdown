const fs = require('fs');

if(!process.argv[2]) {
    console.error('No filename provided');
    process.exit(1);
}

let bgData = require(`./${process.argv[2]}`);
let mdString = makeBGMarkdownTable(bgData, 'table.md');

fs.writeFileSync('table.md', mdString);

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

        let date = play.playDate.substring(0,10);
        let game = gamesById[`${play.gameRefId}`];
        if(play.board) { game+= ` [${play.board}]`}
        let location = (play.locationRefId) ? locationsById[play.locationRefId] : '';

        let players = [];
        let winners = [];
        play.playerScores.forEach(score => {
            let name = playersById[score.playerRefId];
            if(score.role) {
                name += ` (${score.role})`;
            }
            if(score.score) {
                players.push(`${name} ${score.score}`);
            } else {
                players.push(`${name}`);
            }
            if(score.winner) {
                winners.push(name);
            }
        });

        if(!winners.length) {
            winners.push('Lost');
        }

        plays.push(`${date} | ${game} | ${location} | ${players.join(', ')} | ${winners.join(', ')}`);

    });

    return prettyFile.concat(plays.reverse()).join('\n');
}