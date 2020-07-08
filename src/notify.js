const {name} = require("../package.json");
const fetch = require("isomorphic-fetch");

exports.push = (message, object) => {
  const body = {
    value1: name,
    value2: message,
    value3: object,
  };

  fetch(
    `https://maker.ifttt.com/trigger/push/with/key/${process.env.IFTTT_WEBHOOK_KEY}`,
    {
      method: "post",
      body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"},
    });
};
