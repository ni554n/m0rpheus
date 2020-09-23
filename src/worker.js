const throng = require("throng");
const Queue = require("bull");

const downloader = require("./scripts/downloader");
const uploader = require("./scripts/uploader");
const notifier = require("./scripts/notifier");

// Connect to a local redis instance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const QUEUE_NAME = process.env.QUEUE_NAME || "queue";

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
const workerCount = process.env.WEB_CONCURRENCY || 1;

function workerStartFunction() {
  const workQueue = new Queue(QUEUE_NAME, REDIS_URL);

  workQueue.process(100, async (job) => {
    const { mgaAccessToken, trackUrl, trackName } = job.data;

    try {
      const downloadedMusicPaths = await downloader.downloadMusic(trackUrl);

      downloadedMusicPaths.forEach((path) => {
        uploader.upload(path.path, mgaAccessToken);
      });
    } catch (error) {
      notifier.push(`Failed ~ ${trackName}`, error);
    }
  });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
try {
  // @ts-ignore
  throng({ worker: workerStartFunction, count: workerCount });
} catch (error) {
  console.error(error);
}
