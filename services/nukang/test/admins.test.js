const request = require('supertest')
const app = require('../app')

let idTukang
let access_token

describe('Register Admin POST /admin/register', () => {
  describe('Register Admin Success', () => {
    test('Response with access token', done => {
      request(app)
        .post('/admin/register')
        .send({ email: 'admin@mail.com', password: 'thisadmin' })
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
})

describe('Login Admin POST /admin/login', () => {
  describe('Login Admin Success', () => {
    test('Response with access token', done => {
      request(app)
        .post('/admin/login')
        .send({ email: 'admin@mail.com', password: 'thisadmin' })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          access_token = res.body.access_token
          expect(status).toBe(200)
          expect(body).toHaveProperty('access_token', expect.any(String))
          done()
        })
    })
  })

  describe('Login Password Wrong', () => {
    test('Response Invalid Email/Password', done => {
      request(app)
        .post('/admin/login')
        .send({ email: 'admin1@mail.com', password: 'thiswrong' })
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
        .post('/admin/login')
        .send({ email: '', password: '' })
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

describe('Add Tukang POST /tukang', () => {
  describe('Add Tukang Success', () => {
    test('Response added tukang', done => {
      request(app)
        .post('/admin/create')
        .set('access_token', access_token)
        .send({
          email: 'john@mail.com',
          password: 'thistukang'
        })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          idTukang = res.body.id
          expect(status).toBe(201)
          expect(body).toHaveProperty('email', 'john@mail.com')
          expect(body).toHaveProperty('password', 'thistukang')
          expect(body).toHaveProperty('name', '')
          expect(body).toHaveProperty('location', '')
          expect(body).toHaveProperty('category', '')
          expect(body).toHaveProperty('price', 0)
          done()
        })
    })
  })

  describe('Add Tukang Error No Token', () => {
    test('Response Unauthorized Error Message', done => {
      request(app)
        .post('/admin/create')
        .set('access_token', '')
        .send({
          email: 'john@mail.com',
          password: 'thistukang'
        })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(401)
          expect(body).toHaveProperty('message', 'Please Login First')
          done()
        })
    })
  })
})

describe('Delete Tukang /tukang/:id', () => {
  describe('Delete Tukang Success', () => {
    test('Response delete tukang', done => {
      request(app)
        .put('/tukang/' + idTukang)
        .set('access_token', access_token)
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(200)
          expect(body).toHaveProperty('message', 'success delete')
          done()
        })
    })
  })

  describe('Delete Tukang Error No Token', () => {
    test('Response Unauthorized Error Message', done => {
      request(app)
        .delete('/tukang/' + idTukang)
        .set('access_token', '')
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(401)
          expect(body).toHaveProperty('message', 'success delete')
          done()
        })
    })
  })
})