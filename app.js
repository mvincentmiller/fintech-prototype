'use strict';

const Koa = require('koa2');
const webpackDevServer = require('koa-webpack-dev');
const serve = require('koa-static-server');
const views = require('koa-views');
const router = require('./app/routes');
const app = new Koa();
const IO = require( 'koa-socket' );


app.use(webpackDevServer({
    config: './webpack.config.js'
}));
app.use(serve({
    rootDir: 'public'
}))
app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

const io = new IO()

app
    .use(router.routes())
    .use(router.allowedMethods());


io.attach( app )

io.on( 'join', ( ctx, data ) => {
      console.log( 'join event fired', data )

      })

function broadcast(data) {io.broadcast('push', data)}

app.listen(3000)
console.log('listening on port 3000')
