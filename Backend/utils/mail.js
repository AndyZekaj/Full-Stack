import nodemailer from 'nodemailer';

/**
 *
 * @param {String} mail_to receiver of the email
 * @param {String} mail_subject Subject of the email
 * @param {String} mail_htmlMsg Body of the email
 * @returns Object {success: Boolean, messageId: String}
 */

export const verifyUserByEmail = async (
  mail_to,
  mail_subject,
  mail_htmlMsg
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.de",
    port: "465",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    const result = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: mail_to,
      subject: mail_subject,
      html: mail_htmlMsg ,
    });

    // check if the email accepted
    if (result.accepted.length > 0) {
      return { success: true, msgId: result.messageId };
    } else {
      return { success: false, error: "Email was not accepted by the server" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const verifyEmailTemplate = (name, token) => {
  return `
        <h1>Welcome ${name}!</h1>
        <p>
            <a href="https://localhost:3000/users/verify/${token}">
                Click here to verify your account
            </a>
        </p>    
    `;
};
