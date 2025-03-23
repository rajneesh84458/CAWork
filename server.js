require("dotenv").config();
const express = require("express");
const { sendNotification } = require(".");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.post("/send-notification", async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    // Validate required fields
    if (!token || !title || !body) {
      return res.status(400).json({
        success: false,
        message: "Token, title, and body are required",
      });
    }

    // Send notification
    const response = await sendNotification(token, title, body, data || {});

    res.json({
      success: true,
      message: "Notification sent successfully",
      response,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message,
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
