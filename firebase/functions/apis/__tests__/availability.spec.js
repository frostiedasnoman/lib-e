const { buildParams } = require("../availability");

test("parses the search result into availability params", async () => {
    let params = buildParams(
        [
            { id: 12345, holdingsInformations: [
                { barcode: "N9876543" },
                { barcode: "N981234" }
            ]}
        ]);
    expect(params).toEqual([
        { itemIdentifier: "N9876543", resourceId: 12345 },
        { itemIdentifier: "N981234", resourceId: 12345 }
    ]);
});