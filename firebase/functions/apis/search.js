const callAPI = require("../api_client");
const searchUrl = "https://5rk6wzqvia.execute-api.us-east-1.amazonaws.com/Beta";
// axios.defaults.baseURL = 'https://5rk6wzqvia.execute-api.us-east-1.amazonaws.com';
const parse_results = require("./search_result_parser");

function search(onSuccess, parameters) {
  return callAPI(searchUrl, buildQuery(parameters))
    .then(resp => {
      let s = parse_results(resp.data);
      console.log(resp.data);
      onSuccess(s);
      Promise.resolve();
    })
    .catch(error => {
      console.log(error);
      Promise.resolve();
    });

  function buildQuery(parameters) {
    const query = {
      searchTerm: buildSearchTerm(parameters),
      startIndex: 0,
      hitsPerPage: 12,
      facetFilters: buildFacetFilters(parameters),
      branchFilters: buildBranchFilters(parameters),
      sortCriteria: "Relevancy",
      targetAudience: "",
      addToHistory: false,
      dbCodes: []
    };
    console.log("------------stringify------------");
    let j = JSON.stringify(query);
    console.log(j);
    return j;
  }

  function buildFacetFilters(parameters) {
    let array = [];
    for (let key of ["magazine", "movie", "digital", "music", "book"]) {
      let type = parameters[key];
      if (type) {
        array.push(facetFilter(type));
      }
    }
    console.log(array);
    return array;
  }

  function facetFilter(type) {
    let key = facetMap[type];
    return {
      facetDisplay: key,
      facetValue: key,
      facetName: "Format"
    };
  }

  function buildBranchFilters(parameters) {
    return [
      "1",
      "2",
      "3",
      "4",
      "5",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "28",
      "34",
      "6"
    ];
  }

  function buildSearchTerm(parameters) {
    return JSON.stringify({
      isAnd: true,
      searchTokens: [
        authorSearchTerm(parameters.author, parameters.Author1),
        strSearchTerm(parameters.title, "Title"),
        strSearchTerm(parameters.keyword, "Subject")
      ].filter(obj => obj)
    });
  }

  function authorSearchTerm(authorFirst, authorLast) {
    if (isPresent(authorFirst) || isPresent(authorLast)) {
      return {
        searchString: [authorFirst, authorLast].join(" "),
        type: "Contains",
        field: "Author"
      };
    }
    return null;
  }

  function strSearchTerm(str, fieldName) {
    if (isPresent(str)) {
      return {
        searchString: str,
        type: "Contains",
        field: fieldName
      };
    }
    return null;
  }

  function isPresent(value) {
    return typeof value === "string" && value.length > 0;
  }

  const facetMap = {
    magazine: "Magazine",
    movie: "DVD",
    music: "Music CD",
    book: "Book",
    digital: "Electronic Resource"
  };

  const location = {
    central: [1, 2, 3, 4, 5, 6],
    brooklyn: [7],
    "cummings park": [8],
    "island bay": [9],
    jonsonvile: [10],
    karori: [11],
    khandallah: [12],
    kilbirnie: [13],
    miramar: [14],
    newtown: [15],
    tawa: [16],
    wadestown: [17]
  };
}

module.exports = search;
