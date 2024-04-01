import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from "hono/jwt";
import { authMiddleware } from "../middleware";
import { blogSchema, blogupdateSchema } from "@parasbarde/zod-validation";


const blogApp = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string
    }
}>();


// blogApp.use("/*", async (c, next) => {
//     const authHeader = c.req.header("Authorization")
//     const payload = await verify(authHeader || "", c.env?.JWT_SECRET)
//     if (payload) {
//         c.set("userId", payload.payload)
//         await next()
//     } else {
//         c.status(403)
//         c.json({
//             message: "You are not logged in"
//         })
//     }
// })

blogApp.post("/create", authMiddleware, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const {success} = blogSchema.safeParse(body)
    const userId = c.get("userId")
    if (!success) {
        c.status(411)
        return c.json("Input worngs")
    } else {
        const blog = await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: parseInt(userId)
            }
        })
    
        return c.json({
            id: blog.id
        })
    }

})

blogApp.put("/", authMiddleware, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const {success} = blogupdateSchema.safeParse(body)
    const userId = c.get("userId")
    if (!success) {
        c.status(411)
        return c.json("Input worngs")
    } else {
        const blog = await prisma.blog.update({
            where: {
                id: body.id,
                authorId: Number(userId)
            },
            data: {
                title: body.title,
                content: body.content
    
            }
        })
        return c.json({
            id: blog.id
        })
    }
 
})


blogApp.get('/blog/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const  id  = c.req.param('id')
    console.log('id', id)
    
        const getdata = await prisma.blog.findFirst({
            where: {
                id: parseInt(id)
            }
        })
        return c.json({
            data: getdata
        })
   
})

blogApp.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    let page = Number(c.req.query('page')) || 1;
    let limit = Number(c.req.query('limit')) || 3;
    let skip = (page - 1) *  limit;
    const data = await prisma.blog.findMany({skip, take:limit})
    return c.json({
        data
    })

})

export default blogApp


