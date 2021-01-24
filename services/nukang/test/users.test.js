const request = require('supertest')
const app = require('../app')
const { hash } = require('../helpers/bcrypt-helper')
const { encode } = require("../helpers/jwt-helper")
const { ObjectID } = require('mongodb');
const db = require("../config/mongo");
const Tukang = db.collection("tukangs");
const User = db.collection("users");
const Order = db.collection("orders");

let idOrder
let idUser
let idTukang
let nouser_access_token

beforeAll(async done => {
  try {
    let hashed = hash('thistukang')
    const account_tukang = await Tukang.insertOne({
      email: 'john@mail.com',
      password: hashed,
      name: "",
      location: "",
      category: "",
      price: 0,
    })
    idTukang = account_tukang.ops[0]._id
    nouser_access_token = encode(account_tukang)
    done()
  } catch (error) {
    done(error)
  }
})

afterAll(done => {
  User.deleteOne({ _id: ObjectID(idUser) })
  Tukang.deleteOne({ _id: ObjectID(idTukang) })
  Order.deleteOne({ _id: ObjectID(idOrder) })
  done()
})

describe('Register User POST /user/register', () => {
  describe('Register User Success', () => {
    test('Response with id and email', async done => {
      try {
        const res = await request(app).post('/user/register')
          .send({ email: 'user1@mail.com', password: 'thisuser' })
        const { body, status } = res
        expect(status).toBe(201)
        idUser = res.body.id
        expect(body).toHaveProperty('id', expect.any(String))
        expect(body).toHaveProperty('email', 'user1@mail.com')
        done()
      } catch (error) {
        done(error)
      }
    })
  })


  describe('Register User Failed No Email', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).post('/user/register')
          .send({ email: '', password: 'thisuser' })
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'Please Fill Email')
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('Login User POST /user/login', () => {
  describe('Login User Success', () => {
    test('Response with access token', async done => {
      try {
        const res = await request(app)
          .post('/user/login')
          .send({ email: 'user1@mail.com', password: 'thisuser' })
        const { body, status } = res
        expect(status).toBe(200)
        access_token = res.body.access_token
        expect(body).toHaveProperty('access_token', expect.any(String))
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Login User Failed Invalid Account', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).post('/user/login')
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

  describe('Login User Failed', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app)
          .post('/user/login')
          .send({ email: 'n@mail.com' })
        const { body, status } = res
        expect(body).toHaveProperty('message', 'Invalid Account')
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('Add Order POST /user/order/', () => {
  describe('Add Order List Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).post('/user/order/')
          .set('access_token', access_token)
          .send({
            userId: idUser,
            tukangId: idTukang,
            schedule: "09.00"
          })
        const { body, status } = res
        idOrder = res.body._id
        expect(status).toBe(201)
        expect(body).toHaveProperty('_id', expect.any(String))
        expect(body).toHaveProperty('userId', expect.any(String))
        expect(body).toHaveProperty('tukangId', expect.any(String))
        expect(body).toHaveProperty('schedule', "09.00")
        expect(body).toHaveProperty('status', 'pending')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Add Order List Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).post('/user/order/')
          .send({
            userId: idUser,
            tukangId: idTukang,
            schedule: "09.00"
          })
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Please Login First')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Add Order List Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).post('/user/order/')
        .set('access_token', nouser_access_token)
          .send({
            userId: idUser,
            tukangId: idTukang,
            schedule: "09.00"
          })
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Only User')
        done()
      } catch (error) {
        done(error)
      }
    })
  })


  describe('Add Order List Failed User Id Required', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).post('/user/order/')
          .set('access_token', access_token)
          .send({
            userId: null,
            tukangId: idTukang,
            schedule: "09.00"
          })
        const { body, status } = res
        idOrder = res.body._id
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'User ID required')
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})


describe('Find All by User Get /user/order/', () => {
  describe('Get Order List Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).get('/user/order/' + idUser)
          .set('access_token', access_token)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body[0]).toHaveProperty('_id', expect.any(String))
        expect(body[0]).toHaveProperty('userId', expect.any(String))
        expect(body[0]).toHaveProperty('tukangId', expect.any(String))
        expect(body[0]).toHaveProperty('schedule', "09.00")
        expect(body[0]).toHaveProperty('status', expect.any(String))
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get Order List Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get('/user/order/' + idUser)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Please Login First')
        done()
      } catch (error) {
        done(error)
      }
    })
  })


  describe('Get Order List Error Not Found', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get('/user/order/2')
          .set('access_token', access_token)
        const { body, status } = res
        expect(status).toBe(404)
        expect(body).toHaveProperty('message', 'Error Not Found')
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})