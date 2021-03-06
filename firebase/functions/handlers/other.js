const search = require('../apis/search');

function otherSearch(agent, parameters) {

    console.log("otherSearch");
      console.log(parameters);
  return search((data) => {
    agent.add(`There are ${data.totalHits} results for your query:`);
    for (var resource of data.resources) {
      agent.add([resource.shortTitle, readibleAuthor(resource.shortAuthor)].join(" "));
    }
  }, parameters);

  function readibleAuthor(commaAuthor) {
      if(commaAuthor) {
          let array = commaAuthor.split(",");
          array.reverse;
          return `by ${array[1]} ${array[0]}`;
      }
      return null;
  }
}

module.exports = otherSearch;
