/**
 * 
 */

const path = require("path")
const resolve = path.resolve;
const join = path.join;
const fs = require("async-file");
const url = require("url");
const mime = require('./mime.js');
const zlib = require("zlib");
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
            date.setTime(date.getTime() + parseInt(opts.expires));
            ctx.set("Expires", date.toUTCString())
        }

        if(opts.maxAge || opts.maxage) {
            ctx.set("Cache-Control", `max-age=${opts.maxAge || opts.maxage}` )
        }

        ctx.set("Last-Modified", lastModified)
        let rs = await compressFile(ctx, realPath, opts.compress)
        return ctx.body = rs;
    
    }

}

/**
 * 压缩 我们只对js  css  html 这样的文件进行压缩
 * @param {*} ctx 
 * @param {*} realPath 
 */
async function compressFile(ctx, realPath, compress){
    let ext = path.extname(realPath);
    ext = ext ? ext.slice("1") : "";
    let rs = await fs.createReadStream(realPath)
    if (!compress) return rs;
    if (!/js|css|html/ig.test(ext)) return rs;

    let acceptsEncoding = ctx.request.headers["accept-encoding"] || ""; 
    if (/gzip/.test(acceptsEncoding)) {
        ctx.set("Content-Encoding", "gzip")
        return rs.pipe(zlib.createGzip())
    } else if (/deflate/.test(acceptEncoding)) {
        ctx.set("Content-Enoding", "deflate")
        return rs.pope(zlib.createDeflate())
    }
    return rs;
}


