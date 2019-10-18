const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const getSS = require('./getSS');
const getSSR = require('./getSSR');

const { ss: ssConfig, ssr: ssrConfig } = require('../config');

let router = new Router({
  prefix: '/api'
});

const isTimeOut = function (fileURL) {
  return new Promise((resolve, reject) => {

    fs.stat(fileURL, (err, stats) => {

      if (err) reject(err);
      const mtime = new Date(stats.mtime.toLocaleString()).getTime();
      const nowTime = new Date().getTime();
      const time = 1 * 60 * 60 * 1000;

      if (nowTime - mtime > time) resolve(true);
      resolve(false);
    });

  });
}

const getFileData = function(fileURL) {
  return new Promise((resolve, reject) => {

    fs.readFile(fileURL, 'utf8', function (err, data) {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });

  });
}

router.get('/getList', async ctx => {
  const SSURL = path.join(__dirname, '../data/ss.json');
  const SSRURL = path.join(__dirname, '../data/ssr.json');

  let ssList = [];
  let ssrList = [];

  if (ssConfig.enable) {
    try {
      const ssTimeOut = await isTimeOut(SSURL);
      ssList = ssTimeOut ? await getSS() : await getFileData(SSURL);
    } catch (error) {
      console.log(error);
    }
  }

  if (ssrConfig.enable) {
    try {
      const ssrTimeOut = await isTimeOut(SSRURL);
      ssrList = ssrTimeOut ? await getSSR() : await getFileData(SSRURL);
    } catch (error) {
      console.log(error);
    }
  }

  ctx.body = {
    ss: ssList,
    ssr: ssrList,
  }
});

module.exports = router;