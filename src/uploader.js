const fs = require("fs");
const path = require("path");

require("isomorphic-fetch");
const {
  Client,
  LargeFileUploadTask,
} = require("@microsoft/microsoft-graph-client");

const tokenExpiredError = new Error(
  "Microsoft Graph API access token is invalid. Please re-authenticate.",
);

exports.upload = (filePath, accessToken) => {
  const authProvider = (callback) => callback(tokenExpiredError, accessToken);

  try {
    const client = Client.init({ authProvider });

    uploadFile(client, filePath);
  } catch (error) {
    console.log(error);

    throw error;
  }
};

function uploadFile(client, filePath) {
  fs.readFile(filePath, {}, async (error, file) => {
    if (error) throw error;

    const fileName = path.basename(filePath);

    try {
      const requestUrl = `/drives/me/root:/Music/${fileName}:/createUploadSession`;

      const payload = {
        item: {
          "@microsoft.graph.conflictBehavior": "fail",
          name: fileName,
        },
      };

      const fileObject = {
        size: file.byteLength,
        content: file,
        name: fileName,
      };

      const uploadSession = await LargeFileUploadTask.createUploadSession(
        client,
        requestUrl,
        payload,
      );

      const uploadTask = new LargeFileUploadTask(
        client,
        fileObject,
        uploadSession,
      );

      await uploadTask.upload();
    } catch(error) {
      console.error(error);

      throw error;
    } finally {
      // Delete file after successful upload
      fs.unlink(filePath, (error) => {
        if (error) console.error(error);
      });
    }
  });
}
