var SibApiV3Sdk = require('sib-api-v3-sdk');
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.EMAIL_API_KEY;

var defaultClient = SibApiV3Sdk.ApiClient.instance;

const sendEmail = async (email, subject, body) => {
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

    sendSmtpEmail = {
        sender: {
            name: 'Rent House',
            email: 'dev.ashikmahmud@gmail.com',
        },
        to: [
            {
                email: email,
            },
        ],
        subject: subject,
        htmlContent: body,
    };

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API called successfully. Returned data: ' + data);
    } catch (error) {
        console.error(error);
    }
};


module.exports = sendEmail;