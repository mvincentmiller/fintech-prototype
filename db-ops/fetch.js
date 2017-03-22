const request = require('koa2-request');
const firebase = require("firebase");
const admin = require("firebase-admin");
const keys = require('../keys');
const QUANDLAPIKEY = keys.s.quandl_api_key;
const SERVICEACCOUNT = keys.s.fireSA;
const FIREBASECONFIG = keys.s.fireConfig;
let F = 0;
let Q = 0;


firebase.initializeApp(FIREBASECONFIG)
admin.initializeApp({
    credential: admin.credential.cert(SERVICEACCOUNT),
    databaseURL: "https://koa-fintech.firebaseio.com"
});
let db = admin.database();

module.exports = {
  queryQuandl: async function (commodity, ctx, next) {
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
  },
  queryFirebase: async function (ctx, next) {
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
}
