'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const { SimpleResponse } = require('actions-on-google');
const axios = require('axios');
const searchUrl = 'https://5rk6wzqvia.execute-api.us-east-1.amazonaws.com/Beta';
const availabilityUrl = 'https://5rk6wzqvia.execute-api.us-east-1.amazonaws.com/Beta'
// axios.defaults.baseURL = 'https://5rk6wzqvia.execute-api.us-east-1.amazonaws.com';
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
axios.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';
 
process.env.DEBUG = 'dialogflow:debug';
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    const queryResult = JSON.stringify(request.body.queryResult);
    
    function lookup(agent, onSearchSuccess) {
        search()
    }
    
    function search(agent, onSuccess) {
        return callAPI()
        .then((resp) => {
            onSuccess(resp.data);
            Promise.resolve();
        })
        .catch((error) => {
            console.log(error);
            Promise.resolve();
        });
    } 
    
    function callAPI() {
        return axios({
            method:'post',
            url: searchUrl,
            responseType:'json',
            data: buildQuery(request.body.queryResult.parameters)
            // data: `{\"searchTerm\":\"${ queryResult.title }\",\"startIndex\":0,
            //\"hitsPerPage\":12,\"facetFilters\":[],
            //\"branchFilters\":[\"1\",\"2\",\"3\",\"4\",\"5\",\"7\",\"8\",\"9\",\"10\",\"11\",\"12\",\"13\",\"14\",\"15\",\"16\",\"17\",\"28\",\"34\",\"6\"],
            //\"sortCriteria\":\"Relevancy\",\"targetAudience\":\"\",\"addToHistory\":true,\"dbCodes\":[]}`
        })
    }
    
    function readibleAuthor(commaAuthor) {
        if(commaAuthor) {
            let array = commaAuthor.split(",");
            array.reverse;
            return `by ${array[1]} ${array[0]}`;
        }
        return null;
    }

    function googleAssistantHandler(agent) {
        console.log("googleAssistantHandler");
        return search(agent, (data) => {
            let conv = agent.conv(); // Get Actions on Google library conv instance
            let str = `There are ${data.totalHits} results for your query. Would you like me to list them all?`;
            conv.ask(new SimpleResponse({
              speech: str,
              text: str,
            }));
            agent.add(conv);
        });
    }

    function otherHandler(agent) {
        return search(agent, (data) => {
            agent.add(`There are ${data.totalHits} results for your query:`);
            for(var resource of data.resources) {
                agent.add([resource.shortTitle, readibleAuthor(resource.shortAuthor)].join(" "));
            }
        });
    }
    
    function buildQuery(parameters) {
        const query = {
        	searchTerm: buildSearchTerm(parameters),
            startIndex: 0,
            hitsPerPage: 12,
            facetFilters: buildFacetFilters(parameters),
            branchFilters: buildBranchFilters(parameters),
            sortCriteria:"Relevancy",
            targetAudience:"",
            addToHistory:false,
            dbCodes:[]
        };
        console.log("------------stringify------------");
        let j = JSON.stringify(query);
        console.log(j);
        return j;
    }
    
    function buildFacetFilters(parameters) {
        let array = [];
        for(let key of ["magazine", "movie", "digital", "music", "book"]) {
            let type = parameters[key];
            if(type) {
                array.push(facetFilter(type));
            }
        }
        console.log(array);
        return array;
    }
    
    function facetFilter(type) {
        let key = facetMap[type];
        return {facetDisplay: key, facetValue: key, facetName: "Format"};
    }
    
    function buildBranchFilters(parameters) {
        return ["1","2","3","4","5","7","8","9","10","11","12","13","14","15","16","17","28","34","6"];
    }
    
    function buildSearchTerm(parameters) {
            return JSON.stringify({
              	isAnd: true,
                searchTokens: [
                	authorSearchTerm(parameters.author, parameters.Author1),
                    strSearchTerm(parameters.title, "Title"),
                    strSearchTerm(parameters.keyword, "Subject")
                ].filter((obj) => obj )
            });
    }
    
    function authorSearchTerm(authorFirst, authorLast) {
        if(authorFirst || authorLast) {
            return {
                  	searchString: [authorFirst, authorLast].join(" "),
                    type: "Contains",
                    field: "Author"
                }
        }
        return null;
    }
    
    function strSearchTerm(str, fieldName) {
        if(str) {
            return {
                  	searchString: str,
                    type: "Contains",
                    field: fieldName
                }
        }
        return null;
    }
    
    // let str = `{"searchTerm":"{\"isAnd\":true,\"searchTokens\":[{\"searchString\":\"author_str\",\"type\":\"Contains\",\"field\":\"Author\"},{\"searchString\":\"title_str\",\"type\":\"Contains\",\"field\":\"Title\"},{\"searchString\":\"subject_str\",\"type\":\"Contains\",\"field\":\"Subject\"}]}","startIndex":0,"hitsPerPage":12,"facetFilters":[],"branchFilters":["1","2","3","4","5","7","8","9","10","11","12","13","14","15","16","17","28","34","6"],"sortCriteria":"Relevancy","targetAudience":"","addToHistory":false,"dbCodes":[]}`;
    
    function welcome(agent) {
        agent.add(`Welcome to Lib E!`);
    }
 
    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }
    
    const facetMap = {
        magazine: "Magazine",
        movie: "DVD",
        music: "Music CD",
        book: "Book",
        digital: "Electronic Resource"
    };
    
    const location = {
        "central" : [1,2,3,4,5,6],
        "brooklyn" : [7],
        "cummings park" : [8],
        "island bay" : [9],
        "jonsonvile" : [10],
        "karori" : [11],
        "khandallah" : [12],
        "kilbirnie" : [13],
        "miramar" : [14],
        "newtown" : [15],
        "tawa" : [16],
        "wadestown" : [17]
    };

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
