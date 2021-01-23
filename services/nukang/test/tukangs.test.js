const request = require('supertest')
const app = require('../app')
const { hash } = require('../helpers/bcrypt-helper')
const db = require("../config/mongo");
const { ObjectID } = require('mongodb');
const Tukang = db.collection("tukangs");
let tukangId
let image

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
    test('Response with access token', async done => {
      try {
        const res = await request(app).post('/tukang/login')
          .send({ email: 'john@mail.com', password: 'thistukang' })
        const { body, status } = res
        tukang_access_token = res.body.access_token
        expect(status).toBe(200)
        expect(body).toHaveProperty('access_token', expect.any(String))
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Login Tukang Failed Invalid Account', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).post('/tukang/login')
          .send({ email: 'n@mail.com', password: 'thiswrong' })
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'Invalid Account')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Login Tukang Failed', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).post('/tukang/login')
          .send({ email: 'n@mail.com' })
        const { body } = res
        expect(body).toHaveProperty('message', 'Invalid Account')
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('Update Tukang PUT /tukang/:id', () => {
  describe('Update Tukang Success', () => {
    test('Response updated tukang', async done => {
      try {
        const res = await request(app).put('/tukang/' + tukangId)
          .set('access_token', tukang_access_token)
          .send({
            name: 'Jone Slektemb',
            location: 'Kota Semarang',
            category: 'Tukang Bangunan',
            price: 100000,
            portofolio_img: 'https://jestjs.io/en',
          })
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toBeDefined()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('Find One Tukang GET /tukang/:id', () => {
  describe('Find Tukang Success', () => {
    test('Response updated tukang', async done => {
      try {
        const res = await request(app).get('/tukang/' + tukangId)
          .set('access_token', tukang_access_token)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toBeDefined()
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Find Tukang Failed', () => {
    test('Response error not found', async done => {
      try {
        const res = await request(app).get('/tukang/' + "wrongId")
          .set('access_token', tukang_access_token)
        const { body, status } = res
        expect(status).toBe(500)
        expect(body).toBeDefined()
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})