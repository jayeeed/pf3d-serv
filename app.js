// libs
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

// env conf.
require("dotenv").config();

// app init
const app = express();
const port = process.env.PORT;

// middleware
app.use(bodyParser.json());

// cors
app.use(cors());

// api
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

  // welcome
  app.get("/", (res) => {
    res.status(200).send("Deployment Successful! 🥳");
  });

  // Read the HTML template for the main email
  const emailTemplatePath = path.join(__dirname, "templetes/get.html");
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

  // Replace placeholders in the HTML template with actual values
  const formattedHtml = emailTemplate
    .replace("{{name}}", name)
    .replace("{{name}}", name)
    .replace("{{email}}", email)
    .replace("{{message}}", message)
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

    // Log a notification to the terminal
    console.log("Got a new mail from:", "\nName: " + name, "\nEmail: " + email);

    // Read the HTML template for the thank-you email
    const thankYouEmailTemplatePath = path.join(
      __dirname,
      "templetes/send.html"
    );
    const thankYouEmailTemplate = fs.readFileSync(
      thankYouEmailTemplatePath,
      "utf-8"
    );

    // Replace placeholders in the thank-you email template with actual values
    const formattedThankYouHtml = thankYouEmailTemplate
      .replace("{{name}}", name)
      .replace("{{message}}", message);

    // Send thank-you email
    await sendThankYouEmail(email, formattedThankYouHtml);

    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending email");
  }
});

// Function to send a thank-you email
async function sendThankYouEmail(toEmail, formattedThankYouHtml) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const thankYouMailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: "Thank You for Reaching Out!!",
    html: formattedThankYouHtml,
  };

  try {
    await transporter.sendMail(thankYouMailOptions);
    console.log("Thank-you email sent to:", toEmail);
  } catch (error) {
    console.error("Error sending thank-you email:", error);
  }
}

// listener
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
