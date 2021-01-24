const request = require('supertest')
const app = require('../app')
const { hash } = require('../helpers/bcrypt-helper')
const { encode } = require("../helpers/jwt-helper")
const db = require("../config/mongo");
const multer = require
const { ObjectID } = require('mongodb');
const Tukang = db.collection("tukangs");
const Order = db.collection("orders");
const User = db.collection("users");
const TukangController = require('../controllers/tukang-controller')
let tukangId
let orderId
let userId
let user_access_token

beforeAll(async done => {
  try {
    let hashedTukang = hash('thistukang')
    let hashedUser = hash('thisuser')
    const account_tukang = await Tukang.insertOne({
      email: 'john@mail.com',
      password: hashedTukang,
      role: "tukang",
      name: "",
      location: "",
      category: "",
      price: 0,
      portofolio_img: []
    })
    tukangId = account_tukang.ops[0]._id
    const account_user = await User.insertOne({
      email: 'user1@mail.com',
      password: hashedUser,
      role: "user"
    })
    userId = account_user.ops[0]._id
    user_access_token = encode(account_user)
    const user_order = await Order.insertOne({
      userId: userId,
      tukangId: tukangId,
      schedule: "09.00",
      status: "pending"
    })
    orderId = user_order.ops[0]._id
    done()
  } catch (error) {
    done(error)
  }
})

afterAll(done => {
  Tukang.deleteOne({ _id: ObjectID(tukangId) })
  User.deleteOne({ _id: ObjectID(userId) })
  Order.deleteOne({ _id: ObjectID(orderId) })
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
  // describe('Update Tukang Success', () => {
  //   test('Response updated tukang', async done => {
  //     try {
  //       const res = await request(app).put('/tukang/' + tukangId)
  //         .set('access_token', tukang_access_token)
  //         .send({
  //           name: 'Jone Slektemb',
  //           location: 'Kota Semarang',
  //           category: 'Tukang Bangunan',
  //           price: 100000,
  //           portofolio_img: 'https://jestjs.io/en',
  //         })
  //       const { body, status } = res
  //       expect(status).toBe(200)
  //       expect(body).toBeDefined()
  //       done()
  //     } catch (error) {
  //       done(error)
  //     }
  //   })
  // })


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

  describe('Find Tukang Failed No Tukang Access Token', () => {
    test('Response error message', async done => {
      try {
        const res = await request(app).get('/tukang/' + tukangId)
          .set('access_token', user_access_token)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toBeDefined()
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Find Tukang Failed Error Not Found', () => {
    test('Response error message', async done => {
      try {
        const res = await request(app).get('/tukang/2')
          .set('access_token', tukang_access_token)
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

describe('Update Order Accepted Put /tukang/order/:id/accepted/', () => {
  describe('Update Order List Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).put(`/tukang/order/${orderId}/accepted/`)
          .set('access_token', tukang_access_token)
          .send({
            status: "accepted"
          })
        const { body, status } = res
        expect(status).toBe(200)
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

  describe('Update Order Accepted Failed No Access Token', () => {
    test('Response with error message', async done => {
      const res = await request(app)
        .put(`/tukang/order/${orderId}/accepted/`)
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

  describe('Update Order Accepted Failed No Tukang Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).put(`/tukang/order/${orderId}/accepted/`)
          .set('access_token', user_access_token)
          .send({
            status: "accepted"
          })
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Only Tukang')
        done()
      } catch (error) {
        done(error)
      }
    })
  })


  describe('Update Order List Error Not Found', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).put(`/tukang/order/2/accepted/`)
          .set('access_token', tukang_access_token)
          .send({
            status: "accepted"
          })
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

describe('Find All by Tukang Get /tukang/order/:id', () => {
  describe('Get Order List Success', () => {
    test('Respond with status 200', async (done) => {
      try {
        const res = await request(app)
          .get('/tukang/order/' + tukangId)
          .set('access_token', tukang_access_token)
        expect(res.status).toBe(200);
        done()
      } catch (error) {
        done(error)
      }
    });
  })

  describe('Get Order List Failed No Access', () => {
    test('Response with error message', async done => {
      const res = await request(app).get('/tukang/order/' + tukangId)
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

  describe('Get Order List  Failed No Tukang Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get('/tukang/order/' + tukangId)
          .set('access_token', user_access_token)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Only Tukang')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get Order List Failed Error Not Found', () => {
    test('Respond with error message', async (done) => {
      try {
        const res = await request(app)
          .get('/tukang/order/2')
          .set('access_token', tukang_access_token)
          const { body, status } = res
          expect(status).toBe(404)
          expect(body).toHaveProperty('message', 'Error Not Found')
        done()
      } catch (error) {
        done(error)
      }
    });
  })
})


describe('Update Order Rejected Put /tukang/order/:id/rejected/', () => {
  describe('update Order List Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).put(`/tukang/order/${orderId}/rejected/`)
          .set('access_token', tukang_access_token)
          .send({
            status: "rejected"
          })
        const { body, status } = res
        expect(status).toBe(200)
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

  describe('Update Order Rejected Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).put(`/tukang/order/${orderId}/rejected/`)
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

  describe('update Order Rejected Failed No Tukang Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).put(`/tukang/order/${orderId}/rejected/`)
          .set('access_token', user_access_token)
          .send({
            status: "rejected"
          })
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Only Tukang')
        done()
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('update Order List Error Not Found', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).put(`/tukang/order/2/rejected/`)
          .set('access_token', tukang_access_token)
          .send({
            status: "rejected"
          })
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
