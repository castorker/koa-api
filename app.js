const createError = require('http-errors');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();

const route = require("koa-route");
const parse = require("co-body");

const db = [
    {
        id: 1,
        text: "I'd tell you a chemistry joke but I know I wouldn't get a reaction.",
        category: "Chemistry"
    },
    {
        id: 2,
        text: "Why don't programmers like nature? It has too many bugs.",
        category: "Technology"    
    },
    {
        id: 3,
        text: "Sign on the door of an internet hacker. 'Gone Phishing'.",
        category: "Internet"
    },
    {
        id: 4,
        text: "A crazy programmer with a cold is a coughing hacker.",
        category: "Technology"    
    }
];

function getMaxId() { // ES6
    return db.reduce((max, p) => p.id > max ? p.id : max, db[0].id);
}

const quibbles = {

    getAll: (ctx) => {
        console.log("GET all quibbles");

        // const ids = Object.keys(db);
        // ctx.body = 'quibbles: ' + ids.join(', ');
        // const quibbles = db;

        ctx.body = db.sort(function(a, b) {
            return parseInt(a.id) - parseInt(b.id);
        });
    },
  
    getById: (ctx, id) => {
        console.log("GET quibble by Id: ", id);

        const quibble = db.filter(q => q.id == id);
        if (!quibble) {
            // return ctx.throw('cannot find quibble specified.', 404);
            return new createError.NotFound();
        }

        ctx.body = quibble;
    },

    add: (ctx) => {
        console.log("Add new quibble");

        // ctx.body = `Request Body: ${JSON.stringify(ctx.request.body)}`;
        quibble = `${JSON.stringify(ctx.request.body)}`;

        if (!quibble) {
            // ctx.throw('Bad request', 400);
            return new createError.BadRequest();
        }

        quibble = JSON.parse(quibble);

        lastId = (db.length === 0) ? 0 : getMaxId();
        quibble.id = lastId + 1;
        db.push(quibble);
        ctx.status = 201; // CREATED OK
    },

    update: (ctx, id) => {
        console.log("Update a quibble");

        quibble = `${JSON.stringify(ctx.request.body)}`;

        if (!quibble) {
            // ctx.throw('Bad request', 400);
            return new createError.BadRequest();
        }

        var index = db.findIndex(obj => obj.id == id);
        if ( index == -1) {
            // return ctx.throw('cannot find quibble specified.', 404);
            return new createError.NotFound();
        }

        db.splice(index, 1);

        db.push(JSON.parse(quibble));
        ctx.status = 200;
    },

    delete: (ctx, id) => {
        console.log("Delete a quibble");

        var index = -1;
        if (id % 1 === 0) { 
            index = db.findIndex(obj => obj.id == id);
            if ( index == -1) { 
                //return ctx.throw('cannot find quibble specified.', 404);
                return new createError.NotFound();
            }
        }

        db.splice(index, 1);
        ctx.status = 200;
    }
};

app.use(koaBody());

app.use(route.get('/quibbles', quibbles.getAll));
app.use(route.get('/quibbles/:id', quibbles.getById));
app.use(route.post('/quibble', quibbles.add));
app.use(route.put('/quibbles/:id', quibbles.update));
app.use(route.patch('/quibbles/:id', quibbles.update));
app.use(route.delete('/quibbles/:id', quibbles.delete));

app.listen(7000);
console.log("The app is listening at port 7000");
