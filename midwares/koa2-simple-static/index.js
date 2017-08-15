/**
 * 
 */

const path = require("path")
const resolve = path.resolve;
const join = path.join;
const fs = require("async-file");
const url = require("url");
const mime = require('./mime.js');
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
        let arr = pathname.split(".");
        let ext = arr[arr.length -1];//文件类型
        //验证文件类型
        try {
            if (!accepts.includes(ext)) 
                throw new Error(`the file type '${ext}' are not supported `)
        } catch (error) {
            console.error(error.message)
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

        if (stat.isFile()) {
            /**
             * 验证文件类型
             */
            
            ctx.set('Content-Type', mime[ext]);
            let rs = fs.createReadStream(realPath)
            // rs.pipe(ctx.res)
            return ctx.body = rs;
            // await next()
        } else {
            await next()
        }
        

        // ctx.body = ""
        // await next()
    }

 }