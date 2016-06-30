var Bot = require('botkit');
var request = require('request');
var cheerio = require('cheerio');

var FxBot = function Contstuctor(settings){
  this.fxBot = new Bot.slackbot(settings)
  this.fxBot.spawn(settings).startRTM();
  this.config = {
    whenMessages: ['direct_message','direct_mention','mention', 'message_received']
  }
  this._getFx = this._getFx;
}

FxBot.prototype.run = function() {
  this.fxBot.hears('dollar', this.config.whenMessages, this._onHearsDollar);
  this.fxBot.hears('pounds', this.config.whenMessages, this._onHearsPounds);
  this.fxBot.hears('euro', this.config.whenMessages, this._onHearsEuro);
}

FxBot.prototype._onHearsDollar = function(bot,message){
  getFx('dollar', bot, message);
}

FxBot.prototype._onHearsPounds = function(bot,message){
  getFx('pounds', bot, message);
}

FxBot.prototype._onHearsEuro = function(bot,message){
  getFx('euro', bot, message);
}

function getFx(currency, bot, message){
  var url = 'http://abokifx.com/';
  console.log('Fetching '+ currency +'...');
  bot.reply(message, 'Fetching '+ currency +'...');
  request(url, function(error, response, html){
    var rate, notUnderstood;
    if(!error){
      var $ = cheerio.load(html);
      switch (currency) {
        case 'dollar':
          rate = $('.entry-content').find('table').first().find('tr:nth-child(3)').find('td:nth-child(2)').text();
          break;
        case 'pounds':
          rate = $('.entry-content').find('table').first().find('tr:nth-child(3)').find('td:nth-child(3)').text();
          break;
        case 'euro':
          rate = $('.entry-content').find('table').first().find('tr:nth-child(3)').find('td:nth-child(4)').text();
          break;
      }
      bot.reply(message, 'BUY/SELL: ' + rate);
    } else {
      bot.reply(message, 'An error occured: ' + error);
    }
  });
}

module.exports = FxBot;
