/**
 * 
 */

const path = require("path")
const resolve = path.resolve;
const join = path.join;
const fs = require("async-file");
const url = require("url");
const mime = require('./mime.js');
const expires = require("./expires");
module.exports = staticServe;

const accepts = Object.keys(mime);


function staticServe (root = "", options = {}) {
    
    return  async function hanlderStatic(ctx, next){
        if (typeof root === "string" && root) {
            new TypeError(`root must be a string`)
        }

        let opts = Object.assign({}, options || {});
        
        if (opts.accepts && !Array.isArray(opts.accepts)) {
            new TypeError(`options.accepts must be a array`)
        }
        if (!opts.accepts) {
            opts.accepts = accepts;
        }
        
        root = resolve(root);

        let req = ctx.req;
        let pathname = url.parse(req.url).pathname;

        //如果路径是"/"，直接跳过裕兴下一个中间件
        if (pathname === "/") return await next();
        if (req.method !== "GET" && req.method !== "HEAD") {
            return await next();
        }
        let realPath = join(root, pathname)
        //文件类型
        let ext = path.extname(realPath);
        ext = ext ? ext.slice("1") : "";
        
        //验证文件类型
        try {
            if (!accepts.includes(ext)) 
                throw new Error(`the file type '${ext}' are not supported `)
        } catch (error) {
            console.error(error.message)
            return await next();
        }
        
        

        /**
         * 容错没找到，会报错，捕获错误跳转下一个中间件
         * 因为这里可能会是请求数据的请求
         */
        let stat
        try {
            stat = await fs.stat(realPath);
        } catch (error) {
            return await next();
        }

        if (!stat.isFile()) {
           await next()
        }

        //验证最后修改时间
        let lastModified = stat.mtime.toUTCString();
        
        if (lastModified === ctx.request.headers['if-modified-since']) {
            ctx.status = 304;
            return ctx.body = "Not Modified";
        }

         /** 
          * 设置响应头
         */
        ctx.set('Content-Type', mime[ext]);

        if (opts.expires) {
            let date = new Date();
            date.setTime(date.getTime() + expires.maxAge*1000);
            ctx.set("Expires", date.toUTCString())
        }

        if(opts.maxAge || opts.maxage) {
            ctx.set("Cache-Control", `max-age=${opts.maxAge || opts.maxage}` )
        }

        ctx.set("Last-Modified", lastModified)


        let rs = fs.createReadStream(realPath)
        return ctx.body = rs;
    
    }

 }