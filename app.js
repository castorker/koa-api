const Koa = require('koa');
const app = new Koa();

app.use(function * () {
    this.body = "koa - next generation web framework for node.js";
});

app.listen(7000);
console.log("The app is listening at port 7000");
