const request = require('supertest')
const app = require('../app')
const { hash } = require('../helpers/bcrypt-helper')
const { encode, decode } = require("../helpers/jwt-helper")
const db = require("../config/mongo");
const Tukang = db.collection("tukangs");
const Order = db.collection("orders");
const User = db.collection("users");
const path = '/home/opik/Desktop/hacktiv8/iniserser2/nukang-server/services/nukang/test/tes.jpeg'
const notImgPath = '/home/opik/Desktop/hacktiv8/iniserser2/nukang-server/services/nukang/test/tes.txt'
let tukangId
let orderId
let userId
let user_access_token
let tukang_access_token

beforeAll(async done => {
  try {
    let hashedTukang = hash('thistukang')
    let hashedUser = hash('thisuser')
    const account_tukang = await Tukang.insertOne({
      username: 'johndoe',
      password: hashedTukang,
      role: 'tukang',
      name: "",
      location: "",
      category: "",
      small_project_desc: "",
      small_project_price: 0,
      medium_project_desc: "",
      medium_project_price: 0,
      big_project_desc: "",
      big_project_price: 0,
      portofolio_img: [],
      avatar_img: {},
    })
    tukangId = account_tukang.ops[0]._id
    tukang_access_token = encode(account_tukang.ops[0])
    const account_user = await User.insertOne({
      email: 'user1@mail.com',
      password: hashedUser,
      role: "user"
    })
    userId = account_user.ops[0]._id
    user_access_token = encode(account_user.ops[0])
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
  Tukang.drop()
  User.drop()
  Order.drop()
  done()
})

describe('Login Tukang POST /tukang/login', () => {
  describe('Login Tukang Success', () => {
    test('Response with access token', async done => {
      try {
        const res = await request(app).post('/tukang/login')
          .send({ username: 'johndoe', password: 'thistukang' })
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toHaveProperty('access_token', expect.any(String))
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Login Tukang Failed No Username', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).post('/tukang/login')
          .send({ username: '', password: 'thistukang' })
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'Please Fill Username')
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
          .send({ username: 'n', password: 'thiswrong' })
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'Invalid Account')
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
          .send({ username: 'johndoe', password: 'thiswrong' })
        const { body, status } = res
        expect(status).toBe(400)
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
            name: 'John Doe',
            location: 'Jakarta',
            category: 'Tukang Bangunan',
            small_project_desc: 'Project Kecil',
            small_project_price: 100000,
            medium_project_desc: 'Project Medium',
            medium_project_price: 200000,
            big_project_desc: 'Project Besar',
            big_project_price: 300000
          })
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toBeDefined()
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Update Tukang Failed Error Not Found', () => {
    test('Response updated error message', async done => {
      try {
        const res = await request(app).put('/tukang/2')
          .set('access_token', tukang_access_token)
          .send({
            name: 'John Doe',
            location: 'Jakarta',
            category: 'Tukang Bangunan',
            small_project_desc: 'Project Kecil',
            small_project_price: 100000,
            medium_project_desc: 'Project Medium',
            medium_project_price: 200000,
            big_project_desc: 'Project Besar',
            big_project_price: 300000
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

describe('Upload Image Avatar PUT /tukang/:id/avatar', () => {
  describe('Upload Image Success', () => {
    test('response image upload success', async done => {
      const res = await request(app).put(`/tukang/${tukangId}/avatar`)
        .set('access_token', tukang_access_token)
        .set("Content-Type", "multipart/form-data")
        .attach('avatar', path)
      const { body, status } = res
      expect(status).toBe(201)
      done()
    })
  })


  describe('Upload Image Failed Not Image Type', () => {
    test('response error message', async done => {
      const res = await request(app).put(`/tukang/${tukangId}/avatar`)
        .set('access_token', tukang_access_token)
        .set("Content-Type", "multipart/form-data")
        .attach('avatar', notImgPath)
      const { body, status } = res
      expect(status).toBe(400)
      done()
    })
  })
})

describe('Upload Images Portofolio PUT /tukang/:id/upload', () => {
  describe('Upload Images Success', () => {
    test('response images upload success', async done => {
      const res = await request(app).put(`/tukang/${tukangId}/upload`)
        .set('access_token', tukang_access_token)
        .set("Content-Type", "multipart/form-data")
        .attach('url', path)
      const { body, status } = res
      expect(status).toBe(201)
      done()
    })
  })

  describe('Upload Images Failed', () => {
    test('response error message', async done => {
      const res = await request(app).put(`/tukang/${tukangId}/upload`)
        .set('access_token', tukang_access_token)
        .set("Content-Type", "multipart/form-data")
        .attach('url', notImgPath)
        .attach('url', notImgPath)
      const { body, status } = res
      expect(status).toBe(400)
      done()
    })
  })
})

describe('Find One Tukang GET /tukang/:id', () => {
  describe('Find Tukang Success', () => {
    test('Response with tukang', async done => {
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

describe('Update Order Accepted PUT /tukang/order/:id/accepted/', () => {
  describe('Update Order Accepted Success', () => {
    test('Response with status accepted order', async done => {
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

describe('Find All by Tukang GET /tukang/order/:id', () => {
  describe('Get Order By Tukang Success', () => {
    test('Response with order by tukang', async (done) => {
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


describe('Update Order Rejected PUT /tukang/order/:id/rejected/', () => {
  describe('update Order Rejected Success', () => {
    test('Response with status rejected', async done => {
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

  describe('Update Order Rejected Failed No Tukang Access Token', () => {
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

  describe('Update Order List Error Not Found', () => {
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
