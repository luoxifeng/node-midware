/**
 * koa2-demo
 */

const Koa = require("koa");
const staticServe = require("../midwares/koa2-simple-static");

const PORT = "8011";
const app = new Koa();

app.use(staticServe("public", {}))

app.use(views(__dirname + '/views', "ejs"));

app.use(async () => {
    await ctx.render("index");
})
