import { Hono } from 'hono'
import user from './user'
import blog from './blogs'
const app = new Hono()

app.get("/user ", (context) => {
    return context.text("Hello User")
})

app.route("/user",user)
app.route("/blogs",blog)


export default app
