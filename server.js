import http from "http";

const PORT = process.env.PORT;
const server = http.createServer(async function cb(req, res) {});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});
