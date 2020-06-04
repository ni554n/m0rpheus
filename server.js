const http = require("http");
const Queue = require("bull");

const port = process.env.PORT || 5000;
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const workQueue = new Queue("matrix", REDIS_URL);

const router = function (request, response) {
  if (request.headers["authorization"] !== process.env.M0RPHEUS) {
    response.writeHead(401);
    response.end("Contact ni554n for authentication code.");

    return;
  }

  if (request.url === "/matrix" && request.method === "POST") {
    const body = [];

    request.on("data", (chunk) => {
      body.push(chunk);
    }).on("end", async () => {
      const data = JSON.parse(body.toString());
      workQueue.add(data);

      response.statusCode = 202;
      response.end("Successfully added to the Queue!");
    }).on("error", (error) => {
      console.error(error);

      response.statusCode = 500;
      response.end();
    });
  } else {
    response.writeHead(404);
    response.end();
  }
};

http.createServer(router).listen(port, () => {
  console.log("Entered into the matrix...");
});
