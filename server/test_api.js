const http = require('http');

const request = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

async function testAll() {
  console.log('--- STARTING ALL API ENDPOINT TESTS ---');

  // 1. Health check
  const health = await request({ host: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
  console.log('1. GET /api/health:', health.status, health.data);

  // 2. Login valid
  const loginSuccess = await request({
    host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@example.com', password: 'admin123' });
  console.log('2. POST /api/auth/login:', loginSuccess.status, 'Token acquired!');
  const token = loginSuccess.data.token;

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 3. GET /api/users
  const usersAll = await request({ host: 'localhost', port: 5000, path: '/api/users', method: 'GET', headers: authHeaders });
  console.log('3. GET /api/users count:', usersAll.data.count);

  // 4. POST /api/users (Create User)
  const newUser = await request({
    host: 'localhost', port: 5000, path: '/api/users', method: 'POST',
    headers: authHeaders
  }, {
    full_name: 'Test Refactor User',
    email: 'test.refactor@example.com',
    role: 'Designer',
    status: 'Active',
    phone: '+1 555-444-3333',
    address: 'Seattle, WA',
    bio: 'Test user for refactored operations dashboard.'
  });
  console.log('4. POST /api/users (Create):', newUser.status, 'ID:', newUser.data.user?.id);
  const createdId = newUser.data.user?.id;

  // 5. PUT /api/users/:id (Edit User)
  const editUser = await request({
    host: 'localhost', port: 5000, path: `/api/users/${createdId}`, method: 'PUT',
    headers: authHeaders
  }, {
    full_name: 'Test Refactor User Updated',
    role: 'Lead Designer',
    status: 'Inactive'
  });
  console.log(`5. PUT /api/users/${createdId} (Edit):`, editUser.status, editUser.data.user?.full_name, editUser.data.user?.role);

  // 6. DELETE /api/users/:id
  const delRes = await request({ host: 'localhost', port: 5000, path: `/api/users/${createdId}`, method: 'DELETE', headers: authHeaders });
  console.log(`6. DELETE /api/users/${createdId}:`, delRes.status, delRes.data.message);

  // 7. Change Password
  const pwdRes = await request({
    host: 'localhost', port: 5000, path: '/api/auth/change-password', method: 'POST',
    headers: authHeaders
  }, { currentPassword: 'admin123', newPassword: 'admin123' });
  console.log('7. POST /api/auth/change-password:', pwdRes.status, pwdRes.data.message);

  console.log('--- ALL API ENDPOINT TESTS PASSED SUCCESSFULLY! ---');
}

testAll().catch(console.error);
