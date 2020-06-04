const fs = require("fs");
const path = require("path");

const { Client, OneDriveLargeFileUploadTask } = require("@microsoft/microsoft-graph-client");

const tokenExpiredError = new Error("Microsoft Graph API access token provided by Pipedream is no longer valid. Please reauthenticate.");

module.exports = (filePath, accessToken) => {
  const authProvider = callback => callback(tokenExpiredError, accessToken);

  const client = Client.init({ authProvider });

  uploadFile(client, filePath);
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

      console.log(response);
      console.log("Successfully Uploaded!");
    } catch (error) {
      console.error(error);
    }
  });
}
