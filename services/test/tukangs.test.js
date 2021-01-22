// const request = require('supertest')
// const app = require('../app')

// let access_token

// describe('Login Tukang POST /tukang/login', () => {
//   describe('Login Tukang Success', () => {
//     test('Response with access token', done => {
//       request(app)
//         .post('/tukang/login')
//         .send({ email: 'john@mail.com', password: 'thistukang' })
//         .end((err, res) => {
//           const { body, status } = res
//           if (err) {
//             return done(err)
//           }
//           access_token = req.body.access_token
//           expect(status).toBe(200)
//           expect(body).toHaveProperty(expect.any(String))
//           done()
//         })
//     })
//   })

//   describe('Login Password Wrong', () => {
//     test('Response Invalid Email/Password', done => {
//       request(app)
//         .post('/tukang/login')
//         .send({ email: 'john@mail.com', password: 'thiswrong' })
//         .end((err, res) => {
//           const { body, status } = res
//           if (err) {
//             return done(err)
//           }
//           expect(status).toBe(400)
//           expect(body).toHaveProperty('message', 'Invalid Email/Password')
//           done()
//         })
//     })
//   })

//   describe('Login Email/Password Empty', () => {
//     test('Response Invalid Account', done => {
//       request(app)
//         .post('/tukang/login')
//         .send({ email: '', password: '' })
//         .end((err, res) => {
//           const { body, status } = res
//           if (err) {
//             return done(err)
//           }
//           expect(status).toBe(400)
//           expect(body).toHaveProperty('message', 'Invalid Account')
//           done()
//         })
//     })
//   })
// })

// describe('Find All Order Get /tukang', () => {
//   describe('Get Order List Success', () => {
//     test('Response with order list', done => {
//       request(app)
//         .get('/tukang/order')
//         .set('access_token', access_token)
//         .end((err, res) => {
//           const { body, status } = res
//           if (err) {
//             return done(err)
//           }
//           expect(status).toBe(200)
//           expect(body).toBeDefined()
//           done()
//         })
//     })
//   })
// })

// describe('Find Profile Get /tukang', () => {
//   describe('Get Profile Tukang', () => {
//     test('Response with profile tukang', done => {
//       request(app)
//         .get('/tukang/profile')
//         .set('access_token', access_token)
//         .end((err, res) => {
//           const { body, status } = res
//           if (err) {
//             return done(err)
//           }
//           expect(status).toBe(200)
//           expect(body).toBeDefined()
//           done()
//         })
//     })
//   })
// })


// describe('Update Tukang PUT /tukang/:id', () => {
//   describe('Update Tukang Success', () => {
//     test('Response updated tukang', done => {
//       request(app)
//         .put('/tukang/' + idTukang)
//         .set('access_token', access_token)
//         .send({
//           name: 'Jone Slektemb',
//           location: 'Kota Semarang',
//           category: 'Tukang Bangunan',
//           price: 100000
//         })
//         .end((err, res) => {
//           const { body, status } = res
//           if (err) {
//             return done(err)
//           }
//           expect(status).toBe(200)
//           expect(body).toHaveProperty('name', 'Jone Slektemb')
//           expect(body).toHaveProperty('location', 'Kota Semarang')
//           expect(body).toHaveProperty('category', 'Tukang Bangunan')
//           expect(body).toHaveProperty('price', 100000)
//           done()
//         })
//     })
//   })

//   describe('Update Tukang Error No Token', () => {
//     test('Response Unauthorized Error Message', done => {
//       request(app)
//         .put('/tukang/' + idTukang)
//         .set('access_token', '')
//         .send({
//           name: 'Jone Slektemb',
//           location: 'Kota Semarang',
//           category: 'Tukang Bangunan',
//           price: 100000
//         })
//         .end((err, res) => {
//           const { body, status } = res
//           if (err) {
//             return done(err)
//           }
//           expect(status).toBe(401)
//           expect(body).toHaveProperty('message', 'Please Login First')
//           done()
//         })
//     })
//   })
// })
