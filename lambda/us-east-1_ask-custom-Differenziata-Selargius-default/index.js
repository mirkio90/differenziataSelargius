/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const days = require('./days');

const helpers = require('./helpers');
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
    var speechText = "";
    try {
      var rifiuto = handlerInput.requestEnvelope.request.intent.slots.Tipologia.value;
      speechText = helpers.RubbishHelper.getNextDayRubbish(rifiuto);
    } catch (error) {
      console.log("Error in TipoHandler: " + error)
      speechText = "Scusami, non ho capito per quale tipologia di rifiuti stai chiedendo il ritiro. Le tipologie accettate sono: carta, vetro, plastica, secco e umido!"
    }
    

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
    try {
      var giorno = handlerInput.requestEnvelope.request.intent.slots.Giorno.value;
    var speechText = "il giorno inserito non è valido, prova a chiedermi cosa passerà domani o in un giorno della settimana!";
    
    if (days.days.indexOf(giorno) != -1) {
      if(giorno == "domani"){
        speechText = helpers.DaysHelper.getTomorrowRubbish();
      }
      else{
        speechText = helpers.DaysHelper.getSpecificDayRubbish(giorno);
      }
    }
    } catch (error) {
      console.log("Error in TipoHandler: " + error)
      speechText = "Scusa, non ho ben capito cosa intendi dire, prova a chiedermi un giorno valido o un rifiuto riconosciuto!"
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

const HelpHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    var speechText = 'prova a chiedermi cosa passerà domani, in un qualsiasi giorno della settimana o quando verrà ritirato qualche tipo di rifiuto!'

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Differenziata Selargius 2019', speechText)
      .reprompt(speechText)
      .getResponse();
  },
}

/* LAMBDA SETUP */
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    TipoHandler,
    GiornoHandler,
    CancelAndStopIntentHandler,
    HelpHandler,
    SessionEndedRequestHandler
  )
  //.addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
