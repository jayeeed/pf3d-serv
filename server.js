// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

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
      user: "jayedbinjahangir@gmail.com",
      pass: "kpqz auat xevr gxec",
    },
  });

  // Email configuration
  const mailOptions = {
    from: email,
    to: "jayedbinjahangir@gmail.com",
    subject: "New Contact Form Submission",
    html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333; text-align: center;">Contact Form Submission</h2>
      <div style="margin-top: 20px;">
        <p style="margin-bottom: 10px;"><strong style="color: #555;">Name:</strong> ${name}</p>
        <p style="margin-bottom: 10px;"><strong style="color: #555;">Email:</strong> ${email}</p>
        <p style="margin-bottom: 10px;"><strong style="color: #555;">Message:</strong> ${message}</p>
      </div>
    </div>
  `,
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
  console.log(`Server is running on port ${port}`);
});
