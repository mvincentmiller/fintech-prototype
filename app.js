'use strict';
const Koa = require('koa');
const serve = require('koa-static-server');
const request = require('koa-request');
const views = require('koa-views');
const router = require('koa-router')();
const keys = require('./keys');
const app = new Koa();

const quandlAPIkey = keys.secrets.quandl_api_key;

//cattle futures, CME Group
const commodity = 'CHRIS/CME_LC1';

app.use(serve({rootDir: 'public'}))

app.use(views(__dirname + '/views', { extension: 'ejs' }))

router.get('/quandl', function *() {

     let options = {
       url: 'http://www.quandl.com/api/v3/datasets/' + commodity + '/data.json?api_key='+quandlAPIkey+'&start_date=2017-01-01',
     };

     let response = yield request(options);
     let parsed = JSON.parse(response.body);
     yield this.render('quandl', {names: parsed.dataset_data.column_names, data: parsed.dataset_data.data})
    });

    router.get('/', function *() {

     let options = {
       url: 'http://www.quandl.com/api/v3/datasets/' + commodity + '/data.json?api_key='+quandlAPIkey+'&start_date=2017-01-01',
     };

     let response = yield request(options);
     let parsed = JSON.parse(response.body);
     yield this.render('index', {commodity: commodity, names: parsed.dataset_data.column_names, data: parsed.dataset_data.data})

    });

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000)

console.log('listening on port 3000')
