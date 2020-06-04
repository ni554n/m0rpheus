const { dFi, deezerApi } = require("d-fi");

deezerApi.arl = process.env.ARL;

module.exports = async (trackUrl) => { 
  try {
    return await dFi(trackUrl);
  } catch (error) {
    console.error(error);
  }
}