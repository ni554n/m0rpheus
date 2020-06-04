const throng = require("throng");
const Queue = require("bull");
const downloader = require("./downloader");
const uploader = require("./uploader");

// Connect to a local redis intance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
const workers = process.env.WEB_CONCURRENCY || 1;

function start() {
  // Connect to the named work queue
  const workQueue = new Queue("matrix", REDIS_URL);

  workQueue.process(100, async (job) => {
    const savedFilePaths = await downloader.downloadMusic(job.data.trackUrl);

    savedFilePaths.forEach(path => { uploader(path.path, job.data.mgaAccessToken); });
  });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });