import client from "../../redis/redis.js"




export const checkCachePost = async (req,res,next) =>{
    try {
        const postKey = `posts:${JSON.stringify(req.params.id)}`
        const postViews = `posts:${JSON.stringify(req.params.id)}:views`

        const cachedKey = await client.get(postKey)

        if(cachedKey){
            await client.incr(postViews)
            const postViewsKey = await client.get(postViews)
            const post = JSON.parse(cachedKey)
          
            return res.status(200).send({post,postViewsKey})
        }

        req.postKey = postKey
        req.postViews = postViews

        next()
    } catch (error) {
        res.status(500).send(error.message)
    }
}