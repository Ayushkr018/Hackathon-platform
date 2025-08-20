const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Use SendGrid in production
    return nodemailer.createTransporter({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else {
    // Use Ethereal for development
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.password'
      }
    });
  }
};

/**
 * Send email
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@hackathonplatform.com',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send team invitation email
 */
const sendTeamInvitation = async (inviterName, teamName, eventName, recipientEmail, inviteCode) => {
  const subject = `Team Invitation: Join ${teamName} for ${eventName}`;
  const message = `
    Hi there!

    ${inviterName} has invited you to join the team "${teamName}" for the event "${eventName}".

    To join the team, use this invite code: ${inviteCode}

    Or click the link: ${process.env.CLIENT_URL}/teams/join/${inviteCode}

    Best regards,
    Hackathon Platform Team
  `;

  const html = `
    <h2>Team Invitation</h2>
    <p>Hi there!</p>
    <p><strong>${inviterName}</strong> has invited you to join the team <strong>"${teamName}"</strong> for the event <strong>"${eventName}"</strong>.</p>
    <p>To join the team, use this invite code: <strong>${inviteCode}</strong></p>
    <p>Or <a href="${process.env.CLIENT_URL}/teams/join/${inviteCode}">click here to join</a></p>
    <br>
    <p>Best regards,<br>Hackathon Platform Team</p>
  `;

  await sendEmail({
    email: recipientEmail,
    subject,
    message,
    html
  });
};

/**
 * Send event announcement email
 */
const sendAnnouncementEmail = async (recipientEmail, eventName, title, content) => {
  const subject = `${eventName}: ${title}`;
  const message = `
    Event: ${eventName}
    
    ${title}
    
    ${content}
    
    Best regards,
    Hackathon Platform Team
  `;

  const html = `
    <h2>${eventName}</h2>
    <h3>${title}</h3>
    <div>${content}</div>
    <br>
    <p>Best regards,<br>Hackathon Platform Team</p>
  `;

  await sendEmail({
    email: recipientEmail,
    subject,
    message,
    html
  });
};

module.exports = {
  sendEmail,
  sendTeamInvitation,
  sendAnnouncementEmail
};
