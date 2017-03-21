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


async function queryFirebase (ctx, next) {
let refUsersBob = db.ref("Users/Bob");
let yF = await refUsersBob.once("value",
    function(snapshot) {
        F++;
        console.log('app.js: ! ---- FIREBASE REF #' + F + ' ----- !');
        console.log(snapshot.val());
    });

ctx.FirebaseResult = JSON.parse(yF.A);
return next();
}

async function queryQuandl(commodity, ctx, next) {
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
  Q++;
  console.log('! ---- QUANDL API HIT #' + Q + '----- !');
  ctx.QuandlResult = result.body
  return next();
}

router.get('/', (ctx, next) => {
return queryFirebase(ctx, next);
},
  (ctx, next) => {
let commodity = 'LBMA/SILVER';
return queryQuandl(commodity, ctx, next);
},
(ctx) => {
  let fireParsed = ctx.FirebaseResult;
  let UserName = fireParsed['UserProfile'].UserName;
  let Cattle = fireParsed['Commodities'].Cattle;
  let Silver = fireParsed['Commodities'].Silver;
  return ctx.render('profile', {
      commodity: 'LBMA/SILVER',
      names: ctx.QuandlResult.dataset_data.column_names,
      data: ctx.QuandlResult.dataset_data.data,
      user: UserName,
      commodities: fireParsed['Commodities']
  })
})

//TODO Migrate to NVD3.js

router.get('/silver', (ctx, next) =>  {
    ctx.commodity = 'LBMA/SILVER';
    return queryQuandl(ctx.commodity, ctx, next);
  }, (ctx) => {
    return ctx.render('silver', {
    commodity: 'LBMA/SILVER',
    names: ctx.QuandlResult.dataset_data.column_names,
    data: ctx.QuandlResult.dataset_data.data
})
  });

  router.get('/cattle', (ctx, next) =>  {
      ctx.commodity = 'CHRIS/CME_LC1';
      return queryQuandl(ctx.commodity, ctx, next);
    }, (ctx) => {
      return ctx.render('cattle', {
      commodity: ctx.commodity,
      names: ctx.QuandlResult.dataset_data.column_names,
      data: ctx.QuandlResult.dataset_data.data
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
