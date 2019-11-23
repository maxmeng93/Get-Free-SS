const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const csvFilePath = path.join(__dirname, '../data/ss.csv');
const { ss: ssConfig } = require('../config');

csv({delimiter: '\t'})
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    if (!jsonObj || (jsonObj && jsonObj.length) === 0) {
      console.log('data/ss.csv 文件缺少数据');
      return;
    }
    const configURL = (ssConfig && ssConfig.url) || '';

    const ssList = jsonObj.map(e => {
      return {
        server: e.Address,
        server_port: e.Port,
        password: e.Password,
        method: e.Method,
        plugin: '',
        plugin_opts: '',
        plugin_args: '',
        remarks: e.field7 + ' ' + e.field6 + ' ' + (Math.ceil(Math.random() * 100)),
        timeout: 5
      };
    });
  
    fs.writeFile(path.join(__dirname, '../data/ss.json'), JSON.stringify(ssList, null, 2), (err) => {
      if (err) throw err;
      console.log('SS：数据已保存在 /data/ss.json 文件中');
    });

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
  
  });
