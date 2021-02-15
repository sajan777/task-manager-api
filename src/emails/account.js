const sgMail = require("@sendgrid/mail");

const sendGridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendGridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: "sajanarora101@gmail.coma",
      subject: "This is my first Email",
      text: `Welcome to the app, ${name} let me know how you get along with the app`,
    })
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error.response.body);
    });
};

module.exports = {
  sendWelcomeEmail,
};
