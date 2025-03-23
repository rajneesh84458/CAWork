const admin = require("firebase-admin");

const serviceAccount = require("./ServerKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
