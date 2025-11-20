import http from "node:http";

import { setCors } from "./utils/set-cors.js";

const server = http.createServer();

server.on("request", async (req, res) => {
    setCors(res);
    // handle pre-flight request
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();

        return;
    }

    if (req.method !== "POST" || req.url !== "/api/giphy-proxy") {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end("Not found");

        return;
    }

    try {
        let body = "";

        for await (let chunk of req) {
            body += chunk;
        }

        const { searchValue } = JSON.parse(body);
        const giphySearch = encodeURIComponent(searchValue);
        const giphyLimit = 20;
        const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_KEY}&q=${giphySearch}&limit=${giphyLimit}`;
        const giphyResponse = await fetch(giphyUrl);
        const giphyData = await giphyResponse.json();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(giphyData));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                error: "Server error",
            }),
        );
    }
});

// server.listen(process.env.PORT, () => {
//     console.log(`Server listening on port ${process.env.PORT}.`);
// });
export { server };
