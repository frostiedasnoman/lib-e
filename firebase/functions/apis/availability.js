const callAPI = require("../api_client");
const availabilityUrl = "https://5rk6wzqvia.execute-api.us-east-1.amazonaws.com/Beta";

function availability(resources) {
    let params = buildParams(resources);

    //TODO
    // return callAPI(searchUrl, buildQuery(parameters))
    //     .then(resp => {
    //         Promise.resolve();
    //     })
    //     .catch(error => {
    //         console.log(error);
    //         Promise.resolve();
    //     });
}

function buildParams(resources) {
    array_of_arrs = resources.map(res => {
        return res.holdingsInformations.map(holding => {
            return { itemIdentifier: holding.barcode, resourceId: res.id }
        })
    });
    return [].concat(...array_of_arrs);
}

module.exports = { availability, buildParams };