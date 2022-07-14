const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const keys = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
  },
  region: "us-east-1",
});

module.exports = (app) => {
  app.get("/api/upload", requireLogin, async (req, res) => {
    const key = `${req.user.id}/${uuidv4()}.jpeg`;

    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "blog-app-udemy-course",
        ContentType: "image/jpeg",
        Key: key,
      },
      (err, url) => res.send({ url, key })
    );
  });
};
