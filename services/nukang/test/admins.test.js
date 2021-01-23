const request = require('supertest')
const app = require('../app')
const db = require("../config/mongo");
const Admin = db.collection("admin");

afterAll(done => {
  Admin.drop()
  done()
})

let tukangId
let admin_access_token

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
          expect(status).toBe(201)
          expect(body).toHaveProperty('id', expect.any(String))
          expect(body).toHaveProperty('email', 'admin@mail.com')
          done()
        })
    })
  })

  describe('Register Admin Failed', () => {
    test('Response with error message', done => {
      request(app)
        .post('/admin/register')
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(500)
          expect(body).toBeDefined()
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
          admin_access_token = res.body.access_token
          expect(status).toBe(200)
          expect(body).toHaveProperty('access_token', expect.any(String))
          done()
        })
    })
  })

  describe('Login Admin Failed', () => {
    test('Response with error message', done => {
      request(app)
        .post('/admin/login')
        .send({ email: 'n@mail.com', password: "thiswrong" })
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

describe('Add Tukang POST /admin/tukang', () => {
  describe('Add Tukang Success', () => {
    test('Response added tukang', done => {
      request(app)
        .post('/admin/tukang')
        .set('access_token', admin_access_token)
        .send({
          email: 'john@mail.com',
          password: 'thistukang'
        })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(201)
          tukangId = res.body.id
          expect(body).toHaveProperty('email', 'john@mail.com')
          expect(body).toHaveProperty('name', '')
          expect(body).toHaveProperty('location', '')
          expect(body).toHaveProperty('category', '')
          expect(body).toHaveProperty('price', 0)
          done()
        })
    })
  })

  describe('Add Tukang Failed No Access Token', () => {
    test('Response added tukang', done => {
      request(app)
        .post('/admin/tukang')
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
          expect(body).toHaveProperty('message', "Please Login First")
          done()
        })
    })
  })

  describe('Add Tukang Failed No Access Token', () => {
    test('Response added tukang', done => {
      request(app)
        .post('/admin/tukang')
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
          expect(body).toHaveProperty('message', "Please Login First")
          done()
        })
    })
  })
})

describe('Delete Tukang /admin/tukang/:id', () => {
  describe('Delete Tukang Success', () => {
    test('Response delete tukang', done => {
      request(app)
        .delete('/admin/tukang/' + tukangId)
        .set('access_token', admin_access_token)
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


  describe('Delete Tukang Failed No Token Access', () => {
    test('Response error message', done => {
      request(app)
        .delete('/admin/tukang/' + tukangId)
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(401)
          expect(body).toHaveProperty('message', "Please Login First")
          done()
        })
    })
  })
})

