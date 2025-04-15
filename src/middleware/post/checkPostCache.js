import client from "../../redis/redis.js"


export const checkCache = async (req,res,next) =>{
    try {

        const queryKey = `posts:${JSON.stringify(req.query)}`

        const cached = await client.get(queryKey);


        if(cached){
            console.log('ở đây')
            return res.status(200).send(JSON.parse(cached))
        }

        req.queryKey = queryKey

        next()

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const checkCachePost = async (req,res,next) =>{
    try {
        const postKey = `posts:${JSON.stringify(req.params.id)}`
        const postViews = `posts:${JSON.stringify(req.params.id)}:views`

        const cachedKey = await client.get(postKey)

        if(cachedKey){
            await client.incr(postViews)
            const postViewsKey = await client.get(postViews)
            return res.status(200).send(JSON.parse({cachedKey,postViewsKey}))
        }

        req.postKey = postKey
        req.postViews = postViews

        next()
    } catch (error) {
        res.status(500).send(error.message)
    }
}