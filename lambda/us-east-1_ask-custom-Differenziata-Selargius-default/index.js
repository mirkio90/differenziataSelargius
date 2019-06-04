/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const data = require('./values');
const moment = require('moment');
var mom = moment();
mom.locale('it');
var today = moment().locale('it');
var tomorrow = moment().locale('it').add(1, 'day');


/* INTENT HANDLERS */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
      const speechText = 'Ciao! ti aiuterò a gestire la raccolta differenziata nel comune di Selargius! Chiedimi cosa raccoglieranno in uno specifico giorno!';
      return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .withSimpleCard('Differenziata Selargius 2019', speechText)
          .getResponse();
  }
};

const TipoHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TipoIntent';
  },
  handle(handlerInput) {

    const speechText = 'Questa funzionalità non arriverà presto, per ora chiedimi pure cosa passa nei diversi giorni della settimana!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Differenziata Selargius 2019', speechText)
      .getResponse();
  },
};

const GiornoHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GiornoIntent';
  },
  handle(handlerInput) {

    var giorno = handlerInput.requestEnvelope.request.intent.slots.Giorno.value;
    var speechText = "";

    if(giorno == "domani"){
      speechText = DaysHelper.getTomorrowRubbish();
    }
    else{
      speechText = DaysHelper.getSpecificDayRubbish(giorno);
    }


    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Differenziata Selargius 2019', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Differenziata Selargius 2019', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Scusa, non ho capito il tuo comando, per favore prova nuovamente spiegandoti meglio!')
      .reprompt('Scusa, non ho capito il tuo comando, per favore prova nuovamente spiegandoti meglio!')
      .getResponse();
  },
};

/* Helper Functions */

var DaysHelper = {
  getCurrentMonthName() {
    return today.format('MMMM');
  },
  getCurrentDayName() {
    return today.format('ddd');
  },
  getCurrentDay() {
    return today.toDate().getDate()
  },
  getTomorrowDayName() {
    return tomorrow.format('ddd');
  },
  getTomorrowDay() {
    return tomorrow.toDate().getDate()
  },
  getRubbishArray(monthName, dayName, dayNumber) {
    var month = data[monthName];
    console.log("current month: " + monthName);
    console.log("requested day: " + dayName + ", " + dayNumber);
    var day = month[dayName];
    console.log("current day rubbish: ");
    console.log(day);

    rubArray = [];

    for(var rub in day) {
      if(rub != undefined && day[rub].indexOf(dayNumber) != -1) { 
        rubArray.push(rub);
      }
    }

    return rubArray;
  },
  getTomorrowRubbish() {
    console.log("entering getTomorrowRubbish method");

    var monthName = this.getCurrentMonthName();
    var dayName = this.getTomorrowDayName();
    var dayNumber = this.getTomorrowDay();

    var rubArray = this.getRubbishArray(monthName, dayName, dayNumber);

    //TODO formattare il risultato
    var stringRub = this.formatResult(rubArray, tomorrow.format('dddd'))

    console.log(stringRub);
    return stringRub;
  },
  getSpecificDayRubbish(specificDay) {
    console.log("entering getSpecificDayRubbish method");

    if (mom.isoWeekday(specificDay).isoWeekday() <= today.isoWeekday() ) {
      console.log("adding one week to requested day");
      mom.add(1, 'week');
    }
    console.log("requested date: " + mom.toDate());
    
    var rubArray = this.getRubbishArray(mom.format('MMMM'), mom.format('ddd'), mom.toDate().getDate());

    var stringRub = this.formatResult(rubArray, mom.format('dddd'))

    return stringRub;
  },
  formatResult(rubArray, dayName) {
    stringRub = dayName;
    if(rubArray.length == 1) {
      stringRub += " passa";

      switch (rubArray[0]) {
        case 'plastica':
        case 'carta':
          stringRub += (" la " + rubArray[0]);
          break;
        case 'secco':
        case 'vetro':
          stringRub += (" il " + rubArray[0]);
          break;
        case 'umido':
          stringRub += " l'umido";
          break;
        default:
          break;
      }
    }
    else if(rubArray.length > 1) {
      stringRub += " passano";

      for(var i = 0; i<rubArray.length; i++) {
        if (i != 0) {
          stringRub += " e"
        }
        stringRub += " " + rubArray[i];
      }
    }
    else {
      stringRub += " non è previsto il ritiro dei rifiuti";
    }

    console.log(stringRub);
    return stringRub;
  }
}

/* LAMBDA SETUP */
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    TipoHandler,
    GiornoHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  //.addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
