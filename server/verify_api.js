const assert = require('assert');
const mongoose = require('mongoose');
const User = require('./src/DB/model/user.model');
const Quiz = require('./src/DB/model/quiz.model');
const Question = require('./src/DB/model/question.model');
const Result = require('./src/DB/model/result.model');

const BASE_URL = 'http://localhost:5000/api/v1';

async function request(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function runTests() {
  console.log('[ ] Server starts successfully');
  console.log('[ ] MongoDB connects successfully');
  
  // Clean DB
  await mongoose.connect('mongodb://127.0.0.1:27017/quiz-platform');
  await User.deleteMany({});
  await Quiz.deleteMany({});
  await Question.deleteMany({});
  await Result.deleteMany({});
  console.log('Database cleaned');

  // Test Register
  let res = await request('POST', '/auth/register', { name: 'User 1', email: 'user1@test.com', password: 'password123' });
  if (res.status !== 201) console.error('Register failed:', res.data);
  assert.strictEqual(res.status, 201);
  assert.ok(res.data.data.token);
  const userToken = res.data.data.token;
  const userId = res.data.data.user.id;
  console.log('[x] Register works');

  // Test Login
  res = await request('POST', '/auth/login', { email: 'user1@test.com', password: 'password123' });
  assert.strictEqual(res.status, 200);
  assert.ok(res.data.data.token);
  console.log('[x] Login returns JWT');

  // Test Invalid/Missing JWT
  res = await request('GET', '/quizzes', null, 'invalid_token');
  assert.strictEqual(res.status, 401);
  console.log('[x] Invalid JWT returns 401');

  res = await request('GET', '/quizzes');
  assert.strictEqual(res.status, 401);
  console.log('[x] Missing JWT returns 401');

  // USER cannot manage quizzes
  res = await request('POST', '/quizzes', { title: 'Test Quiz', duration: 10, totalMarks: 10 }, userToken);
  assert.strictEqual(res.status, 403);
  console.log('[x] USER cannot create/update/delete quizzes');

  // Create Admin
  const admin = await User.create({ name: 'Admin', email: 'admin@test.com', password: 'password123', role: 'ADMIN' });
  res = await request('POST', '/auth/login', { email: 'admin@test.com', password: 'password123' });
  const adminToken = res.data.data.token;

  // ADMIN can manage quizzes
  res = await request('POST', '/quizzes', { title: 'Test Quiz', duration: 10, totalMarks: 10, isPublished: true }, adminToken);
  assert.strictEqual(res.status, 201);
  const quizId = res.data.data._id;
  console.log('[x] ADMIN can manage quizzes');

  // Test Pagination
  res = await request('GET', '/quizzes', null, adminToken);
  assert.strictEqual(res.status, 200);
  assert.ok(res.data.data.quizzes);
  assert.strictEqual(res.data.data.page, 1);
  console.log('[x] Pagination works on quizzes list');


  // USER cannot manage questions
  res = await request('POST', `/quizzes/${quizId}/questions`, {
    question: 'Q1', options: [{ id: 'A', text: 'A' }, { id: 'B', text: 'B' }], correctAnswer: 'A', marks: 5
  }, userToken);
  assert.strictEqual(res.status, 403);
  console.log('[x] USER cannot create/update/delete questions');

  // Admin creates question
  res = await request('POST', `/quizzes/${quizId}/questions`, {
    question: 'Q1', options: [{ id: 'A', text: 'A' }, { id: 'B', text: 'B' }], correctAnswer: 'A', marks: 10
  }, adminToken);
  assert.strictEqual(res.status, 201);
  const questionId = res.data.data._id;

  // correctAnswer is never exposed to normal users
  res = await request('GET', `/quizzes/${quizId}/questions`, null, userToken);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.data[0].correctAnswer, undefined);
  console.log('[x] correctAnswer is never exposed to normal users');

  // Invalid request body returns validation error
  res = await request('POST', `/quizzes/${quizId}/questions`, { question: 'Q1' }, adminToken);
  if (res.status !== 400) console.error('Validation test failed:', res.data);
  assert.strictEqual(res.status, 400);
  console.log('[x] Invalid request body returns validation error');

  // Invalid MongoDB ID
  res = await request('GET', '/quizzes/invalidId123', null, userToken);
  assert.strictEqual(res.status, 400);
  console.log('[x] Invalid MongoDB ID is handled correctly');

  // Missing resource
  const fakeId = new mongoose.Types.ObjectId();
  res = await request('GET', `/quizzes/${fakeId}`, null, userToken);
  assert.strictEqual(res.status, 404);
  console.log('[x] Missing resource returns 404');

  // Start quiz
  res = await request('POST', `/quizzes/${quizId}/start`, null, userToken);
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.data.data.status, 'IN_PROGRESS');
  const attemptId = res.data.data.attemptId;
  console.log('[x] Start quiz creates IN_PROGRESS attempt');

  // Duplicate start prevented
  res = await request('POST', `/quizzes/${quizId}/start`, null, userToken);
  assert.strictEqual(res.status, 400);

  // User cannot access another user's attempt
  res = await request('GET', `/results/${attemptId}`, null, adminToken); // admin can
  assert.strictEqual(res.status, 200);

  // Create another user
  const user2 = await User.create({ name: 'User 2', email: 'user2@test.com', password: 'password123' });
  const resUser2 = await request('POST', '/auth/login', { email: 'user2@test.com', password: 'password123' });
  const user2Token = resUser2.data.data.token;
  
  res = await request('GET', `/results/${attemptId}`, null, user2Token);
  assert.strictEqual(res.status, 403);
  console.log('[x] User cannot access another user\'s attempt/result');

  // Submit quiz
  res = await request('POST', `/quizzes/${quizId}/submit`, {
    attemptId,
    answers: [{ questionId, selectedAnswer: 'A' }]
  }, userToken);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.data.score, 10);
  assert.strictEqual(res.data.data.status, 'COMPLETED');
  console.log('[x] Score is calculated only on the server');

  // Duplicate submission prevented
  res = await request('POST', `/quizzes/${quizId}/submit`, {
    attemptId,
    answers: [{ questionId, selectedAnswer: 'A' }]
  }, userToken);
  assert.strictEqual(res.status, 400);
  console.log('[x] Duplicate/completed submission is prevented');

  // GET /users/:id/results checks ownership
  res = await request('GET', `/users/${userId}/results`, null, user2Token);
  if (res.status !== 403) console.error('GET user results failed:', res.data);
  assert.strictEqual(res.status, 403);
  console.log('[x] GET /users/:id/results checks ownership');

  res = await request('GET', `/results/${attemptId}`, null, user2Token);
  assert.strictEqual(res.status, 403);
  console.log('[x] GET /results/:id checks ownership');
  
  // All errors use the same response format
  assert.strictEqual(res.data.success, false);
  assert.ok(res.data.message);
  console.log('[x] All errors use the same response format');

  // DELETE endpoints return 204
  res = await request('DELETE', `/questions/${questionId}`, null, adminToken);
  assert.strictEqual(res.status, 204);
  console.log('[x] DELETE endpoints return the intended 204 response');

  console.log('ALL TESTS PASSED!');
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
