const { name: programName } = require("../../package.json");
const fetch = require("isomorphic-fetch");

/**
 * Trigger a "/push" webhook on IFTTT.
 * Can be tested directly on "Documentation" page of https://ifttt.com/maker_webhooks
 * 
 * @param {string} message 
 * @param {Error} error 
 */
exports.push = async (message, error) => {
  const body = {
    value1: programName,
    value2: message,
    value3: `${error.message}\n${error.stack}`,
  };

  try {
    await fetch(
      `https://maker.ifttt.com/trigger/push/with/key/${process.env.IFTTT_WEBHOOK_KEY}`,
      {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Push failed!");
  }
};
