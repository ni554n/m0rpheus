const fs = require("fs");
const path = require("path");

require("isomorphic-fetch");
const { Client, OneDriveLargeFileUploadTask } = require("@microsoft/microsoft-graph-client");

const MS_GRAPH_TOKEN = process.env.MS_GRAPH_TOKEN;
const tokenExpiredError = new Error("Microsoft Graph API access token is invalid. Please reauthenticate.");

exports.upload = (filePath) => {
  const authProvider = callback => callback(tokenExpiredError, MS_GRAPH_TOKEN);

  try {
    const client = Client.init({ authProvider });

    uploadFile(client, filePath);
  } catch (clientInitError) {
    console.log(clientInitError);

    throw clientInitError;
  }
}

function uploadFile(client, filePath) {
  fs.readFile(filePath, {}, async (error, file) => {
    if (error) throw error;

    try {
      const options = {
        path: path.dirname(filePath),
        fileName: path.basename(filePath)
      };

      const uploadTask = await OneDriveLargeFileUploadTask.create(client, file, options);
      const response = await uploadTask.upload();

      console.log(`Successfully uploaded ${options.path}`);

      // Delete file after successful upload
      fs.unlink(filePath, (error) => { if (error) console.error(error); });
    } catch (error) {
      console.error(error);
    }
  });
}
