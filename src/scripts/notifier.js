const { name: programName } = require("../../package.json");
const fetch = require("isomorphic-fetch");

/**
 * Triggers a webhook with { title: string, body: string }.
 * 
 * @param {string} message 
 * @param {Error} error 
 */
exports.push = async (message, error) => {
  const body = {
    title: `[${programName}] ${message}`,
    body: `${error.message}\n${error.stack}`,
  };

  try {
    await fetch(
      process.env.NOTIFIER_WEBHOOK_URL,
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
