// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  // Gmail SMTP configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Read the HTML template
  const emailTemplatePath = path.join(__dirname, "email-template.html");
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

  // Replace placeholders in the HTML template with actual values
  const formattedHtml = emailTemplate
    .replace("{{name}}", name)
    .replace("{{email}}", email)
    .replace("{{message}}", message);

  // Email configuration
  const mailOptions = {
    from: email,
    to: "jayedbinjahangir@gmail.com",
    subject: "Message For You!!",
    html: formattedHtml,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending email");
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
