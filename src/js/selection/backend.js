  "use strict";

  import MxWcStorage from '../lib/storage.js';
  import SelectionStore from './store.js';

  // host => store
  const StoreDict = {};

  async function save({host, path, selection}) {
    const Store = await getStore(host);
    Store.set(path, selection);
    await saveStore(host, Store);
  }

  async function query({host, path}) {
    const Store = await getStore(host);
    return Store.get(path)
  }

  // all data storage in MxWcStorage will be removed
  async function reset() {
    const data = MxWcStorage.getAll();
    const keys = [];
    for (let k in data) {
      if (k.startsWith('selectionStore')) {
        keys.push(k);
      }
    }
    await MxWcStorage.remove(keys)
    restart();
  }

  // just clear StoreDict
  // force it to refetch from Storage
  function restart() {
    for (let key in StoreDict) {
      delete StoreDict[key];
    }
  }

  async function getStore(host) {
    let Store = StoreDict[host];
    if (!Store) {
      const treeHash = await MxWcStorage.get(getKey(host));
      Store = SelectionStore.create(treeHash);
      StoreDict[host] = Store;
    }
    return Store;
  }

  async function saveStore(host, Store) {
    const treeHash = Store.toHash();
    await MxWcStorage.set(getKey(host), treeHash);
  }


  function getKey(host) {
    return ['selectionStore', host].join('.');
  }

  const SelectionBackend = {
    save: save,
    query: query,
    reset: reset,
    restart: restart,
  }

  export default SelectionBackend;
