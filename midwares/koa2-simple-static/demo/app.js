/**
 * koa2-demo
 */
const path = require("path");
const Koa = require("koa");
const views = require("koa-views");
const logger = require("koa-logger");
const staticServe = require("./index.js");

const PORT = "8011";
const app = new Koa();

app.use(logger())
app.use(staticServe(path.resolve(__dirname + "/public"), {
    vertualPath: "/files",
    expires: 5,
    maxAge: 5,
    compress: true
}))
app.use(views(__dirname + '/views', {extension: "ejs"}));

app.use(async(ctx, next) => {
    if (ctx.path == "/" || ctx.path == "/index") {
        await ctx.render("index", {msg: "welcome"});
    }else {
        await next();
    }
})

app.use(ctx => {
    ctx.status = 404
})

app.listen(PORT, () => {
    console.log(`server start at port ${PORT}`)
})
