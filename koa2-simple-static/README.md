# koa2-simple-static
node static files midware 

# usage
```javascript
const Koa = require("koa")
const staticServe = require("./koa2-simple-static")


const PORT = "8020";
const app = new Koa();

// config koa2-simple-static
app.use(staticServe({


}))

app.use((ctx) => {
    ctx.body = "Not Found"
})

app.listen(PORT, () => {
    console.log(`server start at port ${PORT}`)
})

```