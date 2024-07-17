const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: false,
  auth: {
    user: process.env.nodemailer_user,
    pass: process.env.nodemailer_pass,
  },
});

function sendmail(toEmail, subject, content) {
  const mailOptions = {
    from: process.env.nodemailer_user,
    t0: toEmail,
    subject: subject,
    html: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log(info);
    if (error) {
      console.log("error occurs", error);
    } else {
      console.log("Email sent", info.response);
    }
  });
}

module.exports = { sendmail };
