;(function(){

    function Promise2(){
        this.cbs = [];
    }
    Promise2.prototype.then = function(success){
        this.cbs.push(success)
    }

    function asyncLoad (options) {
        var res, script, opts;
        if (!options) return console.error("AsyncJs require a string or object as argment");
        if (typeof options === "string") {
            opts = {"js": options};
        } else if(Object.prototype.toString.call(options) === "[object Object]") {
            opts = options
            if (!opts.js) {
                return console.error("opt must has a key which named 'js' as url");
            }
        } else {
            return console.error("AsyncJs require a string or object as argment");
        }

        script = document.createElement("script");
        script.src = opts.js;
        script.onload = function(){
            res.cbs[0]();
        }
        document.body.appendChild(script);

        return res = new Promise2();
    }

    win.AsyncJs = asyncLoad;

})(window)