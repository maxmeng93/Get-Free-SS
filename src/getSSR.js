const fs = require('fs');
const path = require('path');
const request = require('request-promise');
const cheerio = require('cheerio');

const { ssrDecode } = require('./utils');

function target1() {
  const url = 'https://www.youneed.win/free-ssr';
  const ssrLinkList = [];

  return request({ url }).then(body => {
    const $ = cheerio.load(body);
    const trList = $('#container #post-box .context table tbody tr');

    if (trList.length === 0) {
      throw `失败：请检查此页面中的免费SSR表格中是否有数据 ${url}`;
    }

    for (let i = 0; i < trList.length; i++) {
      const a = trList.eq(i).find('td').eq(0).find('a');
      ssrLinkList.push(a.attr('href'))
    }
    return ssrLinkList;

  }).catch(err => {
    const errMsg = typeof err === 'string' ? err : `失败：请检查此页面能否正常打开 ${url}`;
    throw errMsg;
  });
}

function target2() {
  const url = 'https://onessr.ml/articles/getArticles';
  return request({
    method: 'POST',
    url,
    formData: {
      offset: 0,
      pageSize: 4,
    },
    json: true
  }).then(res => {
    const articleContent = res.data && res.data[0] && res.data[0].articleContent || '';
    const list = articleContent.split('\n');
    return list.map(e => {
      if (e) {
        var reg = /(?<=>)[^<>]+(?=<)/g;
        return e.match(reg)[0];
      }
    })
  }).catch(err => {
    throw 'SSR：target2 error';
  });
}

module.exports = async function (ssrConfig) {
  if (!ssrConfig.enable) return;

  let ssrLinkList = [];

  try {
    await target1().then(res => ssrLinkList = [].concat(res));
  } catch (error) {
    throw error;
  }

  try {
    await target2().then(res => {
      const list = res.filter(e => e);
      ssrLinkList = [].concat(list);
    });
  } catch (error) {
    throw error;
  }
  
  const ssrList = ssrDecode(ssrLinkList);
  const configURL = (ssrConfig && ssrConfig.url) || '';

  fs.writeFile(path.join(__dirname, '../data/ssr.json'), JSON.stringify(ssrList, null, 2), (err) => {
    if (err) throw err;
    console.log('SSR：数据已保存在 /data/ssr.json 文件中');
  });

  if (configURL) {
    fs.readFile(configURL, 'utf8', function (err, data) {
      if (err) {
        throw 'SSR：读取软件配置文件失败，请检查 config/ssr/url 是否设置正确';
      }

      let config = JSON.parse(data);
      config.configs = ssrList;

      fs.writeFile(configURL, JSON.stringify(config, null, 2), 'utf8', (err) => {
          if (err) throw err;
          console.log('SSR：gui-config.json文件写入SSR列表成功');
      });
    });
  }
};
