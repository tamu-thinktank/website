// Test with your personal email for debugging
import { createTransport } from 'nodemailer';

// Test with your personal Gmail (you'll need to set up app password)
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "lucasvad123@gmail.com", // Your personal email
    pass: "YOUR_APP_PASSWORD_HERE", // You need to generate this
  },
});

console.log('🔐 [DEBUG] Testing with personal Gmail...');
console.log('📧 [DEBUG] Email: lucasvad123@gmail.com');

async function testPersonalEmail() {
  try {
    console.log('🧪 [DEBUG] Verifying transporter...');
    const verification = await transporter.verify();
    console.log('✅ [DEBUG] Transporter verified successfully!', verification);
    
    console.log('📧 [DEBUG] Sending test email to yourself...');
    const info = await transporter.sendMail({
      from: '"Lucas Test" <lucasvad123@gmail.com>',
      to: 'lucasvad123@gmail.com',
      subject: 'ThinkTank Email Test - SUCCESS!',
      text: 'This email confirms that the email sending system is working correctly.',
      html: `
        <h1>🎉 Email System Working!</h1>
        <p>This email confirms that the ThinkTank email sending system is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>From:</strong> ThinkTank Auto-Scheduler System</p>
      `
    });
    
    console.log('🎉 [DEBUG] Email sent successfully!');
    console.log('📧 [DEBUG] Message ID:', info.messageId);
    console.log('📧 [DEBUG] Check your email: lucasvad123@gmail.com');
    
  } catch (error) {
    console.error('❌ [DEBUG] Email test failed:', error);
    console.log('\n💡 [DEBUG] To fix this:');
    console.log('1. Go to https://myaccount.google.com/security');
    console.log('2. Enable 2-Factor Authentication');
    console.log('3. Go to "App passwords"');
    console.log('4. Generate a new app password for "Mail"');
    console.log('5. Replace YOUR_APP_PASSWORD_HERE with the generated password');
  } finally {
    console.log('🏁 [DEBUG] Test completed');
  }
}

testPersonalEmail();