
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
    auth: {
      api_key: process.env.EMAIL_API_KEY
    }
  }
const client = nodemailer.createTransport(sgTransport(options));


const sendHouseAddedEmail = async(email, name) => {
           
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
      client.sendMail(emailFormat, function(err, info){
        if (err){
          console.log(err);
        }
        else {
          console.log('Message sent: ', info.response);
        }
    });
  

}

/* Sent Bulk Mail */
const sendBulkEmailForAllUsers = async(emails, subject, message) => {
             
    var emailFormat = {
        from: process.env.EMAIL_ADDRESS,
        to: emails, 
        subject: subject,
        text: message,
        html: `
        <div style="padding: 1rem; font-family: Poppins;font-size: 16px;">
            <p style="font-weight: bold">Hello Folks,</p>
            <p>${message}</p>
            <p>Regards - <br/> <a href="https://tools-manufactures.web.app" target="_blank" >Rent House</a></p>
            <address>Rangpur Road, Gobindagonj, Gaibandha</address>
            <p>Mobile: +8801875474547</p>
            <p>Email: rent@house.com</p>
        </div>
        `,
        };
        client.sendMail(emailFormat, function(err, info){
            if (err){
                console.log(err);
            }
            else {
                console.log('Message sent: ', info.response);
            }
        });
}


module.exports = {sendHouseAddedEmail, sendBulkEmailForAllUsers};