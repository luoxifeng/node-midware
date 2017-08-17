/**
 * koa2-bodypaser
 */
const qs = require("querystring");

module.exports = function bodyPaser(opts){

    return async (ctx, next) => {
        if (ctx.method == "POST") {
            let { request, req } = ctx;
            let contType = request.headers["content-type"];
            let str = "";
            await (new Promise((resolve, reject) => {
                req.on("data", function(data, err){
                    str += data.toString()
                })

                req.on("end", function(){
                    resolve(str)
                })

                req.on("error", function(err){
                    reject(err)
                })
            }))

            if (/x-www-urlencoded/.test(contType)) {
                request.body = qs.parse(str)
            }
        } 
        await next();
    }
}