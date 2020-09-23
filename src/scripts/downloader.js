const { dFi, deezerApi } = require("d-fi");
const fs = require("fs");

deezerApi.arl = process.env.ARL || readArl();

function readArl() {
  const configFile = fs.readFileSync(
    `${process.cwd()}/node_modules/d-fi/src/config.js`,
    "utf-8",
  );
  const arl = configFile.match(/const arl =.*'(.+)';/s)[1];

  return arl;
}

async function download(trackUrl) {
  const result = await dFi(trackUrl);

  if (result instanceof Error || result.error) {
    const errorMessage = `dFi has failed to download: ${trackUrl} because of ${result.toString()}`;

    console.error(errorMessage);

    throw Error(errorMessage);
  }

  return result;
};

exports.downloadMusic = async (trackUrl) => {
  return await download(trackUrl);
};
