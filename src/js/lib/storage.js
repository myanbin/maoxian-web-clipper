  "use strict";

  //const browser = require('webextension-polyfill');

  const TYPE = 'local';

  function set(k, v){
    const d = {}
    d[k] = v
    return browser.storage[TYPE].set(d)
  }

  // keys: string or Array
  function remove(keys) {
    return browser.storage[TYPE].remove(keys);
  }

  function clear() {
    return browser.storage[TYPE].clear();
  }

  // WARNING: Firefox not support this
  function usedBytes() {
    return browser.storage[TYPE].getBytesInUse();
  }

  function get(k, defaultValue){
    return new Promise((resolve, reject) => {
      browser.storage[TYPE].get(k)
        .then((res) => {
          const v = res[k];
          if(defaultValue !== null && (typeof defaultValue !== 'undefined')){
            if(typeof v != 'undefined'){
              resolve(v)
            }else{
              set(k, defaultValue);
              resolve(defaultValue);
            }
          }else{
            resolve(v);
          }
        })
    });
  }

  function getAll() {
    return browser.storage[TYPE].get(null);
  }

  /*
   * backup all storaged data. according to filters
   *
   * A filter can return:
   *   "YES" => this item should be backuped.
   *   "NO"  => this item should not be backuped.
   *   "Next" => try next filter.
   *
   * return a Promise that resolve with a object.
   *
   */
  function backup(...filters) {
    if (filters.length === 0) {
      throw new Error("Not filter are provided.");
    }
    return new Promise((resolve, reject) => {
      getAll().then((data) => {
        const result = {};
        for (let k in data) {
          for (let i = 0; i < filters.length; i++) {
            const r = filters[i](k);
            if (r === 'YES') {
              result[k] = data[k];
              break;
            } else if (r === 'NO') {
              break;
            } else {
              // NEXT
            }
          }
        }
        resolve(result);
      })
    })
  }

  function restore(obj) {
    return browser.storage[TYPE].set(obj);
  }

  const Storage = {
    set: set,
    get: get,
    getAll: getAll,
    remove: remove,
    clear: clear,
    usedBytes: usedBytes,
    backup: backup,
    restore: restore,
  };

  export default Storage;
