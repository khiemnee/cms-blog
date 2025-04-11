import client from "../../../config/redis.js";

export const checkCacheCategories = async (req,res,next) =>{
    try {
        try {
            const categoryKey = 'category'
    
            const cachedKey = await client.get(categoryKey)
    
            if(cachedKey){
                return res.status(200).send(JSON.parse(cachedKey))
            }
    
            req.categoryKey = categoryKey
    
            next()
        } catch (error) {
            res.status(500).send(error.message)
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}