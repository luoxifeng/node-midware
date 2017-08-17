# koa2-bodypaser
koa2 bodypaser midware support json text urlencoded

# usage
* node 
```javascript
const Koa = require('koa');
const bodyPaser = require("xxx/koa2-bodypaser");
const app = new Koa();
app.use(bodyPaser())
```

* client (use as usual) 
1. in jQuery
```javascript
$.axja({
    url: "xxxx/xxx/test",
    type: "post",
    data: {
        a: 1,
        b: 2
    }
})
```
2. with Promise lib (axios eg.)
```javascript
axios({
    method: "post",
    url: "xxxx/xxx/test",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        a: 1,
        b: 2
    })
})