import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

app.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    try {
        const user = await prisma.user.create({
            data: {
                username: body.username,
                password: body.password,
                name: body.name
            }
        });
        const jwt = await sign({
            payload: user.id,

        }, c.env?.JWT_SECRET)
        return c.json(jwt)
    } catch (e) {
        return c.status(403);
    }
})

app.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: body.username,
                password: body.password,
            }
        });
        if (!user){
            c.status(403); //unauthorized
            return c.text("Invalid Email or Password")
        }
        const jwt = await sign({
            payload: user.id,
        }, c.env?.JWT_SECRET)
        
        return c.json(jwt)
    } catch (e) {
        return c.status(403);
    }
})

export default app


