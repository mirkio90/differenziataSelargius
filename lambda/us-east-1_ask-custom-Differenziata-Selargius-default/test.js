const data = require('./values');
const days = require('./days');
const garbages = require('./garbages');
const helpers = require('./helpers');
var moment = require('moment');
var mom = moment();
mom.locale('it');
var today = moment().locale('it');
var tomorrow = moment().locale('it').add(1, 'day');

console.log(helpers.RubbishHelper.getNextDayRubbish('plastica'))