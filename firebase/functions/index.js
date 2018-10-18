'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const googleAssistantSearch = require('./handlers/google_action');
const otherSearch = require('./handlers/other');

process.env.DEBUG = 'dialogflow:debug';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    const queryResult = JSON.stringify(request.body.queryResult);

    function welcome(agent) {
        agent.add(`Welcome to Lib E!`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function googleAssistantHandler(agent) {
      return googleAssistantSearch(agent, request.body.queryResult.parameters);
    }

    function otherHandler(agent) {
      return otherSearch(agent, request.body.queryResult.parameters);
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    if (agent.requestSource === agent.ACTIONS_ON_GOOGLE) {
        intentMap.set('FindBookIntent', googleAssistantHandler);
    } else {
        intentMap.set('FindBookIntent', otherHandler);
    }
    agent.handleRequest(intentMap);
});
