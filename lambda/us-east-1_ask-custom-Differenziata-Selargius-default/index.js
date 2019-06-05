/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const data = require('./values');
const moment = require('moment');
const mom = moment();
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
    var rifiuto = handlerInput.requestEnvelope.request.intent.slots.Tipologia.value;
    const speechText = RubbishHelper.getNextDayRubbish(rifiuto);

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
    const speechText = 'Ciao! E ricorda di portare fuori la spazzatura!';

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

    var speechText = 'Scusa, non ho capito la tua richiesta, ';
    var repromptText = 'prova a chiedermi cosa passerà domani o quando verrà ritirato qualche tipo di rifiuto!'

    return handlerInput.responseBuilder
      .speak(speechText + repromptText)
      .reprompt(repromptText)
      .getResponse();
  },
};

/* Helper Functions */
var CalendarHelper = {
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
    }
}

var DaysHelper = {
  
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

    var monthName = CalendarHelper.getCurrentMonthName();
    var dayName = CalendarHelper.getTomorrowDayName();
    var dayNumber = CalendarHelper.getTomorrowDay();

    var rubArray = this.getRubbishArray(monthName, dayName, dayNumber);

    //TODO formattare il risultato
    var stringRub = this.formatResult(rubArray, tomorrow.format('dddd'))

    console.log(stringRub);
    return stringRub;
  },
  getSpecificDayRubbish(specificDay) {
    var localMoment = require('moment');
    var localMom = localMoment().locale('it');
    console.log("entering getSpecificDayRubbish method");

    if (localMom.isoWeekday(specificDay).isoWeekday() <= today.isoWeekday() ) {
      console.log("adding one week to requested day");
      localMom.add(1, 'week');
    }
    console.log("requested date: " + localMom.toDate());
    
    var rubArray = this.getRubbishArray(localMom.format('MMMM'), localMom.format('ddd'), localMom.toDate().getDate());

    var stringRub = this.formatResult(rubArray, localMom.format('dddd'))

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

var RubbishHelper = {
  getNextDayRubbish(rubbishName){
      var nextDate = this.getDaysValue(rubbishName);
      return this.formatResult(nextDate);
  },
  getDaysValue(rubbishName){
      monthName = CalendarHelper.getCurrentMonthName();
      var localMoment = require('moment');
      var localMom = localMoment().locale('it');
      var found = false;

      var month = data[monthName];
      localMom.add(1, 'day'); 

      console.log("current month: " + monthName);
      while (!found) {
          var dayNumber = localMom.toDate().getDate();
          var dayName = localMom.format('ddd');


          console.log("requested day: " + dayName + ", " + dayNumber);
          searchDay = month[dayName];
          
          if (searchDay[rubbishName] != null && searchDay[rubbishName].indexOf(dayNumber != -1)) {
              break;
          }

          localMom.add(1, 'day'); 
      }

      console.log('next day found: ' + dayName + ", " + dayNumber);
      return localMom;
  },
  formatResult(dayFound){
      var dayName = dayFound.format('dddd');
      var monthName = dayFound.format('MMMM');
      var dayNumber = dayFound.toDate().getDate();

      var stringDay = "il prossimo ritiro previsto sarà " 
      if (dayNumber == CalendarHelper.getTomorrowDay()) {
          stringDay += "domani, "
      }
      stringDay += dayName + " " + dayNumber + " " + monthName;

      return stringDay;
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
