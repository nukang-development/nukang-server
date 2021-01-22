const request = require('supertest')
const app = require('../app')

describe('Register User POST /user/register', () => {
  describe('Register User Success', () => {
    test('Response with access token', done => {
      request(app)
        .post('/user/register')
        .send({ name: 'user1', email: 'user1@mail.com', password: 'thisuser' })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(201)
          expect(body).toHaveProperty('access_token', expect.any(String))
          done()
        })
    })
  })
})

describe('Login User POST /user/login', () => {
  describe('Login User Success', () => {
    test('Response with access token', done => {
      request(app)
        .post('/user/login')
        .send({ email: 'user1@mail.com', password: 'thisuser' })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(200)
          expect(body).toHaveProperty('access_token', expect.any(String))
          done()
        })
    })
  })

  describe('Login Password Wrong', () => {
    test('Response Invalid Email/Password', done => {
      request(app)
        .post('/user/login')
        .send({ email: 'user1@mail.com', password: 'thisuser' })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(400)
          expect(body).toHaveProperty('message', 'Invalid Email/Password')
          done()
        })
    })
  })

  describe('Login Email/Password Empty', () => {
    test('Response Invalid Account', done => {
      request(app)
        .post('/user/login')
        .send({ email: 'user1@mail.com', password: 'thisuser' })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(400)
          expect(body).toHaveProperty('message', 'Invalid Account')
          done()
        })
    })
  })
})