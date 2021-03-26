const nodemailer = require('nodemailer');

async function sendMail({ from , to, subject, text, html }) {
  
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PWD
        }
      }); 

      let info = await transporter.sendMail({
          from,
          to,
          subject,
          text,
          html
      });
     
}

module.exports = sendMail;