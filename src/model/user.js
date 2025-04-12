import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import validator from 'validator'
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    role:{
        type:String,
        default : 'user'
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validate : (value) => {
            if(!validator.isEmail(value)){
                throw new Error()
            }
        }
    },
    password : {
        type : String,
        required: true,
    },
    avatar : {
        type : Buffer
    },
    tokens : [
        {
            token : {
                type : Object
            }
        }
    ]

},{
    timestamps: true
})

userSchema.statics.findCredentials = async (email,password) =>{
    const user = await User.findOne({email})

    const isMatched = bcrypt.compare(password,user.password)

    if(!isMatched){
        throw new Error()
    }

    if(!user){
        throw new Error()
    }

    return user

}

userSchema.methods.generateToken = async function () {
    const user = this

    const token = jwt.sign({_id : user._id},process.env.jwt_secretKey)


    user.tokens = user.tokens.concat({token})

    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userobject = user.toObject()

    delete userobject.password
    delete userobject.role
    
    return userobject
}

userSchema.pre('save',async function (next) {
    const user = this


    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
       
})

const User = new mongoose.model('User',userSchema)
export default User