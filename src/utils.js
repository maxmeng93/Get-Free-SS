// base64解码
function atob(base64str) {
  return Buffer.from(base64str, 'base64').toString();
}

// base64编码
function btoa(str) {
  return Buffer.from(str).toString('base64');
}

/**
 * 解码 SSR 链接
 * @param {Array} ssrLinkList 
 */
function ssrDecode(ssrLinkList) {
  return ssrLinkList.map(ssr => {
    const result = atob(ssr.split('/')[2]);
    const val1= result.split('/')[0].split(':');
    const val2= result.split('/')[1].replace('?','').split('&');
  
    const config = {
      remarks : '',
      id : Math.random().toString().replace('0.', ''),
      server : val1[0],
      server_port : val1[1],
      server_udp_port : 0,
      password : atob(val1[5]),
      method : val1[3],
      protocol : val1[2],
      protocolparam : '',
      obfs : val1[4],
      obfsparam : '',
      remarks_base64 : '',
      group : '',
      enable : true,
      udp_over_tcp : false
    };
  
    val2.forEach(e => {
      if (!e) return;
      const ls= e.split('=');
      config[ls[0]] = atob(ls[1]);
      if (ls[0] === 'remarks') config.remarks_base64 = ls[1];
    });

    return config;
  });
}

module.exports = {
  atob,
  btoa,
  ssrDecode,
}