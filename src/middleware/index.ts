import {Hono} from 'hono'
import { verify } from 'hono/jwt'

const middleware = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables:{
        userId: string
    }
}>()

middleware.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization")
    const user = await verify(authHeader || "",c.env?.JWT_SECRET)
    if(user){
        c.set("userId", user.id)
        next()
    } else {
        c.status(403)
        c.json({
            message: "You are not logged in"
        })
    }
})

export default middleware


