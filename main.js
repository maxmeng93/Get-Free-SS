const config = require('./config');
const chalk = require('chalk');
const getSS = require('./src/getSS');
const getSSR = require('./src/getSSR');

const log = console.log;
const { ss, ssr } = config;

function errorMsg(error) {
  log(chalk.red(error));
}

getSS(ss).catch(errorMsg);
getSSR(ssr).catch(errorMsg);
