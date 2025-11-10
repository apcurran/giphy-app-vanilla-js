import http from "node:http";

const server = http.createServer();

server.on("request", async (req, res) => {
    // handle CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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

        const { searchValue, limit } = JSON.parse(body);
    } catch (error) {
        console.error(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                error: "Server error",
            }),
        );
    }

    // handle correct requests
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
        JSON.stringify({
            data: "Hello World!",
        }),
    );
});

server.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}.`);
});
