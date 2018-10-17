const { SimpleResponse } = require('actions-on-google');
const search = require('../apis/search');

function googleAssistantSearch(agent, parameters) {
  // console.log("googleAssistantSearch");
  return search((results => onSuccess(results), parameters));

  function onSuccess(results){
    let conv = agent.conv(); // Get Actions on Google library conv instance
    let str = buildResultResponse(results);
    conv.ask(new SimpleResponse({
      speech: str,
      text: str,
    }));
    agent.add(conv);
  }

  function buildResultResponse(results) {
    switch (results.total_results) {
      case 0:
        return `There are 0 results for your query`;
      case 1:
      let item = results.items[0]
        return `There is a copy of ${item.title} in the ${item.call_number} section. Other editions are out on loan`;
      default : `DEF`
    }
  }
}

module.exports = googleAssistantSearch;
