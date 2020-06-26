const { dFi, deezerApi } = require("d-fi");

deezerApi.arl = process.env.ARL || "79437723c0024e17559a2f26b2d5023373506cdadd5e29dceda8c7b0aa03accaa40b4b17e8f8d21743edef40a2a16fca3511b5be4ca15c26c871082543c08893c0dd89f0d415378957e05179b3e7ec2c93625d5a8cf2d51a0d177de1a9833aff";

module.exports = async (trackUrl) => {
  try {
    return await dFi(trackUrl);
  } catch (error) {
    console.error(`dFi has failed to download: ${trackUrl} because of ${error}`);

    throw error;
  }
}
