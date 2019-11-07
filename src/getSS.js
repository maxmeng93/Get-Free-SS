const fs = require('fs');
const path = require('path');
const request = require('request-promise');
const cheerio = require('cheerio');

const { ss: ssConfig, youneed } = require('../config');
const { errLog } = require('./util');

function target1() {
  const ssList = [];
  const url = 'https://www.youneed.win/free-ss';

  return request({ url, ...youneed}).then(body => {
    const $ = cheerio.load(body);
    const trList = $('#container #post-box .context table tbody tr');

    if (trList.length === 0) {
      throw `失败：请检查此页面中的免费SS表格中是否有数据 ${url}`;
    }

    for (let i = 0; i < trList.length; i++) {
      const tdList = trList.eq(i).find('td');
      ssList.push({
        server: tdList.eq(1).text(),
        server_port: tdList.eq(2).text(),
        password: tdList.eq(3).text(),
        method: tdList.eq(4).text() || 'aes-256-cfb',
        plugin: "",
        plugin_opts: "",
        plugin_args: "",
        remarks: tdList.eq(6).text() + ' ' + (Math.ceil(Math.random() * 10000)),
        timeout: 5
      });
    }

    return ssList;
  }).catch(err => {
    console.log(err);
    const errMsg = typeof err === 'string' ? err : `失败：请检查此页面能否正常打开 ${url}`;
    throw errMsg;
  });
}

function saveData(ssList) {
  if (ssList.length === 0) {
    console.log('SS：没有爬取到数据');
    return false;
  }
  const configURL = (ssConfig && ssConfig.url) || '';

  fs.writeFile(path.join(__dirname, '../data/ss.json'), JSON.stringify(ssList, null, 2), (err) => {
    if (err) throw err;
    console.log('SS：数据已保存在 /data/ss.json 文件中');
  });

  if (process.env.APP_TYPE !== 'server' && configURL) {
    fs.readFile(configURL, 'utf8', function (err, data) {
      if (err) {
        throw 'SS：读取软件配置文件失败，请检查 config/ss/url 是否设置正确';
      }

      let config = JSON.parse(data);

      config.configs = ssList;

      fs.writeFile(configURL, JSON.stringify(config, null, 2), 'utf8', (err) => {
          if (err) throw err;
          console.log('SS：gui-config.json文件写入SS列表成功');
      });
    });
  }
}

module.exports = async function getData () {
  if (!ssConfig.enable) return;
  let ssList = [];

  try {
    await target1().then(res => ssList = [].concat(res));
  } catch (error) {
    errLog(error);
  }

  saveData(ssList);
  return ssList;
}
