/**
 * 
 */

 const path = require("path");
 module.exports = staticServe;


function staticServe (root = "", options = {}) {

    return  async function hanlderStatic(ctx, next){
        ctx.body = ""
        await next()
    }

 }