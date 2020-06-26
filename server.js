const http = require("http");
const Queue = require("bull");

const PORT = process.env.PORT || 5000;
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const QUEUE_NAME = process.env.QUEUE_NAME || "queue";

const workQueue = new Queue(QUEUE_NAME, REDIS_URL);

const router = function (request, response) {
  if (request.url === "/matrix" && request.method === "POST") {
    // Raw JSON body: { "accessKey": string, "trackUrl": string }
    const body = [];

    request.on("data", (chunk) => {
      body.push(chunk);
    }).on("end", async () => {
      const { accessKey, trackUrl } = JSON.parse(body.toString());

      // Check for authorization
      if (accessKey !== process.env.M0RPHEUS_ACCESS_KEY) {
        respondWith(response, 401, "Access failed. Wrong authentication code.");

        return;
      }

      workQueue.add(trackUrl);

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

http.createServer(router).listen(PORT, () => {
  console.log(`Server started and listening to port ${PORT}...`);
});
