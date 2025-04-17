import request from 'supertest'
import { initDataBase,adminUser, user, userId, adminUserId } from './fixtures/db.js'
import app from '../app.js'
import User from '../model/user.js'

beforeEach(initDataBase)

test('register user', async () => { 
    await request(app).post('/auth/register').send({
        name : 'khiem',
        email : 'phamduykhiem@gmail.com',
        password : 'phamduykhiem2911'
    }).expect(201)


    const user = await User.findOne({email:'phamduykhiem@gmail.com'})
    expect(user).not.toBeNull()
 })

 test('login user', async () =>{
   const response = await request(app).post('/auth/login').send({
        email : 'khiempham@gmail.com',
        password : 'phamduykhiem'
    }).expect(200)


    expect(response.body.email).toEqual('khiempham@gmail.com')
 })

 test('login not existing user',async ()=>{
    await request(app).post('/auth/login').send({
        email : 'adasd@gmail.com',
        password : 'asdasdasd'
    }).expect(400)
 })

 test('admin get all users', async () =>{
    await request(app).get('/users').set(
        'Authorization',`Bearer ${adminUser.tokens[0].token}`
    ).send().expect(200)
 })

 test('not admin get all users', async () =>{
    await request(app).get('/users').set(
        'Authorization',`Bearer ${user.tokens[0].token}`
    ).send().expect(403)
 })

 test('admin delete user', async () =>{
     await request(app).delete(`/users/${userId}`).set(
        'Authorization',`Bearer ${adminUser.tokens[0].token}`
    ).send().expect(200)


   const user = await User.findById(userId)
   expect(user).toBeNull()
 })

 test('not admin delete user', async () =>{
    await request(app).delete(`/users/${adminUserId}`).set(
       'Authorization',`Bearer ${user.tokens[0].token}`
   ).send().expect(403)


 
})