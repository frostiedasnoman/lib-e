function parse_results(data) {
  let results = { total_results: 0, items: []}
  if(data.totalHits > 0) {
    results.total_results = data.totalHits;
    for (var resource of data.resources) {
      items.push({ title: resource.shortTitle, author: readibleAuthor(resource.shortAuthor), call_number: item.callNumber });
    }
  }
  return results;
}

function readibleAuthor(commaAuthor) {
  if (commaAuthor) {
    let array = commaAuthor.split(",");
    array.reverse;
    return `by ${array[1]} ${array[0]}`;
  }
  return null;
}

module.exports = parse_results;
