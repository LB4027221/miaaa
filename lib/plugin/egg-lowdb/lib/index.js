'use strict';

const assert = require('assert');
const low = require('lowdb');
const axios = require('axios');
const FileAsync = require('lowdb/adapters/FileAsync');
const Base = require('lowdb/adapters/Base');
let count = 0;

class HTTPStorage extends Base {
  async read() {
    const response = await axios.get(this.source);
    return response.data;
  }
}

module.exports = (app) => {
  app.addSingleton('lowdb', async (config, app) => {
    assert(config.path && config.adapter, `[egg-lowdb] 'path: ${config.path}', 'adapter: ${config.adapter}' are required on config`);
    let db;

    const adapter = await new FileAsync(config.path)
    db = await low(adapter);

    app.beforeStart(() => {
      const index = count++;
      app.coreLogger.info(`[egg-lowdb] instance[${index}] status OK`);
    });
    return db;
  });
};