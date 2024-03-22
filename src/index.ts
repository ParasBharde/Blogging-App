import { Hono } from 'hono'
import mainRouter from "./routes/index"
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello  Page!')
})
app.route("/api/v1", mainRouter)


export default app
// postgresql://neondb_owner:bNP3cTmWVq2w@ep-old-snowflake-a1fijd8q.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNGMzM2MwZDctNjY3Yy00ZDI3LWJmOTAtOThlMTBlODhjNTU5IiwidGVuYW50X2lkIjoiZDk4OGY2MDQwNTgyOGUyNWJiNjc1Y2M4NTc3MTUzMmM2ZjU3ZTI0NWRlYmM4M2YxNDg3OWZmNjNlNDE5YjkxMSIsImludGVybmFsX3NlY3JldCI6ImY2NmFkZTYxLTQzMGQtNDRhYi05M2E3LTJlMzA0MDcwMWU3YiJ9.ejEUNVBxZO23UVWo8_KVXnkbqdYrtO3EpXoMU30zwjI"
