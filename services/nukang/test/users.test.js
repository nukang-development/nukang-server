const request = require('supertest')
const app = require('../app')
const { hash } = require('../helpers/bcrypt-helper')
const { ObjectID } = require('mongodb');
const db = require("../config/mongo");
const Tukang = db.collection("tukangs");
const User = db.collection("users");
const Order = db.collection("orders");

let idOrder
let idUser
let idTukang

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
    idTukang = data.ops[0]._id
  })
  done()
})

afterAll(done => {
  User.deleteOne({ _id: ObjectID(idUser) })
  Tukang.deleteOne({ _id: ObjectID(idTukang) })
  Order.deleteOne({ _id: ObjectID(idOrder) })
  done()
})


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
          expect(status).toBe(200)
          idUser = res.body.id
          expect(body).toHaveProperty('id', expect.any(String))
          expect(body).toHaveProperty('email', 'user1@mail.com')
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
          access_token = res.body.access_token
          expect(body).toHaveProperty('access_token', expect.any(String))
          done()
        })
    })
  })

  describe('Login User Failed', () => {
    test('Response with error message', done => {
      request(app)
        .post('/user/login')
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

describe('Add Order POST /order', () => {
  describe('Add Order List Success', () => {
    test('Response with order list', done => {
      request(app)
        .post('/order/')
        .set('access_token', access_token)
        .send({
          userId: idUser,
          tukangId: idTukang,
          schedule: "09.00"
        })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          idOrder = res.body._id
          expect(status).toBe(201)
          expect(body).toHaveProperty('_id', expect.any(String))
          expect(body).toHaveProperty('userId', expect.any(String))
          expect(body).toHaveProperty('tukangId', expect.any(String))
          expect(body).toHaveProperty('schedule', "09.00")
          expect(body).toHaveProperty('status', 'pending')
          done()
        })
    })
  })
})

describe('Update  Order Put /order', () => {
  describe('Add Order List Success', () => {
    test('Response with order list', done => {
      request(app)
        .put('/order/' + idOrder)
        .set('access_token', access_token)
        .send({
          status: "accepted"
        })
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(201)
          expect(body).toHaveProperty('_id', expect.any(String))
          expect(body).toHaveProperty('userId', expect.any(String))
          expect(body).toHaveProperty('tukangId', expect.any(String))
          expect(body).toHaveProperty('schedule', "09.00")
          expect(body).toHaveProperty('status', 'accepted')
          done()
        })
    })
  })
})

describe('Find All Order Get /order', () => {
  describe('Get Order List Success', () => {
    test('Response with order list', done => {
      request(app)
        .get('/order')
        .set('access_token', access_token)
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(200)
          expect(body).toBeDefined()
          done()
        })
    })
  })
})

describe('Find By Id Tukang Get /order', () => {
  describe('Get Order List Success', () => {
    test('Response with order list', done => {
      request(app)
        .get('/order/tukang/' + idTukang)
        .set('access_token', access_token)
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(200)
          expect(body[0]).toHaveProperty('_id', expect.any(String))
          expect(body[0]).toHaveProperty('userId', expect.any(String))
          expect(body[0]).toHaveProperty('tukangId', expect.any(String))
          expect(body[0]).toHaveProperty('schedule', "09.00")
          expect(body[0]).toHaveProperty('status', 'accepted')
          done()
        })
    })
  })
})

describe('Find By Id User Get /order', () => {
  describe('Get Order List Success', () => {
    test('Response with order list', done => {
      request(app)
        .get('/order/user/' + idUser)
        .set('access_token', access_token)
        .end((err, res) => {
          const { body, status } = res
          if (err) {
            return done(err)
          }
          expect(status).toBe(200)
          expect(body[0]).toHaveProperty('_id', expect.any(String))
          expect(body[0]).toHaveProperty('userId', expect.any(String))
          expect(body[0]).toHaveProperty('tukangId', expect.any(String))
          expect(body[0]).toHaveProperty('schedule', "09.00")
          expect(body[0]).toHaveProperty('status', 'accepted')
          done()
        })
    })
  })
})
