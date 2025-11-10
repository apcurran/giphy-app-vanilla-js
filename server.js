import http from "http";

const server = http.createServer(async function getGiphyData(req, res) {});

server.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}.`);
});
