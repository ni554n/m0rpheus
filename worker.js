const throng = require("throng");
const Queue = require("bull");

const downloader = require("./downloader");
const uploader = require("./uploader");

// Connect to a local redis instance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const QUEUE_NAME = process.env.QUEUE_NAME || "queue";

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
const workers = process.env.WEB_CONCURRENCY || 1;

function start() {
  // Connect to the proper work queue used on server.js
  const workQueue = new Queue(QUEUE_NAME, REDIS_URL);

  workQueue.process(100, async (job) => {
    const downloadedMusicPaths = await downloader.downloadMusic(job.data.trackUrl);

    downloadedMusicPaths.forEach((path) => { uploader.upload(path.path); });
  });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });
