/**
 * enable: 是否开启对应的爬取功能
 * url: 软件链接
 */
module.exports = {
  // 服务器部署配置
  server: {
    port: '8888',
  },
  ss: {
    enable: true,
    url: 'F:\\Shadowsocks\\gui-config.json',
  },
  ssr: {
    enable: true,
    url: 'F:\\ShadowsocksR\\gui-config.json',
  },
  youneed: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36'
    }
  }
};
