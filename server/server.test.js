import assert from "node:assert/strict";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";

import { MockAgent, setGlobalDispatcher } from "undici";

import { server } from "./server.js";

const PORT_TEST = 5001;
const PROXY_URL = `http://localhost:${PORT_TEST}/api/giphy-proxy`;

describe("Giphy proxy API", () => {
    /** @type {import("http").Server} */
    let listeningServer;
    /** @type {MockAgent} */
    let agent;

    before(() => {
        // mock env variable
        process.env.GIPHY_KEY = "TEST_KEY";
        // start the server
        listeningServer = server.listen(PORT_TEST);
    });

    beforeEach(() => {
        agent = new MockAgent();
        // agent.disableNetConnect(); // do not send any real requests
        setGlobalDispatcher(agent);
    });

    after(() => {
        listeningServer.close();

        delete process.env.GIPHY_KEY;
    });

    afterEach(() => {
        agent.assertNoPendingInterceptors();
    });

    // successful requests
    it("should proxy the search request and Undici mock should intercept Giphy API req", async () => {
        const giphySearch = "Dogs";
        const giphyLimit = 20;
        const mockData = {
            data: [
                {
                    type: "gif",
                    id: "mockdogid1",
                },
            ],
        };

        agent
            .get(`https://api.giphy.com`)
            .intercept({
                path: `/v1/gifs/search?api_key=${process.env.GIPHY_KEY}&q=${giphySearch}&limit=${giphyLimit}`,
                method: "GET",
            })
            .reply(200, mockData);

        // call my proxy server
        const response = await fetch(PROXY_URL, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                searchValue: "Dogs",
            }),
        });
        const responseData = await response.json();

        assert.strictEqual(
            response.status,
            200,
            "Proxy API should return HTTP 200 OK",
        );

        assert.deepStrictEqual(
            responseData,
            mockData,
            "Proxy should return the fake Giphy response data",
        );
    });
});
