const getSS = require('./src/getSS');
const getSSR = require('./src/getSSR');

const path = require('path');
const Koa = require('koa');
const koaStatic = require('koa-static');
const compress = require('koa-compress');

const config = require('./config');
const routers = require('./src/router');

const app = new Koa();
const { server } = config;

if (process.env.NODE_ENV !== 'development') {
  getSS();
  getSSR();
}

if (process.env.APP_TYPE === 'server') {
  app.use(compress());

  app.use(koaStatic(path.join(__dirname, './public')));
  
  app.use(routers.routes()).use(routers.allowedMethods());
  
  app.listen(server.port, async () => {
    console.log(`>>> server listen on http://localhost:${server.port}`);
  });
}
