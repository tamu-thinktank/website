// Test script to check email functionality
const http = require('http');

async function testInterviewEmail() {
  const payload = {
    officerId: "test-officer-123",
    officerName: "Lucas Test Officer",
    officerEmail: "lucasvad123@gmail.com", 
    applicantName: "Test Applicant",
    applicantEmail: "original@example.com", // This will be overridden to send to lucasvad123@gmail.com
    startTime: new Date().toISOString(),
    location: "Test Location - ZACH Building",
    team: "AI/ML",
    applicationType: "General"
  };

  const postData = JSON.stringify(payload);

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/send-interview-email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🧪 [TEST] Sending test interview email...');
  console.log('📧 [TEST] Payload:', JSON.stringify(payload, null, 2));

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`✅ [TEST] Response status: ${res.statusCode}`);
        console.log(`📧 [TEST] Response:`, data);
        
        try {
          const response = JSON.parse(data);
          if (response.success) {
            console.log('🎉 [TEST] Email sent successfully!');
          } else {
            console.log('❌ [TEST] Email failed:', response.error);
          }
        } catch (e) {
          console.log('📄 [TEST] Raw response:', data);
        }
        
        resolve(data);
      });
    });

    req.on('error', (err) => {
      console.error('❌ [TEST] Request error:', err);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Run the test
testInterviewEmail()
  .then(() => {
    console.log('🏁 [TEST] Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 [TEST] Test failed:', error);
    process.exit(1);
  });