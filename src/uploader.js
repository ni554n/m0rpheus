const fs = require("fs");
const path = require("path");

require("isomorphic-fetch");
const {Client, OneDriveLargeFileUploadTask} = require("@microsoft/microsoft-graph-client");

const tokenExpiredError = new Error("Microsoft Graph API access token is invalid. Please reauthenticate.");

exports.upload = (filePath, accessToken) => {
  const authProvider = callback => callback(tokenExpiredError, accessToken);

  try {
    const client = Client.init({authProvider});

    uploadFile(client, filePath);
  } catch (error) {
    console.log(error);

    throw error;
  }
};

function uploadFile(client, filePath) {
  fs.readFile(filePath, {}, async (error, file) => {
    if (error) throw error;

    const options = {
      path: path.dirname(filePath),
      fileName: path.basename(filePath),
    };

    try {
      const uploadTask = await OneDriveLargeFileUploadTask.create(client, file, options);
      await uploadTask.upload();
    } finally {
      // Delete file after successful upload
      fs.unlink(filePath, (error) => {
        if (error) console.error(error);
      });
    }

    console.log(`Successfully uploaded ${options.path}`);
  });
}
