const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");


admin.initializeApp();


// CONTACT FORM EMAIL SENDER
exports.sendContactEmail = onCall(async (request) => {

  const {
    name,
    email,
    phone,
    company,
    subject,
    message,
    category
  } = request.data

  await admin.firestore().collection("mail").add({
    to: ["darkslatetheatre@gmail.com"],
    replyTo: email,
    message: {
      subject: `[${category}] ${subject}`,
      html: `
<p><strong><u>New message from ${name}</u></strong>
${company ? `<br/><i><strong>${company}</strong></i>` : ''}</p>
<p><strong>Email:</strong> ${email}
${phone ? `<br/><strong>Phone:</strong> ${phone}` : ''}</p><br/>
<p><strong><u>Message:</u></strong></p>
<p>${message}</p>
      `
    },
  });

  await admin.firestore().collection("mail").add({
    to: [email],
    message: {
      subject: `Thank you for reaching out!`,
      text: `
Hi ${name},


Thank you for reaching out. This email is to confirm that your message has been received, and we will get back to you via email soon.

If you have any further requests, feel free to get in touch at darkslatetheatre@gmail.com


All the best,
The Dark Slate Theatre Company


(This is an automated email address. Please do not respond, as your message will not be seen)
      `
    },
  });

  return { success: true };
});


exports.sendPasswordReset = onCall( async(request) => {
  const { email } = request.data;
  if(!email) throw new Error("Email is required");

  const resetLink = await admin.auth().generatePasswordResetLink(email, {
    url: 'https://darkslatetheatre.com/login',
    handleCodeInApp: false,
  });

  await admin.firestore().collection("mail").add({
    to: [email],
    message: {
      subject: "Reset your Dark Slate password",
      text: `Hello,
      
You requested a password reset for The Dark Slate Theatre Company admin area.

Reset your password here:
${resetLink}
    `
    }
  });

  return { success: true }
})