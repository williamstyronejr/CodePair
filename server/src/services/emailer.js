const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT } = process.env;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Gets and returns file content.
 * @param {Stirng} fileLoc
 * @param {Function} cb Callback to receive err and file content
 */
function readHTMLFile(fileLoc, cb) {
  fs.readFile(fileLoc, { encoding: 'utf-8' }, (err, html) => {
    if (err) cb(err);
    cb(null, html);
  });
}

/**
 * Renders HTML template with given parameters to send as email.
 * @param {String} to Email to send to
 * @param {String} subject Subject for email
 * @param {String} fileName File name of template to send
 * @param {Object} params Parmeters for template
 * @param {Function} cb Callback to receive error if any occur
 */
exports.sendEmailTemplate = (to, subject, fileName, params, cb) => {
  readHTMLFile(path.join(__dirname, '../templates/', fileName), (err, html) => {
    if (err) return;

    const htmlRender = handlebars.compile(html);
    const htmlSend = htmlRender(params);

    transporter.sendMail(
      {
        to,
        subject,
        html: htmlSend,
      },
      (mailErr) => {
        if (mailErr) return cb(mailErr);
        return cb(null);
      }
    );
  });
};
