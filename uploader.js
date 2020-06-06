const fs = require("fs");
const path = require("path");

require("isomorphic-fetch");
const { Client, OneDriveLargeFileUploadTask } = require("@microsoft/microsoft-graph-client");

const tokenExpiredError = new Error("Microsoft Graph API access token provided by Pipedream is no longer valid. Please reauthenticate on Pipedream.");

exports.upload = (filePath, accessToken) => {
  const authProvider = callback => callback(tokenExpiredError, accessToken);

  try {
    const client = Client.init({ authProvider });

    uploadFile(client, filePath);
  } catch (error) {
    console.log(error);

    throw error;
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

      console.log("Successfully Uploaded!");

      // Delete file after successful upload
      fs.unlink(filePath, (error) => { if (error) console.error(error); });
    } catch (error) {
      console.error(error);
    }
  });
}
