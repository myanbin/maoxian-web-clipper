//==========================================
// Storage Config for for XinhuaNote
//==========================================

const StorageConfig_XinhuaNote = {
  get: params => {
    // 动态改变默认配置
    const { config, userInput} = params;

    const defaultConfig = config;

    const storageConfig = Object.assign(defaultConfig, {
      userInput,
      clippingFolderName: null
    });

    return storageConfig;
  }
};

export default StorageConfig_XinhuaNote;