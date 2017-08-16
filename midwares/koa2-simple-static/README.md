# koa2-simple-static
node static files midware 

# feature
* Expires, Cache-Control(max-age)
    
```javascript
app.use(staticServe{
    expires: 7*24*60*60*1000,
    maxAge: 7*24*60*60// or maxage: 7*24*60*60
})
```
* Compress supported

```javascript
app.use(staticServe{
    compress: true,//["gzip", "deflate"]
})
```

* Vertual Path Supported

```javascript
app.use(staticServe{
    vertualPath: "/files"
})
```

# usage
```javascript
const Koa = require("koa")
const staticServe = require("./koa2-simple-static")


const PORT = "8020";
const app = new Koa();

// config koa2-simple-static
app.use(staticServe({
    expires: 7*24*60*60*1000,
    maxAge: 7*24*60*60,
    compress: true
}))

//or 
app.use(staticServe(path.resolve(__dirname + "/public"), {
    virtualPath: "/file"
    expires: 7*24*60*60*1000,
    maxAge: 7*24*60*60,
    compress: true
}))

app.listen(PORT, () => {
    console.log(`server start at port ${PORT}`)
})

```

# reference
* **[Node.js静态文件服务器实战](http://www.infoq.com/cn/news/2011/11/tyq-nodejs-static-file-server)**

* **[用nodejs做一个简易的静态资源服务器](http://www.jianshu.com/p/130110d58fec)**