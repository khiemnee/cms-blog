import jwt from 'jsonwebtoken'
import User from '../model/user.js'

const checkAuth = async (req,res,next) =>{

    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.decode(token)
        
        const user = await User.findOne({_id:decode._id,'tokens.token':token})
    
        if(!user){
            return res.status(404).send({
                error : 'user not found'
            })
        }

        req.user = user

        next()
    } catch (error) {
        res.status(500).send(error)
    }
   
}

export default checkAuth