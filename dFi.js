const { dFi, deezerApi } = require("d-fi");
const notify = require("./notify")

deezerApi.arl = process.env.ARL || "a338d78085d19cf4ff2b0020e57d5748c8c54634cd9535da6e7ba55e3332a1551d572f49f68a9e5c94801363a2b44a40c7b1ca8399de5fb732179d42c71161804ee7cd3b4801267038d02ccf28e62461c791929925ecdb135e208fdaf5a6caed";

module.exports = async (trackUrl) => {
  try {
    return await dFi(trackUrl);
  } catch (error) {
    const errorMessage = `dFi has failed to download: ${trackUrl} because of ${error}`;
    
    console.error(errorMessage);

    notify.push(errorMessage, error);

    throw error;
  }
}
