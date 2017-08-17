console.log("static files sever! ")
console.log("static files sever! ")

function dd(){
    var f = 11;
    var d = f + 10;
    console.log(d)

}

fetch("/testpost", {
    method: "post",
    headers: {
        "Content-Type": "application/x-www-urlencoded"
    },
    body: "a=10&b=11&c=12"
})

fetch("/testpost", {
    method: "post",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({s:11,j:22})
})

fetch("/testpost", {
    method: "post",
    headers: {
        "Content-Type": "text/plain"
    },
    body: JSON.stringify({s:11,j:22})
})

