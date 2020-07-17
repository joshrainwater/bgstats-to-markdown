const fs = require('fs');

if(!process.argv[2]) {
    console.error('No filename provided');
    process.exit(1);
}
fs.writeFileSync('output.md', makeBGMarkdownTable(require(`./${process.argv[2]}`), 'output.md'));

function makeBGMarkdownTable(bgData, fileName) {

    return [ // Titles
        '# Board Game Tick List', '',
        'Date | Game | Location | Players | Winner |',
        '--- | --- | --- | --- | --- |'
    ].concat(bgData.plays.map((play) => {

        let game = bgData.games.filter(g => g.id == play.gameRefId)[0].name;
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

        return [
            play.playDate.substring(0,10), //date,
            (play.board) ? game + ` [${play.board}]` : game, // game
            (play.locationRefId) ? bgData.locations.filter(g => g.id == play.locationRefId)[0].name : '', // location
            players.join(', '), // players
            winners.join(', ') // winner(s)
        ].join(' | ');
    }).reverse()).join('\n');
}