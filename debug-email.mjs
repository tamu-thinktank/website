// Debug email authentication
import { createTransport } from 'nodemailer';
import 'dotenv/config';

// Test Gmail authentication directly
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "tamuthinktank@gmail.com", // From .env
    pass: "bxoh srha vsud jlkz", // App password from .env
  },
});

console.log('🔐 [DEBUG] Testing Gmail authentication...');
console.log('📧 [DEBUG] Email:', "tamuthinktank@gmail.com");
console.log('🔑 [DEBUG] App Password:', "bxoh srha vsud jlkz".replace(/./g, '*')); // Hide password

async function testEmailAuth() {
  try {
    console.log('🧪 [DEBUG] Verifying transporter...');
    const verification = await transporter.verify();
    console.log('✅ [DEBUG] Transporter verified successfully!', verification);
    
    console.log('📧 [DEBUG] Sending simple test email...');
    const info = await transporter.sendMail({
      from: '"ThinkTank Test" <tamuthinktank@gmail.com>',
      to: 'lucasvad123@gmail.com',
      subject: 'Test Email - Debug',
      text: 'This is a simple test email to verify email sending works.',
      html: '<h1>Test Email</h1><p>This is a simple test email to verify email sending works.</p>'
    });
    
    console.log('🎉 [DEBUG] Email sent successfully!');
    console.log('📧 [DEBUG] Message ID:', info.messageId);
    console.log('📧 [DEBUG] Response:', info.response);
    console.log('📧 [DEBUG] Accepted:', info.accepted);
    console.log('📧 [DEBUG] Rejected:', info.rejected);
    
  } catch (error) {
    console.error('❌ [DEBUG] Email test failed:', error);
    if (error.code) console.error('🚨 [DEBUG] Error code:', error.code);
    if (error.response) console.error('📧 [DEBUG] Server response:', error.response);
    if (error.responseCode) console.error('🔢 [DEBUG] Response code:', error.responseCode);
  } finally {
    console.log('🏁 [DEBUG] Test completed');
    process.exit(0);
  }
}

testEmailAuth();