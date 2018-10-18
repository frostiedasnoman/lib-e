const search_result_parser = require("../search_result_parser");

test("returns a response for no results", async () => {
  let resp = search_result_parser({})
  expect(resp).toEqual("There are 0 results for your query");
});

test("returns a response when there is 1 response", async () => {
  let resp = search_result_parser({totalHits: 1, resources: [{shortTitle: 'bananas', shortAuthor: 'DeVito, Danny', callNumber: 'Fiction'}]})
  expect(resp).toEqual("There is a copy of bananas in the Fiction section. Other editions are out on loan");
});