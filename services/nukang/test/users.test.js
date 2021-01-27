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
      username: 'johndoe',
      password: hashed,
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
      avatar_img: "",
    })
    idTukang = account_tukang.ops[0]._id
    nouser_access_token = encode(account_tukang.ops[0])
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
    test('Response with id, email, and name', async done => {
      try {
        const res = await request(app).post('/user/register')
          .send({ email: 'user1@mail.com', password: 'thisuser', name: 'Saya User' })
        const { body, status } = res
        expect(status).toBe(201)
        idUser = res.body.id
        expect(body).toHaveProperty('id', expect.any(String))
        expect(body).toHaveProperty('email', 'user1@mail.com')
        expect(body).toHaveProperty('name', 'Saya User')
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
          .send({ email: 'user1@mail.com', password: 'thiswrong' })
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


  describe('Login User Failed No Email', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app)
          .post('/user/login')
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

describe('Add Order POST /user/order/', () => {
  describe('Add Order List Success', () => {
    test('Response with added order list', async done => {
      try {
        const res = await request(app).post('/user/order/')
          .set('access_token', access_token)
          .send({
            userId: idUser,
            tukangId: idTukang,
            schedule: "09.00",
            contact: "08002328392",
            address: "Jakarta",
            total_price: 10000,
          })
        const { body, status } = res
        idOrder = res.body._id
        expect(status).toBe(201)
        expect(body).toHaveProperty('_id', expect.any(String))
        expect(body).toHaveProperty('userId', expect.any(String))
        expect(body).toHaveProperty('tukangId', expect.any(String))
        expect(body).toHaveProperty('tukangName', expect.any(String))
        expect(body).toHaveProperty('schedule', "09.00")
        expect(body).toHaveProperty('status', 'pending')
        expect(body).toHaveProperty('contact', '08002328392')
        expect(body).toHaveProperty('address', 'Jakarta')
        expect(body).toHaveProperty('total_price', 10000)
        expect(body).toHaveProperty('comment', expect.any(String))
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Add Order List Failed No User Access Token', () => {
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
        expect(body[0]).toHaveProperty('tukangName', expect.any(String))
        expect(body[0]).toHaveProperty('schedule', "09.00")
        expect(body[0]).toHaveProperty('status', 'pending')
        expect(body[0]).toHaveProperty('contact', '08002328392')
        expect(body[0]).toHaveProperty('address', 'Jakarta')
        expect(body[0]).toHaveProperty('total_price', 10000)
        expect(body[0]).toHaveProperty('comment', expect.any(String))
        done()
      } catch (error) {
        done(error)
      }
    })
  })


  describe('Get Order List Failed No User Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get('/user/order/' + idUser)
          .set('access_token', nouser_access_token)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Only User')
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

describe('Find Tukang Detail Get /user/tukang/:id/detail', () => {
  describe('Get Tukang Detail Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).get(`/user/tukang/${idTukang}/detail`)
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

  describe('Get Tukang Detail Failed No User Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get(`/user/tukang/${idTukang}/detail`)
          .set('access_token', nouser_access_token)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Only User')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get Tukang Detail Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get(`/user/tukang/${idTukang}/detail`)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Please Login First')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get Tukang Detail Error Not Found', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get('/user/tukang/2/detail')
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

describe('Update Order Done PUT /user/order/:id/done', () => {
  describe('Update Order Done Success', () => {
    test('Response with updated order', async done => {
      try {
        const res = await request(app).put(`/user/order/${idTukang}/done`)
          .set('access_token', access_token)
          .send({
            comment: "Sangat Bagus"
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

  describe('Update Order Done Failed No User Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).put(`/user/order/${idTukang}/done`)
          .set('access_token', nouser_access_token)
          .send({
            comment: "Sangat Bagus"
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

  describe('Update Order Done Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).put(`/user/order/${idTukang}/done`)
          .send({
            comment: "Sangat Bagus"
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

  describe('Update Order Done Failed Error Not Found', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).put(`/user/order/2/done`)
          .set('access_token', access_token)
          .send({
            comment: "Sangat Bagus"
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

describe('Find One User Profile GET /user/:id', () => {
  describe('Get User Profile Success', () => {
    test('Response with user profile', async done => {
      try {
        const res = await request(app).get(`/user/${idUser}` )
          .set('access_token', access_token)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toHaveProperty('id', expect.any(String))
        expect(body).toHaveProperty('email', expect.any(String))
        expect(body).toHaveProperty('name', expect.any(String))
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get User Profile Failed No User Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get(`/user/${idUser}` )
          .set('access_token', nouser_access_token)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Only User')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get User Profile Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get(`/user/${idUser}` )
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Please Login First')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get User Profile Error Not Found', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get(`/user/2` )
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

describe('Find All Tukang Data GET /user/tukang', () => {
  describe('Get All Tukang Data Success', () => {
    test('Response with tukang data', async done => {
      try {
        const res = await request(app).get(`/user/tukang` )
          .set('access_token', access_token)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body[0]).toHaveProperty('_id', expect.any(String))
        expect(body[0]).toHaveProperty('username', expect.any(String))
        expect(body[0]).toHaveProperty('password', expect.any(String))
        expect(body[0]).toHaveProperty('role', expect.any(String))
        expect(body[0]).toHaveProperty('name', expect.any(String))
        expect(body[0]).toHaveProperty('location', expect.any(String))
        expect(body[0]).toHaveProperty('category', expect.any(String))
        expect(body[0]).toHaveProperty('small_project_desc', expect.any(String))
        expect(body[0]).toHaveProperty('small_project_price', expect.any(Number))
        expect(body[0]).toHaveProperty('medium_project_desc', expect.any(String))
        expect(body[0]).toHaveProperty('medium_project_price', expect.any(Number))
        expect(body[0]).toHaveProperty('big_project_desc', expect.any(String))
        expect(body[0]).toHaveProperty('big_project_price', expect.any(Number))
        expect(body[0]).toHaveProperty('portofolio_img', expect.any(Array))
        expect(body[0]).toHaveProperty('avatar_img', expect.any(String))
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get All Tukang Data Failed No User Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get(`/user/tukang` )
          .set('access_token', nouser_access_token)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Only User')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get All Tukang Data Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get(`/user/tukang` )
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

describe('Find Order By Tukang GET /user/order/bytukang/:id', () => {
  describe('Get Order By Tukang Success', () => {
    test('Response with order by tukang', async done => {
      try {
        const res = await request(app).get(`/user/order/bytukang/${idTukang}` )
          .set('access_token', access_token)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body[0]).toHaveProperty('_id', expect.any(String))
        expect(body[0]).toHaveProperty('userId', expect.any(String))
        expect(body[0]).toHaveProperty('userName', expect.any(String))
        expect(body[0]).toHaveProperty('tukangId', expect.any(String))
        expect(body[0]).toHaveProperty('tukangName', expect.any(String))
        expect(body[0]).toHaveProperty('schedule', expect.any(String))
        expect(body[0]).toHaveProperty('contact', expect.any(String))
        expect(body[0]).toHaveProperty('address', expect.any(String))
        expect(body[0]).toHaveProperty('total_price', expect.any(Number))
        expect(body[0]).toHaveProperty('comment', expect.any(String))
        expect(body[0]).toHaveProperty('status', expect.any(String))
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get Order By Tukang Failed No User Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get(`/user/order/bytukang/${idTukang}` )
          .set('access_token', nouser_access_token)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Only User')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get Order By Tukang Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get(`/user/order/bytukang/${idTukang}` )
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Please Login First')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get Order By Tukang Error Not Found', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get(`/user/order/bytukang/2` )
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
