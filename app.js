'use strict';
const assert = require('assert');
const keys = require('./keys');
const firebase = require("firebase");
const admin = require("firebase-admin");
const Koa = require('koa2');
const webpackDevServer = require('koa-webpack-dev');
const serve = require('koa-static-server');
const request = require('koa2-request');
const views = require('koa-views');
const router = require('koa-router')();
const app = new Koa();
const SERVICEACCOUNT = keys.s.fireSA;
const FIREBASECONFIG = keys.s.fireConfig;
let F = 0;
const QUANDLAPIKEY = keys.s.quandl_api_key;
let Q = 0;
const IO = require( 'koa-socket' );

firebase.initializeApp(FIREBASECONFIG)
admin.initializeApp({
    credential: admin.credential.cert(SERVICEACCOUNT),
    databaseURL: "https://koa-fintech.firebaseio.com"
});
let db = admin.database();
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

//TODO migrate koa-request -> koa2-request using await
let commodity = 'LBMA/SILVER';
async function queryQuandl(ctx, next) {
  let result = await request({
      url: 'http://www.quandl.com/api/v3/datasets/' + commodity +
          '/data.json?api_key=' + QUANDLAPIKEY + '&start_date=2017-01-01',
      method: 'get',
      headers: {
          'content-type': 'application/json',
          'charset': 'UTF-8'
      },
      json: true
  })
  ctx.result = result.body
  return next();
}

//TODO generators are deprecated, migrate koa routes
router.get('/koa2', (ctx, next) => {
return queryQuandl(ctx, next);
},
  (ctx, next) => {
    ctx.moar = { moar: 'stuff' }
    return next();
},
(ctx) => {
  return ctx.render('x', {
    data: ctx.result.dataset_data.data,
    moar: ctx.moar.moar
  })
})



//TODO Migrate to NVD3.js




router.get('/', function*() {

    let refUsersBob = db.ref("Users/Bob");
    let yF = yield refUsersBob.once("value",
        function(snapshot) {
            F++;
            console.log('app.js: ! ---- FIREBASE REF #' + F + ' ----- !');
            console.log(snapshot.val());
        });
    let fireParsed = JSON.parse(yF.A);
    let UserName = fireParsed['UserProfile'].UserName;
    let Cattle = fireParsed['Commodities'].Cattle;
    let Silver = fireParsed['Commodities'].Silver;

    let commodity = Silver;
    let options = {
        url: 'http://www.quandl.com/api/v3/datasets/' + commodity +
            '/data.json?api_key=' + QUANDLAPIKEY + '&start_date=2017-01-01',
    };

    let response = yield request(options);
    let parsed = JSON.parse(response.body);
    Q++;
    console.log('app.js: ! ---- QUANDL API HIT #' + Q + '----- !');
    yield this.render('profile', {
        commodity: commodity,
        names: parsed.dataset_data.column_names,
        data: parsed.dataset_data.data,
        user: UserName,
        commodities: fireParsed['Commodities']
    })
    broadcast('app.js: ! ---- QUANDL API HIT #' + Q + '----- !');
});

router.get('/silver', function*() {
    let commodity = 'LBMA/SILVER';
    let options = {
        url: 'http://www.quandl.com/api/v3/datasets/' + commodity +
            '/data.json?api_key=' + QUANDLAPIKEY + '&start_date=2017-01-01',
    };

    let response = yield request(options);
    let parsed = JSON.parse(response.body);
    Q++;
    console.log('app.js: ! ---- QUANDL API HIT #' + Q + '----- !');
    yield this.render('silver', {
        commodity: commodity,
        names: parsed.dataset_data.column_names,
        data: parsed.dataset_data.data
    })

});

router.get('/cattle', function*() {

    //cattle futures, CME Group
    let commodity = 'CHRIS/CME_LC1';

    let options = {
        url: 'http://www.quandl.com/api/v3/datasets/' + commodity + '/data.json?api_key=' +
            QUANDLAPIKEY + '&start_date=2017-01-01'
    };
    let response = yield request(options);
    Q++;
    console.log('app.js: ! ---- QUANDL API HIT #' + Q + ' ----- !');
    let parsed = JSON.parse(response.body);
    yield this.render('cattle', {
        commodity: commodity,
        names: parsed.dataset_data.column_names,
        data: parsed.dataset_data.data
    })
});

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
