import mongoose from "mongoose"
import User from "../../model/user.js"
import jwt from 'jsonwebtoken'
import Post from "../../model/post.js"
import Category from "../../model/category.js"
import Comment from "../../model/comment.js"

export const userId = new mongoose.Types.ObjectId()
export const adminUserId = new mongoose.Types.ObjectId()
export const postOneId = new mongoose.Types.ObjectId()
export const categoryOneId = new mongoose.Types.ObjectId()
export const commentPostOneId = new mongoose.Types.ObjectId()

export const commentPostOne = {
    _id : commentPostOneId,
    post : postOneId,
    user : userId,
    text : 'day la comment thu 1'
}

export const categoryOne = {
    _id : categoryOneId,
    name : 'programming',
    description : 'Chia sẻ kiến thức, mẹo và kinh nghiệm lập trình với nhiều ngôn ngữ khác nhau'
}

export const postOne = {
    _id : postOneId,
    title : 'đây là tiêu đề có sẵn',
    content : 'đây là nội dung có sẵn',
    category : categoryOneId,
    comments : [
        commentPostOne
    ]
}

export  const user ={
    _id:userId,
    name : 'khiem123',
    email : 'khiempham@gmail.com',
    password : 'phamduykhiem',
    tokens : [
        {token : jwt.sign({_id:userId},process.env.jwt_secretKey)}
    ]
    
}

export const adminUser =  {
    _id: adminUserId,
    name : 'khiemadmin',
    email : 'phamkhiem@gmail.com',
    password : 'khiemphamne',
    role : 'admin',
    tokens : [
        {token : jwt.sign({_id:adminUserId},process.env.jwt_secretKey)}
    ]
}


export const initDataBase = async () =>{
    await User.deleteMany({})
    await Post.deleteMany({})
    await Comment.deleteMany({})
    await Category.deleteMany({})
    await new User(user).save()
    await new User(adminUser).save()
    await new Post(postOne).save()
    await new Category(categoryOne).save()
    await new Comment(commentPostOne).save()
}
