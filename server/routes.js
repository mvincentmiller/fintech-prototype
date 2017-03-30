const router = require('koa-router')();
const fetch = require('./fetch');

console.log('in routes');

router.get('/react', (ctx, next) => {
return ctx.render('react')
});

router.get('/', (ctx, next) => {
return fetch.queryFirebase(ctx, next);
},
  (ctx, next) => {
let commodity = 'LBMA/SILVER';
return fetch.queryQuandl(commodity, ctx, next);
},
(ctx) => {
  let fireParsed = ctx.FirebaseResult;
  let UserName = fireParsed['UserProfile'].UserName;
  let Cattle = fireParsed['Commodities'].Cattle;
  let Silver = fireParsed['Commodities'].Silver;
  return ctx.render('profile', {
      commodity: Silver,
      names: ctx.QuandlResult.dataset_data.column_names,
      data: ctx.QuandlResult.dataset_data.data,
      user: UserName,
      commodities: fireParsed['Commodities']
  })
})

//TODO Migrate to NVD3.js

router.get('/silver', (ctx, next) =>  {
    ctx.commodity = 'LBMA/SILVER';
    return fetch.queryQuandl(ctx.commodity, ctx, next);
  }, (ctx) => {
    return ctx.render('silver', {
    commodity: 'LBMA/SILVER',
    names: ctx.QuandlResult.dataset_data.column_names,
    data: ctx.QuandlResult.dataset_data.data
})
  });

  router.get('/cattle', (ctx, next) =>  {
      ctx.commodity = 'CHRIS/CME_LC1';
      return fetch.queryQuandl(ctx.commodity, ctx, next);
    }, (ctx) => {
      return ctx.render('cattle', {
      commodity: ctx.commodity,
      names: ctx.QuandlResult.dataset_data.column_names,
      data: ctx.QuandlResult.dataset_data.data
  })
    });

module.exports = router;
