const Koa = require('koa')
const Session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const koaBody = require('koa-body');
const routeController = require('./routes/index')
const app = new Koa();
app.keys = ["some secret hurr"];

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024
  }
}));


const CONFIG = {
  key: 'koa:sess', 
  maxAge: 86400000
};
app.use(Session(CONFIG, app));
app.use(async (ctx, next) => {
  console.log(ctx.request.path)
  const origin = ctx.request.header.origin
  ctx.set('Access-Control-Allow-Origin', origin);
  ctx.set('Access-Control-Allow-Credentials', 'true');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PATCH, PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});
app.use(bodyParser());
// routes(app);
app.use(routeController())

module.exports = app;
