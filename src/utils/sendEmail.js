import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, otp }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const htmlMessage = `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: auto; padding: 24px; color: #202124;">

    <p>Hello,</p>
    

    <p>
      We received a request to reset your password for your
      <strong>KLE Campus Clubs & Events Portal</strong> account.
    </p>

    <p>
      Use the verification code below to continue:
    </p>

    <!-- OTP -->
    <div style="
      font-size: 32px;
      font-weight: 600;
      letter-spacing: 6px;
      text-align: center;
      margin: 32px 0;
      color: #1a73e8;
    ">
      ${otp}
    </div>

    <p>
      This code will expire in <strong>5 minutes</strong>.
    </p>

    <p style="color: #5f6368;">
      If you didn’t request a password reset, you can safely ignore this email.
      For your security, please don’t share this code with anyone.
    </p>

    <br />

    <p>
      Thanks,<br />
      <strong>KLE Campus Clubs & Events Team</strong>
    </p>

  </div>
`;


  await transporter.sendMail({
    from: `"KLE Campus Clubs & Events" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlMessage
  });
};

export default sendEmail;
