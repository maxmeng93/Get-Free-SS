const fs = require('fs');

fs.readFile('source.json', function (err, source) {
  if (err) {
      return console.error(err);
  }
  source = JSON.parse(source.toString());

  if (source.length === 0) {
    console.log('source数据为空');
    return;
  }

  const ssList = [];
  source.forEach(e => {
    ssList.push({
      server: e['账号'],
      server_port: e['端口'],
      password: e['密码'],
      method: e['加密方式'],
      plugin: "",
      plugin_opts: "",
      plugin_args: "",
      remarks: e['国家'] + ' ' + (Math.ceil(Math.random() * 10000)),
      timeout: 5
    });
  });

  fs.writeFile('data.json', JSON.stringify(ssList, null, 2), (err) => {
    if (err) throw err;
    console.log('文件已被保存，请查看data.json文件');
  });
});


