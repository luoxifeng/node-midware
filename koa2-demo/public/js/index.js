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