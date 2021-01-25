const request = require('supertest')
const app = require('../app')
const db = require("../config/mongo");
const Admin = db.collection("admin");
const User = db.collection("users");
const { hash } = require('../helpers/bcrypt-helper')
const { encode } = require("../helpers/jwt-helper")

let noadmin_access_token

beforeAll(async done => {
  try {
    let hashedUser = hash('thisuser')
    const account_user = await User.insertOne({
      email: 'user1@mail.com',
      password: hashedUser,
      name: "Saya User",
      role: "user"
    })
    noadmin_access_token = encode(account_user.ops[0])
    done()
  } catch (error) {
    done(error)
  }
})

afterAll(done => {
  Admin.drop()
  done()
})

let tukangId
let admin_access_token

describe('Register Admin POST /admin/register', () => {
  describe('Register Admin Success', () => {
    test('Response with access token', async done => {
      try {
        const res = await request(app).post('/admin/register')
          .send({ email: 'admin@mail.com', password: 'thisadmin', role: 'admin' })
        const { body, status } = res
        expect(status).toBe(201)
        expect(body).toHaveProperty('id', expect.any(String))
        expect(body).toHaveProperty('email', 'admin@mail.com')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Register Admin Failed', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).post('/admin/register')
        const { body, status } = res
        expect(status).toBe(500)
        expect(body).toBeDefined()
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Register Admin Failed No Email', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).post('/admin/register')
          .send({ email: ''})
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

describe('Login Admin POST /admin/login', () => {
  describe('Login Admin Success', () => {
    test('Response with access token', async done => {
      const res = await request(app).post('/admin/login')
        .send({ email: 'admin@mail.com', password: 'thisadmin' })
      try {
        const { body, status } = res
        admin_access_token = res.body.access_token
        expect(status).toBe(200)
        expect(body).toHaveProperty('access_token', expect.any(String))
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Login Admin Failed', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).post('/admin/login')
          .send({ email: 'n@mail.com', password: "thiswrong" })
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

describe('Add Tukang POST /admin/tukang', () => {
  describe('Add Tukang Success', () => {
    test('Response added tukang', async done => {
      try {
        const res = await request(app).post('/admin/tukang')
          .set('access_token', admin_access_token)
          .send({
            username: 'johndoe',
            password: 'thistukang',
          })
        const { body, status } = res
        expect(status).toBe(201)
        tukangId = res.body.id
        expect(body).toHaveProperty('id', tukangId)
        expect(body).toHaveProperty('username', 'johndoe')
        expect(body).toHaveProperty('role', 'tukang')
        expect(body).toHaveProperty('name', '')
        expect(body).toHaveProperty('location', '')
        expect(body).toHaveProperty('category', '')
        expect(body).toHaveProperty('small_project_price', 0)
        expect(body).toHaveProperty('big_project_price', 0)
        expect(body).toHaveProperty('portofolio_img', [])

        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Add Tukang Failed No Admin Access Token', () => {
    test('Response error message', async done => {
      const res = await request(app).post('/admin/tukang')
        .set('access_token', noadmin_access_token)
        .send({
          email: 'john@mail.com',
          password: 'thistukang'
        })
      try {
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', "Only Admin")
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Add Tukang Failed No Access Token', () => {
    test('Response error message', async done => {
      const res = await request(app).post('/admin/tukang')
        .send({
          username: 'johndoe',
          password: 'thistukang'
        })
      try {
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', "Please Login First")
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Add Tukang Error No Username', () => {
    test('Response error message', async done => {
      try {
        const res = await request(app).post('/admin/tukang')
          .set('access_token', admin_access_token)
          .send({
            username: '',
            password: 'thistukang'
          })
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'Please Fill Username')
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('Delete Tukang /admin/tukang/:id', () => {
  describe('Delete Tukang Success', () => {
    test('Response delete tukang', async done => {
      const res = await request(app).delete('/admin/tukang/' + tukangId)
        .set('access_token', admin_access_token)
      try {
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toHaveProperty('message', 'success delete')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Delete Tukang Failed No Admin Access Token', () => {
    test('Response error message', async done => {
      const res = await request(app).delete('/admin/tukang/' + tukangId)
        .set('access_token', noadmin_access_token)
      try {
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Only Admin')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Delete Tukang Failed No Access Token', () => {
    test('Response error message', async done => {
      const res = await request(app).delete('/admin/tukang/' + tukangId)
      try {
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', "Please Login First")
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Delete Tukang Error Not Found', () => {
    test('Response error message', async done => {
      const res = await request(app).delete('/admin/tukang/2')
        .set('access_token', admin_access_token)
      try {
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

describe('Find All Order Get /admin/order', () => {
  describe('Get Order List Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).get('/admin/order')
          .set('access_token', admin_access_token)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toBeDefined()
        done()
      } catch (error) {
        done(error)
      }
    })
  })
  
  describe('Get Order List Failed No Admin Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get('/admin/order')
          .set('access_token', noadmin_access_token)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Only Admin')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get Order List Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get('/admin/order')
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


describe('Find All Tukang Get /admin/all-tukang', () => {
  describe('Get Tukang List Success', () => {
    test('Response with order list', async done => {
      try {
        const res = await request(app).get('/admin/all-tukang')
          .set('access_token', admin_access_token)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toBeDefined()
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get Order List Failed No Admin Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get('/admin/all-tukang')
          .set('access_token', noadmin_access_token)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('message', 'Only Admin')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  describe('Get Tukang List Failed No Access Token', () => {
    test('Response with error message', async done => {
      try {
        const res = await request(app).get('/admin/all-tukang')
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