//onboarding mail
const onBoardingMail = (username) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Welcome</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px;">
        <tr>
          <td align="center">
            
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:#4f46e5; color:#ffffff; padding:20px; text-align:center;">
                  <h1 style="margin:0;">Welcome 🎉</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#333333;">
                  
                  <h2 style="margin-top:0;">Hi ${username},</h2>
                  
                  <p>
                    Welcome to our platform! We're excited to have you onboard 🚀
                  </p>

                  <p>
                    You can now explore features, manage your account, and get started with everything we offer.
                  </p>

                  <!-- CTA Button -->
                  <div style="text-align:center; margin:30px 0;">
                    <a href="#" 
                      style="background:#4f46e5; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:5px; display:inline-block;">
                      Get Started
                    </a>
                  </div>

                  <p>
                    If you have any questions, feel free to reply to this email. We're here to help.
                  </p>

                  <p>
                    Cheers,<br/>
                    <strong>Your Team</strong>
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9f9f9; padding:15px; text-align:center; font-size:12px; color:#777;">
                  © ${new Date().getFullYear()} Sanatan International. All rights reserved.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
};

//verification mail
const verificationMail = (username, verificationUrl) => {
  return `
   <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Verify Email</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
        <tr>
          <td align="center">

            <!-- Container -->
            <table width="600" cellpadding="0" cellspacing="0" 
              style="background:#ffffff; border-radius:10px; padding:30px;">

              <!-- Header -->
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <h2 style="margin:0; color:#333;">Task Manager</h2>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="font-size:16px; color:#333; padding-bottom:15px;">
                  Hi <strong>${username}</strong>,
                </td>
              </tr>

              <!-- Intro -->
              <tr>
                <td style="font-size:15px; color:#555; padding-bottom:20px;">
                  Welcome to <strong>Task Manager</strong> 🎉 We're excited to have you onboard!
                </td>
              </tr>

              <!-- Instructions -->
              <tr>
                <td style="font-size:15px; color:#555; padding-bottom:25px;">
                  To get started, please confirm your email address by clicking the button below.
                </td>
              </tr>

              <!-- Button -->
              <tr>
                <td align="center" style="padding-bottom:30px;">
                  <a href="${verificationUrl}" 
                    style="
                      background-color:#22BC66;
                      color:#ffffff;
                      padding:12px 25px;
                      text-decoration:none;
                      border-radius:5px;
                      font-size:14px;
                      display:inline-block;
                      font-weight:bold;
                    ">
                    Verify Email
                  </a>
                </td>
              </tr>

              <!-- Expiry Note -->
              <tr>
                <td style="font-size:14px; color:#777; padding-bottom:20px;">
                  This verification link is valid for a limited time. If you didn’t create an account, you can safely ignore this email.
                </td>
              </tr>

              <!-- Help -->
              <tr>
                <td style="font-size:14px; color:#777; padding-bottom:20px;">
                  Need help? Just reply to this email — we're here for you.
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="font-size:12px; color:#aaa; text-align:center;">
                  © ${new Date().getFullYear()} Task Manager. All rights reserved.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
}

const forgotPasswordMail = (username, resetUrl) => {
return `
 <!DOCTYPE html>

  <html>
        <head>
          <meta charset="UTF-8" />
          <title>Reset Password</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
        <tr>
          <td align="center">

            <!-- Container -->
            <table width="600" cellpadding="0" cellspacing="0" 
              style="background:#ffffff; border-radius:10px; padding:30px;">

              <!-- Header -->
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <h2 style="margin:0; color:#333;">Reset Your Password</h2>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="font-size:16px; color:#333; padding-bottom:15px;">
                  Hi <strong>${username}</strong>,
                </td>
              </tr>

              <!-- Intro -->
              <tr>
                <td style="font-size:15px; color:#555; padding-bottom:20px;">
                  We received a request to reset your password. No worries — it happens!
                </td>
              </tr>

              <!-- Instructions -->
              <tr>
                <td style="font-size:15px; color:#555; padding-bottom:25px;">
                  Click the button below to reset your password. If you did not request this, you can safely ignore this email.
                </td>
              </tr>

              <!-- Button -->
              <tr>
                <td align="center" style="padding-bottom:30px;">
                  <a href="${resetUrl}" 
                    style="
                      background-color:#4F46E5;
                      color:#ffffff;
                      padding:12px 25px;
                      text-decoration:none;
                      border-radius:5px;
                      font-size:14px;
                      display:inline-block;
                      font-weight:bold;
                    ">
                    Reset Password
                  </a>
                </td>
              </tr>

              <!-- Expiry Note -->
              <tr>
                <td style="font-size:14px; color:#777; padding-bottom:20px;">
                  This password reset link is valid for a limited time. For your security, do not share this link with anyone.
                </td>
              </tr>

              <!-- Help -->
              <tr>
                <td style="font-size:14px; color:#777; padding-bottom:20px;">
                  If you did not request a password reset, you can ignore this email or contact our support team.
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="font-size:12px; color:#aaa; text-align:center;">
                  © ${new Date().getFullYear()} Task Manager. All rights reserved.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>


  </html>
  `;
};


export { onBoardingMail, verificationMail , forgotPasswordMail};
  