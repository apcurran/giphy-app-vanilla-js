import assert from "node:assert/strict";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";

import { MockAgent, setGlobalDispatcher } from "undici";

import { server } from "./server.js";

const PORT_TEST = 5001;
const PROXY_URL = `http://localhost:${PORT_TEST}/api/giphy-proxy`;

describe("Giphy proxy API", () => {
    let listeningServer;
    let agent;

    before(() => {
        // mock env variable
        process.env.GIPHY_KEY = "TEST_KEY";
        // start the server
        listeningServer = server.listen(PORT_TEST);
    });

    beforeEach(() => {
        agent = new MockAgent();
        agent.disableNetConnect(); // do not send any real requests
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
    it("should proxy the search request and Undici mock should intercept Giphy API req", async () => {});
});
