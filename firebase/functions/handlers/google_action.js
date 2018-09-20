const { SimpleResponse } = require('actions-on-google');
const search = require('../apis/search');

function googleAssistantHandler(agent, parameters) {
  // console.log("googleAssistantHandler");
  return search(agent, (data) => {
    let conv = agent.conv(); // Get Actions on Google library conv instance
    let str = `There are ${data.totalHits} results for your query. Would you like me to list them all?`;
    conv.ask(new SimpleResponse({
      speech: str,
      text: str,
    }));
    agent.add(conv);
  }, parameters);
}

module.exports = googleAssistantHandler;
