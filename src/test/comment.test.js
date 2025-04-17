import app from "../app";
import request from 'supertest'
import { adminUser, commentPostOneId, initDataBase, postOneId, user, userId } from "./fixtures/db";
import Comment from "../model/comment";

beforeEach(initDataBase)

test('create comment', async () => { 
    await request(app).post(`/comments/${postOneId}`).send({
        post : postOneId,
        user : userId,
        text : 'day la comment thu 2'
    }).set('Authorization',`Bearer ${user.tokens[0].token}`).expect(201)

    const comment = await Comment.findOne({user:userId,text : 'day la comment thu 2'})
    expect(comment).not.toBeNull()
 })

 test('get comment', async()=>{
    await request(app).get(`/comments/${postOneId}`).set(
        'Authorization', `Bearer ${user.tokens[0].token}`
    ).expect(200)
 })

 test('not owner delete comment', async ()=>{
   await request(app).delete(`/comments/${commentPostOneId}`).set(
        'Authorization', `Bearer ${adminUser.tokens[0].token}`
    ).expect(403)
 })