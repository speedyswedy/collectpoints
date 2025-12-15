const functions = require("firebase-functions");

exports.helloWorld = functions.https.onRequest((request, response) => {
  console.log("Hello world function triggered!");
  response.send("Hello from Firebase!");
});
