const http = require("http");
const Queue = require("bull");

const port = process.env.PORT || 5000;
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const workQueue = new Queue("matrix", REDIS_URL);

const router = function (request, response) {
  if (request.url === "/matrix" && request.method === "POST") {
    // Check access
    if (request.headers["authorization"] !== process.env.M0RPHEUS) {
      respondWith(response, 401, "Access failed. Wrong authentication code.");

      return;
    }

    const body = [];

    request.on("data", (chunk) => {
      body.push(chunk);
    }).on("end", async () => {
      const data = JSON.parse(body.toString());
      workQueue.add(data);

      respondWith(response, 202, "Successfully added to the Queue!");
    }).on("error", (error) => {
      console.error(error);

      respondWith(response, 500);
    });
  } else {
    respondWith(response, 404);
  }
};

function respondWith(response, statusCode, statusMessage = "") {
  response.writeHead(statusCode);
  response.end(statusMessage);
}

http.createServer(router).listen(port, () => {
  console.log(`Server started and listening to port ${port}...`);
});
