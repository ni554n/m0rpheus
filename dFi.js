const { dFi, deezerApi } = require("d-fi");

deezerApi.arl = process.env.ARL_DFI || process.env.ARL;

module.exports = async (trackUrl) => { 
  try {
    return await dFi(trackUrl);
  } catch (error) {
    console.error(`dFi has failed to download: ${trackUrl} because of ${error}`);

    throw error;
  }
}