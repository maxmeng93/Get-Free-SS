const config = require('./config');
const getSS = require('./src/getSS');
const getSSR = require('./src/getSSR');

const { ss, ssr } = config;

getSS(ss);
getSSR(ssr);
