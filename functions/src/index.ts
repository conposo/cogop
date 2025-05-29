import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// Configure nodemailer with your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass
  }
});

const NOTIFICATION_EMAIL = functions.config().email.notification_recipient;

export const onNewContactSubmission = functions.firestore
  .document('contacts/{contactId}')
  .onCreate(async (snap, context) => {
    const contactData = snap.data();
    
    const mailOptions = {
      from: functions.config().email.user,
      to: NOTIFICATION_EMAIL,
      subject: `New Contact Form Submission from ${contactData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${contactData.message}</p>
        <p><strong>Submitted at:</strong> ${new Date(contactData.createdAt._seconds * 1000).toLocaleString()}</p>
        <p>
          <a href="${functions.config().app.url}/admin/contacts">
            View in Admin Dashboard
          </a>
        </p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email notification sent successfully');
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }); 