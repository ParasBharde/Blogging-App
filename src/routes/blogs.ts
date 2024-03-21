import { Hono } from "hono";

const app = new Hono();

app.get("/blog", (context) => {
    return context.text("blog Get")
})

app.post("/blog", (context) => {
    return context.text("blog Data post")
})

export default app


