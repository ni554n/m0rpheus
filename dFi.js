const { dFi, deezerApi } = require("d-fi");

require("fs").readFile("~/.config/d-fi-nodejs/config.json", "utf8", (error, content) => {
  let dfiArl;

  if (error) console.error(error);
  else {
    try {
      dfiArl = JSON.parse(content).cookies.arl;
    } catch (err) {
      console.error(err);
    }
  }

  deezerApi.arl = dfiArl || process.env.ARL;
});

module.exports = async (trackUrl) => { 
  try {
    return await dFi(trackUrl);
  } catch (error) {
    console.error(error);
  }
}