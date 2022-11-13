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
          
          <p>Regards - <br/> <a href="https://houselagbe.vercel.app" target="_blank" >Rent House</a></p>
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

const sendBulkEmailForAllUsers = async (emails, subject, message, role) => {
  var emailFormat = {
    from: process.env.EMAIL_ADDRESS,
    to: emails,
    subject: subject + " by " + role,
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
    subject: `Someone Report to your house for ${reportTitle}`,
    text: `Someone Report to your house for  ${reportTitle}`,
    html: `
            <div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
                <p style="font-weight: bold">Hello there,</p>
                <p>There is a report for house. Take a look <br/> 
                <b> Report Title:</b> ${reportTitle} <br/>
                <b>Report Details:</b> ${reportDetails} </p>

                <b>Admin Speech:</b> <br/>
                <p> Here is the House Link Please Take look Otherwise We will mute your house. Thanks sir. </p>
                <a href="${houseUrl}" style="background: #00D39C;color: #fff; display: inline-block; padding: .4rem 2rem; margin: .5rem 0rem; border-radius: 4px; text-decoration: none" target="_blank" >Open House</a>
                <p>Regards - <br/> <a href="https://houselagbe.vercel.app" target="_blank" >HouseLagbe Admin Panel</a></p>
                <address>Rangpur Road, Gobindagonj, Gaibandha</address>
                <p>Mobile: +8801875474547</p>
                <p>Email: houselagbe@gmail.com</p>
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
    subject: "Verify Your Account ",
    text: `Please verify your email address by clicking the link below.

        ${verificationUrl}
        `,
    html: `
        <div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
            <p style="font-weight: bold">Hello there,</p>
            <p>Please verify your email address by clicking the link below.</p>
            <a href="${verificationUrl}" style="background: #00D39C;color: #fff; display: inline-block; padding: .4rem 2rem; margin: .5rem 0rem; border-radius: 4px; text-decoration: none" target="_blank" >Verify Account</a>
            <p> This Link only valid for 1 hour after 1 hour this link will not work.</p>
            <p>Regards - <br/> <a href="https://houselagbe.vercel.app" target="_blank" >Rent House</a></p>
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
            <a href="${verificationUrl}" style="background: #00D39C;color: #fff; display: inline-block; padding: .4rem 2rem; margin: .5rem 0rem; border-radius: 4px; text-decoration: none" target="_blank" >Verify and reset password</a>
            <p> This Link only valid for 1 hour after 1 hour this link will not work.</p>
            <p>Regards - <br/> <a href="https://houselagbe.vercel.app" target="_blank" >Rent House</a></p>
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
    subject: subject + " - from Feature Request & Bugs",
    text: `${author?.name} is request for features or bugs maybe.`,
    html: `<div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
             <div style="padding: 1rem; border: 1px solid #ccc;">
               <h3 style="font-weight: bold; margin: 1rem 0rem; border-bottom: 1px solid #ccc">Email Sender: </h3>
               <p><b>${
                 author?.name
               }</b> is request for features or bugs maybe. He/she is a <b>${
      author?.role === "user" ? "House Holder" : author?.role
    }</b> to the HouseLagbe.</p>
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

/* Send Email With Feature Request */

const sendEmailWithRejectNotes = (notesText, author) => {
  var emailFormat = {
    from: process.env.EMAIL_ADDRESS,
    to: author.email,
    subject: `Opps!! Why Admin/manager reject your house?`,
    text: `Why Admin/manager reject your house?`,
    html: `<div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
      <p style="font-weight: bold">Hello ${author?.name},</p>
      <p>There is reason to deny/reject your house. please take it normally and fill up this issues which one manager/admin mentioned.</p>
      
      <p style="padding: 1rem;">${notesText}</p>
      
      <p>Regards - <br/> <a href="https://houselagbe.vercel.app" target="_blank" >Rent House</a></p>
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

/* Send Approved Success Mail */
const sendApprovedSuccessMail = (author) => {
  const emails = `${author?.email}`;
  var emailFormat = {
    from: process.env.EMAIL_ADDRESS,
    to: emails,
    subject: "Congratulation! Your House is Approved",
    text: `Congratulation! Your House is Approved`,
    html: `<div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
        <p style="font-weight: bold">Hello ${author?.name},</p>
        <p>Congratulation! Your House is Approved. Now you can see your house in the website.</p>
        <p>Regards - <br/> <a href="https://houselagbe.vercel.app" target="_blank" >Rent House</a></p>
        <address>Rangpur Road, Gobindagonj, Gaibandha</address>
        <p>Mobile: +8801875474547</p>
        <p>Email: house@gmail.com</p>
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

/* Send Email For Delete House By Admin */
const sendEmailForDeleteHouseByAdmin = (author) => {
  const emails = `${author?.email}`;
  var emailFormat = {
    from: process.env.EMAIL_ADDRESS,
    to: emails,
    subject: "Opps!! Your House is Deleted",
    text: `Opps!! Your House is Deleted`,
    html: `<div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
            <p style="font-weight: bold">Hello ${author?.name},</p>
            <p>Opps!! Your House is Deleted. Please contact with admin for more information.</p>
            <p>Regards - <br/> <a href="https://houselagbe.vercel.app" target="_blank" >Rent House</a></p>
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

/* Send Email for Payment successfully done */
const sendEmailForPaymentSuccess = (email, name, house, payment) => {
  const emails = `${email}`;
  var emailFormat = {
    from: process.env.EMAIL_ADDRESS,
    to: emails,
    subject: "Congratulation! Your Payment is Successfully done.",
    text: `Congratulation! Your Payment is Success`,
    html: `<div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
            <p style="font-weight: bold">Hello ${name},</p>
            <p >Congratulation! Your Payment is Successfully done. Now you can see your <b>${house?.name} </b> details</p>
            <p> here is your transaction id - <b>${payment}</b></p>
            <p>Regards - <br/> <a href="https://houselagbe.vercel.app" target="_blank" >Rent House</a></p>
            <address>Rangpur Road, Gobindagonj, Gaibandha</address>
            <p>Mobile: +8801875474547</p>
            <p>Email: houselagbe@gmail.com </p>
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

/* Send Email to the House Holder */
const sendEmailToHouseHolderForBookedHouse = (
  email,
  name,
  customer,
  house,
  payment
) => {
  const emails = `${email}`;
  var emailFormat = {
    from: process.env.EMAIL_ADDRESS,
    to: emails,
    subject: "Congratulation! Your House is Booked",
    text: `Congratulation! Your House is Booked`,
    html: `<div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
            <p style="font-weight: bold">Hello ${name},</p>
            <p >Congratulation! Your House is Booked. <b>${customer}</b> has been booked your <b> ${house?.name}</b> this house</p>
            <p> here is him/her transaction id - <b>${payment}</b></p>
            <p>Regards - <br/> <a href="https://houselagbe.vercel.app" target="_blank" >Rent House</a></p>
            <address>Rangpur Road, Gobindagonj, Gaibandha</address>
            <p>Mobile: +8801875474547</p>
            <p>Email: houselagbe@gmail.com </p>
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

/* Send Email With Thanks to the Customer */
const sendThanksEmailTemplate = async (to, from, text, subject, data) => {
  const emails = `${to}`;
  var emailFormat = {
    from: from,
    to: emails,
    subject: subject || "Thanks for Booked",
    text: subject,
    html: `<div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
            <p style="font-weight: bold">Hello ${data?.customerName},</p>
            <p >Thanks for booked our house named <b> ${data?.houseName}</b></p>
            <p>
              ${text}            
            </p>
            <p>Regards - <br/> <a href="https://houselagbe.vercel.app" target="_blank" >Rent House</a></p>
            <address>Rangpur Road, Gobindagonj, Gaibandha</address>
            <p>Mobile: +8801875474547</p>
            <p>Email: houselagbe@gmail.com </p>
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
  sendEmailWithRejectNotes,
  sendApprovedSuccessMail,
  sendEmailForDeleteHouseByAdmin,
  sendEmailForPaymentSuccess,
  sendEmailToHouseHolderForBookedHouse,
  sendThanksEmailTemplate,
};
