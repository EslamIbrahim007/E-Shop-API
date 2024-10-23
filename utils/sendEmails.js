/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap" ;



const sendEmail = async (options) => { 
  //1) Create transporter (service that u will send like "gmail" " mailgun" " mailtrap" "sendGrid")
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports 587
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  //2) Define email options(like from ,to  sunject, email content)
  const maiOpts = {
    from: `E=shop App By =>${process.env.EMAIL}`,
    to: options.email,
    subject: options.subject,
    text: options.message
  }
  //3(send the email)
  await transporter.sendMail(maiOpts)
};


export default  sendEmail