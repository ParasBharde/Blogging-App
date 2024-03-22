import {Hono, MiddlewareHandler} from 'hono'
import { verify } from 'hono/jwt'


export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const authHeader = c.req.header("Authorization")
    const user = await verify(authHeader || "",c.env?.JWT_SECRET)
    console.log('user',user)
    if(user){
        c.set("userId", user.payload)
        await next()
    } else {
        c.status(403)
        c.json({
            message: "You are not logged in"
        })
    }
}



