const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const serviceAccount = require("./ServerKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Define the path to save the JSON file
const keyFilePath = path.join(__dirname, "ServerKey.json");

// Check if the environment variable exists
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  fs.writeFileSync(keyFilePath, process.env.GOOGLE_APPLICATION_CREDENTIALS);
  console.log("ServerKey.json created successfully!");
} else {
  console.error(
    "GOOGLE_APPLICATION_CREDENTIALS environment variable is missing!"
  );
}
// Function to send a notification with additional data
async function sendNotification(token, title, body, data = {}) {
  const message = {
    notification: {
      title,
      body,
    },
    data, // Custom data payload
    android: {
      priority: "high",
    },
    apns: {
      payload: {
        aps: {
          alert: { title, body },
          sound: "default",
          contentAvailable: true,
        },
      },
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

module.exports = {
  sendNotification,
};
