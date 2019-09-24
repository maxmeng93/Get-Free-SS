const fs = require('fs');
const path = require('path');
const request = require('request-promise');
const cheerio = require('cheerio');

const config = require('./config');

function getData() {
  const ssList = [];
  const url = 'https://www.youneed.win/free-ss';
  const configURL = (config && config.configURL) || '';

  request({ url }).then(body => {
    const $ = cheerio.load(body);
    const trList = $('#container #post-box .context table tbody tr');

    if (trList.length === 0) {
      console.log(`目标网站爬取 SS 列表失败，请检查 ${url} 是否有 免费SS 列表表格。`);
      return;
    }

    for (let i = 0; i < trList.length; i++) {
      ssList.push({
        server: trList.eq(i).find('td').eq(0).text(),
        server_port: trList.eq(i).find('td').eq(1).text(),
        password: trList.eq(i).find('td').eq(2).text(),
        method: trList.eq(i).find('td').eq(3).text() || 'aes-256-cfb',
        plugin: "",
        plugin_opts: "",
        plugin_args: "",
        remarks: trList.eq(i).find('td').eq(5).text() + ' ' + (Math.ceil(Math.random() * 10000)),
        timeout: 5
      });
    }

    fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(ssList, null, 2), (err) => {
      if (err) throw err;
      console.log('数据已保存在 data.json 文件中，请自行替换 SS 软件的 gui.config.json 文件的 configs。');
    });

    if (configURL) {
      fs.readFile(configURL, 'utf8', function (err, data) {
        if (err) {
          console.log('读取 SS 软件配置文件失败，请检查文件路径（config.js文件中的configURL）是否设置正确');
          return;
        }

        let config = JSON.parse(data);
        config.configs = ssList;
  
        fs.writeFile(configURL, JSON.stringify(config, null, 2), 'utf8', (err) => {
            if (err) throw err;
            console.log('gui-config.json文件写入SS列表成功');
        });
      });
    }

  }).catch(err => {
    console.log(`网站无法爬取，请检查 ${url} 是否可以正常打开。`);
  });
}

getData();
