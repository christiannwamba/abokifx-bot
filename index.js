var FxBot = require('./src/fx');


var token = process.env.BOT_API_KEY;

var fxBot = new FxBot({
    debug: false,
    token: token
});
console.log('Starting...')
fxBot.run();
