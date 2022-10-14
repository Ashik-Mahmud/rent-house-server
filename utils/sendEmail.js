const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

const options = {
  auth: {
    api_key: process.env.EMAIL_API_KEY,
  },
};
const client = nodemailer.createTransport(sgTransport(options));

const sendHouseAddedEmail = async (email, name) => {
  var emailFormat = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: `Hurray!! House successfully created Now Waiting for Admin Approved`,
    text: `your house ${name} successfully created at ${Date.now().toLocaleString()} Now Waiting for Admin Approved`,
    html: `
        <div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
          <p style="font-weight: bold">Hello ${email},</p>
          <p>Thanks for your patients <br/> Your house <strong>${name} </strong> successfully created at <b>${new Date().toDateString()} at ${new Date().toLocaleTimeString()}</b> Now Waiting for Admin Approved. It might be take 24 hours. Have nice day. </p>
          
          <p>Regards - <br/> <a href="https://tools-manufactures.web.app" target="_blank" >Rent House</a></p>
          <address>Rangpur Road, Gobindagonj, Gaibandha</address>
          <p>Mobile: +8801875474547</p>
          <p>Email: rent@house.com</p>
        </div>
        `,
  };
  client.sendMail(emailFormat, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: ", info.response);
    }
  });
};

/* Sent Bulk Mail */

const sendBulkEmailForAllUsers = async (emails, subject, message) => {
  var emailFormat = {
    from: process.env.EMAIL_ADDRESS,
    to: emails,
    subject: subject,
    text: message,
    html: `
        <div style="padding: 3rem; font-family: Poppins;font-size: 16px;border: 10px solid transparent;border-image:url(https://www.w3schools.com/cssref/border.png) 35 stretch">
            <p>${message}</p>
        </div>
        `,
  };
  client.sendMail(emailFormat, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: ", info.response);
    }
  });
};

/* Send Report Email */
const sendReportEmail = async (email, houseUrl, reportTitle, reportDetails) => {
  const emails = `${email},${process.env.EMAIL_ADDRESS}`;
  var emailFormat = {
    from: process.env.EMAIL_ADDRESS,
    to: emails,
    subject: `Report for ${reportTitle}`,
    text: `Report for ${houseUrl}`,
    html: `
            <div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
                <p style="font-weight: bold">Hello there,</p>
                <p>There is a report for house. Take a look <br/> Report Title: <b>${reportTitle}</b> <br/> Report Details: <b>${reportDetails} </b></p>
                <p> Here is the House Link Please Take look </p>
                <a href="${houseUrl}" target="_blank" >${houseUrl}</a>
                <p>Regards - <br/> <a href="https://tools-manufactures.web.app" target="_blank" >Rent House</a></p>
                <address>Rangpur Road, Gobindagonj, Gaibandha</address>
                <p>Mobile: +8801875474547</p>
                <p>Email: rent@house.com</p>
            </div>
            `,
  };
  client.sendMail(emailFormat, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: ", info.response);
    }
  });
};

/* Send Email for Verifications */
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/api/v1/users/verify-email/${token}`;
  const emails = `${email}`;
  var emailFormat = {
    from: process.env.EMAIL_ADDRESS,
    to: emails,
    subject: "Verify your email address",
    text: `Please verify your email address by clicking the link below.

        ${verificationUrl}
        `,
    html: `
        <div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
            <p style="font-weight: bold">Hello there,</p>
            <p>Please verify your email address by clicking the link below.</p>
            <a href="${verificationUrl}" target="_blank" >${verificationUrl}</a>
            <p> This Link only valid for 1 hour after 1 hour this link will not work.</p>
            <p>Regards - <br/> <a href="https://tools-manufactures.web.app" target="_blank" >Rent House</a></p>
            <address>Rangpur Road, Gobindagonj, Gaibandha</address>
            <p>Mobile: +8801875474547</p>
            <p>Email: rent@house.com</p>
        </div>
        `,
  };
  client.sendMail(emailFormat, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: ", info.response);
    }
  });
};

/* Send Verification Email With Password Reset Link */
const sendVerificationEmailWithResetLink = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/api/v1/users/verify-reset-password-email/${token}`;
  const emails = `${email}`;
  var emailFormat = {
    from: process.env.EMAIL_ADDRESS,
    to: emails,
    subject: "Verify your Reset Email address",
    text: `Please verify your email address by clicking the link below.

        ${verificationUrl}
        `,
    html: `
        <div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
            <p style="font-weight: bold">Hello there,</p>
            <p>Please Click on this link to reset your password.</p>
            <a href="${verificationUrl}" target="_blank" >${verificationUrl}</a>
            <p> This Link only valid for 1 hour after 1 hour this link will not work.</p>
            <p>Regards - <br/> <a href="https://tools-manufactures.web.app" target="_blank" >Rent House</a></p>
            <address>Rangpur Road, Gobindagonj, Gaibandha</address>
            <p>Mobile: +8801875474547</p>
            <p>Email: rent@house.com</p>
        </div>
        `,
  };
  client.sendMail(emailFormat, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: ", info.response);
    }
  });
};

/* Send Email With Feature Request */

const sendEmailForFeatureRequest = (subject, requestText, author) => {
  
  const emails = `${author?.email}`;
  var emailFormat = {
    from: emails,
    to: process.env.EMAIL_ADDRESS,
    subject: subject + ' - from Feature Request & Bugs',
    text: `${author?.name} is request for features or bugs maybe.`,
    html: `<div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
             <div style="padding: 1rem; border: 1px solid #ccc;">
               <h3 style="font-weight: bold; margin: 1rem 0rem; border-bottom: 1px solid #ccc">Email Sender: </h3>
               <p><b>${author?.name}</b> is request for features or bugs maybe. He/she is a <b>${author?.role === 'user' ? "House Holder" : author?.role}</b> to the HouseLagbe.</p>
             </div>

             <div style="padding: 1rem; border: 1px solid #ccc;">
                <h3 style="font-weight: bold; margin: 1rem 0rem; border-bottom: 1px solid #ccc">Text For Sender: </h3>
                ${requestText}
             </div>              
          </div>
          `,
  };
  client.sendMail(emailFormat, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: ", info.response);
    }
  });
};

module.exports = {
  sendHouseAddedEmail,
  sendBulkEmailForAllUsers,
  sendReportEmail,
  sendVerificationEmail,
  sendVerificationEmailWithResetLink,
  sendEmailForFeatureRequest,
};
