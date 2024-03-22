import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from "hono/jwt";

const blogApp = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string
    }
}>();


blogApp.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization")
    const user = await verify(authHeader || "",c.env?.JWT_SECRET)
    if(user){
        c.set("userId", user.id)
        await next()
    } else {
        c.status(403)
        c.json({
            message: "You are not logged in"
        })
    }
})

blogApp.post("/create-blog", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const userId = c.get("userId")
    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(userId)
        }
    })

    return c.json({
        id: blog.id
    })
})

blogApp.put("/update-blog", async (context) => {
    const prisma = new PrismaClient({
        datasourceUrl: context.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await context.req.json();
    const blog = await prisma.blog.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
            
        }
    })
    return context.json({
        id: blog.id
    })
})

blogApp.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const data = prisma.blog.findMany()
        return c.json({
            data
        })
    } catch (e) {
        c.status(404)
        return c.json({
            message: "Error While fetching blog post"
        })
    }
})

blogApp.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const id = c.req.param("id")
    try {
        const data = prisma.blog.findFirst({
            where: {
                id: Number(id)
            }
        })
        return c.json({
            data
        })
    } catch (e) {
        c.status(404)
        return c.json({
            message: "Error While fetching blog post"
        })
    }
})



export default blogApp


