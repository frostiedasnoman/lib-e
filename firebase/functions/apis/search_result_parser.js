function parse_results(data) {
  let results = { total_results: 0, items: []}
  if(data.totalHits > 0) {
    results.total_results = data.totalHits;
    for (var resource of data.resources) {
      items.push({ title: resource.shortTitle, author: readibleAuthor(resource.shortAuthor), call_number: item.callNumber });
    }
  }
  return buildResultResponse(results);
}

function readibleAuthor(commaAuthor) {
  if (commaAuthor) {
    let array = commaAuthor.split(",");
    array.reverse;
    return `by ${array[1]} ${array[0]}`;
  }
  return null;
}

function buildResultResponse(results) {
  switch (results.total_results) {
    case 0:
      return `There are 0 results for your query`;
    case 1:
      let item = results.items[0]
      return `There is a copy of ${item.title} in the ${item.call_number} section. Other editions are out on loan`;
    default: `DEF`
  }
}

module.exports = parse_results;
