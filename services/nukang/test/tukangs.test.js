const request = require('supertest')
const app = require('../app')
const { hash } = require('../helpers/bcrypt-helper')
const db = require("../config/mongo");
const { ObjectID } = require('mongodb');
const Tukang = db.collection("tukangs");

let tukangId

beforeAll(done => {
  let hashed = hash('thistukang')
  Tukang.insertOne({
    email: 'john@mail.com',
    password: hashed,
    name: "",
    location: "",
    category: "",
    price: 0,
  }).then((data) => {
    tukangId = data.ops[0]._id
  })
  done()
})

afterAll(done => {
  Tukang.deleteOne({ _id: ObjectID(tukangId) })
  done()
})

describe('Login Tukang POST /tukang/login', () => {
  describe('Login Tukang Success', () => {
    test('Response with access token', done => {
      request(app)
        .post('/tukang/login')
        .send({ email: 'john@mail.com', password: 'thistukang' })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          tukang_access_token = res.body.access_token
          expect(status).toBe(200)
          expect(body).toHaveProperty('access_token', expect.any(String))
          done()
        })
    })
  })

  describe('Login Tukang Failed Invalid Account', () => {
    test('Response with error message', done => {
      request(app)
        .post('/tukang/login')
        .send({ email: 'n@mail.com', password: 'thiswrong' })
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

  describe('Login Tukang Failed', () => {
    test('Response with error message', done => {
      request(app)
        .post('/tukang/login')
        .send({ email: 'n@mail.com' })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(body).toHaveProperty('message', 'Invalid Account')
          done()
        })
    })
  })
})

describe('Update Tukang PUT /tukang/:id', () => {
  describe('Update Tukang Success', () => {
    test('Response updated tukang', done => {
      request(app)
        .put('/tukang/' + tukangId)
        .set('access_token', tukang_access_token)
        .send({
          name: 'Jone Slektemb',
          location: 'Kota Semarang',
          category: 'Tukang Bangunan',
          price: 100000
        })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(200)
          expect(body).toHaveProperty('name', 'Jone Slektemb')
          expect(body).toHaveProperty('location', 'Kota Semarang')
          expect(body).toHaveProperty('category', 'Tukang Bangunan')
          expect(body).toHaveProperty('price', 100000)
          done()
        })
    })
  })
})

describe('Find One Tukang GET /tukang/:id', () => {
  describe('Find Tukang Success', () => {
    test('Response updated tukang', done => {
      request(app)
        .get('/tukang/' + tukangId)
        .set('access_token', tukang_access_token)
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(200)
          expect(body).toHaveProperty('name', 'Jone Slektemb')
          expect(body).toHaveProperty('location', 'Kota Semarang')
          expect(body).toHaveProperty('category', 'Tukang Bangunan')
          expect(body).toHaveProperty('price', 100000)
          done()
        })
    })
  })

  describe('Find Tukang Failed', () => {
    test('Response error not found', done => {
      request(app)
        .get('/tukang/' + "wrongId")
        .set('access_token', tukang_access_token)
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