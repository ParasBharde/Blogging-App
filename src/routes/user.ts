import { Hono } from "hono";

const app = new Hono();

app.get("/getuser", (context) => {
    return context.text("User Get")
})

app.post("/postuser", (context) => {
    return context.text("User Data post")
})

export default app


