'use strict';
const assert = require('assert');
const Koa = require('koa2');
require('babel-core/register');
const webpackDevServer = require('koa-webpack-dev');
const serve = require('koa-static-server');
const views = require('koa-views');
const router = require('./server/routes');
const app = new Koa();
const IO = require( 'koa-socket' );


var ReactDOMServer = require('react-dom/server');
var HtmlToReactParser = require('html-to-react').Parser;

var htmlInput = '<div><h1>Title</h1><p>A paragraph</p></div>';
var htmlToReactParser = new HtmlToReactParser();
var reactElement = htmlToReactParser.parse(htmlInput);
var reactHtml = ReactDOMServer.renderToStaticMarkup(reactElement);

assert.equal(reactHtml, htmlInput); // true


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
      broadcast('<div class="msg-area">' + data + '</div>');
      })

function broadcast(data) {io.broadcast('push', data)}

app.listen(3000)
console.log('listening on port 3000')
