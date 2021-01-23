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
    test('Response with access token', async done => {
      try {
        const res = await request(app).post('/user/register')
          .send({ email: 'user1@mail.com', password: 'thisuser' })
        const { body, status } = res
        expect(status).toBe(200)
        idUser = res.body.id
        expect(body).toHaveProperty('id', expect.any(String))
        expect(body).toHaveProperty('email', 'user1@mail.com')
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

describe('Add Order POST /order', () => {
  describe('Add Order List Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).post('/order/')
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
        const res = await request(app).post('/order/')
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
})

describe('Update Order Accepted Put /order', () => {
  describe('Add Order List Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).put('/order/accepted/' + idOrder)
          .set('access_token', access_token)
          .send({
            status: "accepted"
          })
        const { body, status } = res
        expect(status).toBe(201)
        expect(body).toHaveProperty('_id', expect.any(String))
        expect(body).toHaveProperty('userId', expect.any(String))
        expect(body).toHaveProperty('tukangId', expect.any(String))
        expect(body).toHaveProperty('schedule', "09.00")
        expect(body).toHaveProperty('status', 'accepted')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Update Order List Failed No Access Token', () => {
    test('Response with error message', async done => {
      const res = await request(app)
        .put('/order/accepted/' + idOrder)
        .send({
          status: "accepted"
        })
      try {
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Please Login First')
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('Update Order Rejected Put /order', () => {
  describe('update Order List Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).put('/order/rejected/' + idOrder)
          .set('access_token', access_token)
          .send({
            status: "rejected"
          })
        const { body, status } = res
        expect(status).toBe(201)
        expect(body).toHaveProperty('_id', expect.any(String))
        expect(body).toHaveProperty('userId', expect.any(String))
        expect(body).toHaveProperty('tukangId', expect.any(String))
        expect(body).toHaveProperty('schedule', "09.00")
        expect(body).toHaveProperty('status', 'rejected')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Update Order List Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).put('/order/rejected/' + idOrder)
          .send({
            status: "rejected"
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
})

describe('Find All Order Get /order', () => {
  describe('Get Order List Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).get('/order')
          .set('access_token', access_token)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toBeDefined()
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get Order List Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get('/order')
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Please Login First')
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('Find All by Tukang Get /order', () => {
  describe('Get Order List Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).get('/order/tukang/' + idTukang)
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

  describe('Get Order List Failed No Access', () => {
    test('Response with error message', async done => {
      const res = await request(app).get('/order/tukang/' + idTukang)
      try {
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Please Login First')
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('Find All by User Get /order', () => {
  describe('Get Order List Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).get('/order/user/' + idUser)
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
    test('Response with order list', async done => {
      try {
        const res = await request(app).get('/order/user/' + idUser)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Please Login First')
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})
